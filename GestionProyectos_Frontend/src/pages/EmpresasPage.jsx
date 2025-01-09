import React, { useState, useEffect } from 'react';
import empresaService from '../services/empresa';
import CardEmpresa from '../components/CardEmpresa';
import useFetch from '../hooks/useFetch';
import './styles/empresasPage.css';

const EmpresasPage = ({ user, handleLogout }) => {
  const { data: empresas = [], fetchData, loading, error } = useFetch();
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [editingEmpresa, setEditingEmpresa] = useState(null);
  const base = import.meta.env.VITE_API_URL;
  const url = '/api/empresas'

  // Manejar la carga inicial de empresas
  useEffect(() => {
    const api = `${base}${url}`;
    fetchData(api);
  }, [empresas?.length]);



  // Crear una empresa
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newEmpresa = { name, city };

    try {
      if (editingEmpresa) {
        // Si estamos editando, actualizamos
        await empresaService.update(editingEmpresa.id, newEmpresa);
        // Actualizamos la empresa en el estado de empresas
        const updatedEmpresas = empresas.map((empresa) =>
          empresa.id === editingEmpresa.id ? { ...empresa, ...newEmpresa } : empresa
        );
        // Actualizamos el estado sin recargar los datos
        fetchData(); // Esto es innecesario, ya que estamos actualizando directamente el estado
        setEditingEmpresa(null); // Limpiar la empresa en edición
      } else {
        // Si estamos creando una nueva empresa
        const createdEmpresa = await empresaService.create(newEmpresa);
        // Añadimos la nueva empresa a la lista sin recargar los datos
        fetchData(); // Alternativamente, actualizaríamos el estado directamente aquí
      }

      // Limpiar los campos y ocultar el formulario
      setName('');
      setCity('');
      setIsVisible(false);
    } catch (error) {
      console.error('Error al agregar o actualizar empresa', error);
    }
  };

  // eliminar una empresa
  const handleDelete = async (id) => {
    console.log("El ID que se está pasando para eliminar es:", id);
    try {
      await empresaService.destroy(id); // Llamamos al servicio destroy para eliminar la empresa
      // Actualizamos el estado de empresas después de eliminar
      const updatedEmpresas = empresas.filter((empresa) => empresa.id !== id);
      fetchData(); // O alternativamente, puedes eliminar la empresa directamente del estado
    } catch (error) {
      console.error('Error al eliminar la empresa:', error);
    }
  };

  const handleEdit = (empresa) => {
    setEditingEmpresa(empresa);
    setName(empresa.name);
    setCity(empresa.city);
    setIsVisible(true); // Mostrar el formulario
  };

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p>Hubo un error al cargar los datos: {error}</p>;

  const empresasValidas = Array.isArray(empresas)
    ? empresas.filter((empresa) => empresa !== null && empresa !== undefined)
    : [];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <p>User: {user?.username}</p>
        <button onClick={handleLogout}>Cerrar sesión</button>
      </div>

      <button onClick={() => setIsVisible(!isVisible)}>Add Empresa</button>

      {isVisible && (
        <form onSubmit={handleSubmit}>
          <h3>{editingEmpresa ? 'Editar Empresa' : 'Agregar Nueva Empresa'}</h3>
          <label htmlFor="name">Nombre de la empresa:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label htmlFor="city">Ciudad:</label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
          <button type="submit">{editingEmpresa ? 'Actualizar' : 'Agregar'}</button>
        </form>
      )}

      <div className="container-grid">
        {empresasValidas.map((empresa) => (
          <CardEmpresa
            key={empresa.id}
            empresa={empresa}
            isVisible={isVisible}
            setIsVisible={setIsVisible}
            onEdit={() => handleEdit(empresa)} // Pasar la función para editar
            onDelete={(id) => handleDelete(id)}
          />
        ))}
      </div>
    </div>
  );
};

export default EmpresasPage;
