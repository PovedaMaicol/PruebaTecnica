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
  const [editingEmpresa, setEditingEmpresa] = useState(null); // Para guardar la empresa que se va a editar

  useEffect(() => {
    console.log('empresas es', empresas);
    const url = 'http://localhost:3001/api/empresas';
    fetchData(url);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newEmpresa = { name, city };

    try {
      // Si hay una empresa en edición, actualiza
      if (editingEmpresa) {
        await empresaService.update(editingEmpresa.id, newEmpresa);
        fetchData(); // Para obtener la lista actualizada de empresas
        setEditingEmpresa(null); // Limpiar la empresa en edición
      } else {
        // Si no estamos editando, crear una nueva empresa
        await empresaService.create(newEmpresa);
        fetchData(); // Solo si quieres asegurarte de que el servidor tiene la última lista de empresas.
      }

      // Limpiar los campos
      setName('');
      setCity('');
      setIsVisible(false);
    } catch (error) {
      console.error('Error al agregar o actualizar empresa', error);
    }
  };

  const handleEdit = (empresa) => {
    setEditingEmpresa(empresa);
    setName(empresa.name); // Rellenar los campos con la información actual
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
          />
        ))}
      </div>
    </div>
  );
};

export default EmpresasPage;
