import React, { useState, useEffect } from 'react';
import empresaService from '../services/empresa';
import CardEmpresa from '../components/CardEmpresa';
import useFetch from '../hooks/useFetch';
import './styles/empresasPage.css';
import { Form, Button, InputGroup } from "react-bootstrap";


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
      alert('no tienes permiso para borrar esta empresa')
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
    <div className='container'>
      
      <div className='info_usuario'>
        Empresas <br/>
        User: {user?.username}
        <i className='bx bx-log-out' style={{fontSize: '30px'}} onClick={() => handleLogout()}></i>
        
      </div>
    

      <Button onClick={() => setIsVisible(!isVisible)}>
  {isVisible ? "Cancelar" : "Add Empresa"}
</Button>


      {isVisible && (

        <div className='container_form'>
  <Form onSubmit={handleSubmit} noValidate>
    <h3 className="mb-4">
      {editingEmpresa ? "Editar Empresa" : "Agregar Nueva Empresa"}
    </h3>

    {/* Campo: Nombre de la empresa */}
    <Form.Group controlId="formName" className="mb-3">
      <Form.Label>Nombre de la empresa:</Form.Label>
      <InputGroup>
       
        <Form.Control
          type="text"
          placeholder="Nombre de la empresa"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </InputGroup>
      <Form.Control.Feedback type="invalid">
        Por favor, ingresa el nombre de la empresa.
      </Form.Control.Feedback>
    </Form.Group>

    {/* Campo: Ciudad */}
    <Form.Group controlId="formCity" className="mb-3">
      <Form.Label>Ciudad:</Form.Label>
      <InputGroup>
   
        <Form.Control
          type="text"
          placeholder="Ciudad"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
      </InputGroup>
      <Form.Control.Feedback type="invalid">
        Por favor, ingresa la ciudad.
      </Form.Control.Feedback>
    </Form.Group>

    <Button type="submit" variant="success" className="w-100">
      {editingEmpresa ? "Actualizar" : "Agregar"}
    </Button>
  </Form>
  </div>
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
