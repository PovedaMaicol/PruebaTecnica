import React, { useState, useEffect } from 'react';
import CardEmpresa from '../components/CardEmpresa';
import useFetch from '../hooks/useFetch';

const EmpresasPage = () => {
  const { data: empresas, fetchData, loading, error } = useFetch();

  useEffect(() => {
    const url = 'http://localhost:3001/api/empresas';
    fetchData(url);
  }, []);

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p>Hubo un error al cargar los datos: {error}</p>;

  // Filtra elementos inválidos
  const empresasValidas = empresas.filter((empresa) => empresa !== null && empresa !== undefined);

  return (
    <div>
      <h1>Empresas</h1>
      
      <div>
        {empresasValidas.map((empresa) => (
          <CardEmpresa key={empresa.id} empresa={empresa} />
        ))}
      </div>
    </div>
  );
};

export default EmpresasPage;
