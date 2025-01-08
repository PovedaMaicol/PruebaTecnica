import React, { useState, useEffect } from 'react';
import CardEmpresa from '../components/CardEmpresa';
import useFetch from '../hooks/useFetch';
import './styles/empresasPage.css'

const EmpresasPage = () => {
  const { data: empresas, fetchData, loading, error } = useFetch();

  useEffect(() => {
    const url = 'http://localhost:3001/api/empresas';
    fetchData(url);
  }, []);

  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para enviar los datos al backend y agregar una nueva empresa.
    console.log('Empresa añadida:', { name, city });
  };

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p>Hubo un error al cargar los datos: {error}</p>;

  // Filtra elementos inválidos
  const empresasValidas = empresas.filter((empresa) => empresa !== null && empresa !== undefined);

  return (
    <div>
      <button onClick={() => setIsVisible(!isVisible)}>Add Empresa</button>

      {isVisible && (
        <form onSubmit={handleSubmit}>
          <h3>Agregar Nueva Empresa</h3>
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
          <button type="submit">Agregar</button>
        </form>
      )}

      <div className="container-grid">
        {empresasValidas.map((empresa) => (
          <CardEmpresa key={empresa.id} empresa={empresa} />
        ))}
      </div>
    </div>
  );
};

export default EmpresasPage;
