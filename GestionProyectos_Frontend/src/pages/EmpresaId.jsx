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
  const [editingHistoryId, setEditingHistoryId] = useState(null); // Para saber si estamos editando una historia

  const base = import.meta.env.VITE_API_URL;
  const url = '/api/empresas';

  // Cargar la empresa al cargar el componente
  const fetchEmpresa = async () => {
    try {
      const response = await fetch(`${base}${url}/${id}`);
      if (!response.ok) {
        throw new Error('No se encontró la empresa');
      }
      const data = await response.json();
      setEmpresaId(data);
      setLoading(false);
    } catch (error) {
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

    const nuevaHistoria = { activity };

    try {
      if (editingHistoryId) {
        // Si estamos editando una historia
        await empresaService.updateHistory(id, editingHistoryId, activity);
        const updatedHistorias = empresaId.historias.map((historia) =>
          historia._id === editingHistoryId ? { ...historia, activity } : historia
        );
        setEmpresaId({ ...empresaId, historias: updatedHistorias });
        setEditingHistoryId(null); // Reseteamos el ID de la historia que estamos editando
      } else {
        // Si estamos agregando una nueva historia
        const response = await empresaService.addHistory(id, nuevaHistoria);
        const updatedHistorias = [...empresaId.historias, response];
        setEmpresaId({ ...empresaId, historias: updatedHistorias });
      }

      setActivity(''); // Limpiar el campo de actividad
      setIsVisible(false); // Ocultar el formulario
    } catch (err) {
      setError('No se pudo agregar o actualizar la historia. Inténtalo de nuevo.');
    }
  };

  // EDITAR HISTORIAS
  const handleEditHistory = (historiaId, currentActivity) => {
    setEditingHistoryId(historiaId);
    setActivity(currentActivity); // Llenar el formulario con la actividad actual de la historia
    setIsVisible(true); // Mostrar el formulario para editar
  };

  // ELIMINAR HISTORIA
  const handleDeleteHistory = async (historiaId) => {
    try {
      const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta historia?');
      if (!confirmDelete) return;

      await empresaService.deleteHistory(id, historiaId);
      const updatedHistorias = empresaId.historias.filter((historia) => historia._id !== historiaId);
      setEmpresaId({ ...empresaId, historias: updatedHistorias });
    } catch (err) {
      setError('No se pudo eliminar la historia. Inténtalo de nuevo.');
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
                  <button onClick={() => handleEditHistory(historia._id, historia.activity)}>
                    Editar
                  </button>
                  <button onClick={() => handleDeleteHistory(historia._id)}>Eliminar</button>

                  {historia.tickets && historia.tickets.length > 0 ? (
                    historia.tickets.map((emp, index) => <p key={index}>{emp.titulo}</p>)
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
        {isVisible ? 'Cancelar' : 'Agregar'}
      </button>

      {/* Formulario para agregar o editar historia */}
      {isVisible && (
        <form onSubmit={handleSubmit}>
          <h3>{editingHistoryId ? 'Editar Historia' : 'Agregar Nueva Historia'}</h3>
          <label htmlFor="activity">Actividad:</label>
          <input
            type="text"
            id="activity"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            required
          />
          <button type="submit">{editingHistoryId ? 'Actualizar' : 'Agregar'}</button>
        </form>
      )}
    </div>
  );
};

export default EmpresaId;
