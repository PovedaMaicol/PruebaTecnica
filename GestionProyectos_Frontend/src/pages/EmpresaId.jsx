import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import empresaService from '../services/empresa'; // Asegúrate de que el archivo se llame correctamente
import './styles/empresaId.css';

const EmpresaId = () => {
  const { id } = useParams();
  const [empresaId, setEmpresaId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false); // Controla la visibilidad del formulario
  const [activity, setActivity] = useState('');

  const base = import.meta.env.VITE_API_URL;
  const url = '/api/empresas';
  console.log('en base ahi', base);

  // Cargar la empresa al cargar el componente
  const fetchEmpresa = async () => {
    try {
      const response = await fetch(`${base}${url}/${id}`);
      if (!response.ok) {
        throw new Error('No se encontró la empresa');
      }
      const data = await response.json();
      console.log('Datos de la empresa:', data);
      setEmpresaId(data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener la empresa:', error);
      setError('Error al cargar la empresa.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpresa();
  }, [id]);

  // AÑADIR HISTORIAS
  const handleSubmit = async (e) => {
    e.preventDefault();

    const nuevaHistoria = {
      activity,
    };

    try {
      const response = await empresaService.addHistory(id, nuevaHistoria); // Agregar historia
      const updatedHistorias = [...empresaId.historias, response]; // Actualizar solo las historias
      setEmpresaId({ ...empresaId, historias: updatedHistorias }); // Mantener el resto de los datos de la empresa
      setActivity('');
      setIsVisible(false);
    } catch (err) {
      console.error('Error al agregar la historia:', err.message);
      setError('No se pudo agregar la historia. Inténtalo de nuevo.');
    }
  };

  // EDITAR HISTORIAS
  const handleEditHistory = async (historiaId, newActivity) => {
    try {
      const response = await empresaService.updateHistory(id, historiaId, newActivity);
      const updatedHistorias = empresaId.historias.map((historia) =>
        historia._id === historiaId ? { ...historia, activity: newActivity } : historia
      );
      setEmpresaId({ ...empresaId, historias: updatedHistorias });
    } catch (err) {
      console.error('Error al editar la historia:', err.message);
    }
  };

  // ELIMINAR HISTORIA
  const handleDeleteHistory = async (historiaId) => {
    try {
      await empresaService.deleteHistory(id, historiaId);
      const updatedHistorias = empresaId.historias.filter((historia) => historia._id !== historiaId);
      setEmpresaId({ ...empresaId, historias: updatedHistorias });
    } catch (err) {
      console.error('Error al eliminar la historia:', err.message);
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar la empresa: {error}</p>;

  return (
    <div>
      {empresaId ? (
        <>
          <h3>{empresaId.name}</h3>
          <p>Ciudad: {empresaId.city}</p>
          <h2>Historias</h2>

          <div className="grid_container">
            {empresaId.historias && empresaId.historias.length > 0 ? (
              empresaId.historias.map((historia) => (
                <div key={historia._id} className="card_history">
                  <h6>{historia.activity}</h6>
                  <button onClick={() => handleEditHistory(historia._id, 'Nueva actividad')}>Editar</button>
                  <button onClick={() => handleDeleteHistory(historia._id)}>Eliminar</button>

                  {historia.tickets && historia.tickets.length > 0 ? (
                    historia.tickets.map((emp, index) => (
                      <p key={index}>{emp.titulo}</p>
                    ))
                  ) : (
                    <p>No hay tickets disponibles.</p>
                  )}
                </div>
              ))
            ) : (
              <p>No hay historias disponibles.</p>
            )}
          </div>
        </>
      ) : (
        <p>No se encontró la empresa.</p>
      )}

      {/* Botón para mostrar el formulario */}
      <button onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? 'Cancelar' : 'Agregar historia'}
      </button>

      {/* Formulario para agregar historia */}
      {isVisible && (
        <form onSubmit={handleSubmit}>
          <h3>Agregar Nueva Historia</h3>
          <label htmlFor="activity">Actividad:</label>
          <input
            type="text"
            id="activity"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            required
          />
          <button type="submit">Agregar</button>
        </form>
      )}
    </div>
  );
};

export default EmpresaId;
