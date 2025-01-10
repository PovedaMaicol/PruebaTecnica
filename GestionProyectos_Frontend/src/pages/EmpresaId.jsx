import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import empresaService from '../services/empresa';
import { Button, Card, Container, Form, Spinner, Alert, Row, Col } from 'react-bootstrap';
import './styles/empresaId.css';

const EmpresaId = ( {user }) => {
  const { id } = useParams();
  const [empresaId, setEmpresaId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activity, setActivity] = useState('');
  const [editingHistoryId, setEditingHistoryId] = useState(null);


  // TICKETS
  const [tickets, setTickets] = useState([]);
  const [ticketInput, setTicketInput] = useState('');


  const base = import.meta.env.VITE_API_URL;
  const url = '/api/empresas';

  // Cambia la función fetchEmpresa para usar empresaService.getById
  const fetchEmpresa = async () => {
    try {
      const data = await empresaService.getById(id); // Llama al servicio para obtener los datos
      console.log('los datos traidos son', data)
      setEmpresaId(data); // Guarda los datos en el estado
      setLoading(false);
    } catch (error) {
      setError('Error al cargar la empresa.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpresa(); // Ejecuta la función al montar el componente
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevaHistoria = { activity, tickets };
  
    try {
      // Si estamos editando una historia existente, usamos updateHistory
      if (editingHistoryId) {
        await empresaService.updateHistory(id, editingHistoryId, activity);
        const updatedHistorias = empresaId.historias.map((historia) =>
          historia._id === editingHistoryId ? { ...historia, activity, tickets } : historia
        );
        setEmpresaId({ ...empresaId, historias: updatedHistorias });
        setEditingHistoryId(null);
      } else {
        // Si estamos creando una nueva historia, usamos addHistory
        const response = await empresaService.addHistory(id, nuevaHistoria);
        const updatedHistorias = [...empresaId.historias, response];
        setEmpresaId({ ...empresaId, historias: updatedHistorias });
      }
  
      // Limpiar formulario y cerrar vista
      setActivity('');
      setTickets([]);
      setIsVisible(false);
    } catch (err) {
      setError('No se pudo agregar o actualizar la historia. Inténtalo de nuevo.');
    }
  };
  

  const handleEditHistory = (historiaId, currentActivity, currentTickets) => {
    setEditingHistoryId(historiaId);
    setActivity(currentActivity);
    setTickets(currentTickets || []);  // Cargar los tickets de la historia
    setIsVisible(true);
  };
  

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

  if (loading)
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Cargando...</p>
      </Container>
    );
  if (error)
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  return (
    <Container className="mt-3">
      {empresaId ? (
        <>
          <div className='info_empresa'>
            <div>
              <h4 style={{ margin: 0 }}>Historias</h4>
              <p>Empresa {empresaId.name}<br />
                Ciudad: {empresaId.city}</p>
            </div>

            {isVisible && (
        <Form className="mt-4" onSubmit={handleSubmit}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h5>{editingHistoryId ? 'Editar Historia' : 'Agregar Nueva Historia'}</h5>
          <i
            className="bx bx-x-circle"
            style={{ color: 'red', fontSize: '18px' }}
            onClick={() => setIsVisible(!isVisible)}
          ></i>
        </div>
      
        <Form.Group controlId="activity">
          <Form.Label>Historia</Form.Label>
          <Form.Control
            type="text"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            required
          />
        </Form.Group>
      
        <Form.Group controlId="ticket">
          <Form.Label>Ticket</Form.Label>
          <Form.Control
            type="text"
            value={ticketInput}
            onChange={(e) => setTicketInput(e.target.value)}
          />
          <Button
            variant="outline-primary"
            type="button"
            onClick={() => {
              if (ticketInput) {
                setTickets([...tickets, ticketInput]);
                setTicketInput('');
              }
            }}
            className="mt-2"
          >
            Agregar Ticket
          </Button>
        </Form.Group>
      
        <div>
          <strong>Tickets:</strong>
          <ul>
            {tickets.map((ticket, index) => (
              <li key={index}>
                {ticket} 
               
                  <i className='bx bx-x' 
                  onClick={() => {
                    const updatedTickets = tickets.filter((_, i) => i !== index);
                    setTickets(updatedTickets);  // Eliminar ticket
                  }}></i>
               
              </li>
            ))}
          </ul>
        </div>
      
        <Button variant="success" type="submit" className="mt-3">
          {editingHistoryId ? 'Actualizar' : 'Agregar'}
        </Button>
      </Form>
           
            )}

            <div>
              <Button
                variant="primary"
                className="mt-3"
                onClick={() => setIsVisible(!isVisible)}
              >
                {isVisible ? 'Cancelar' : 'Agregar'}
              </Button>
            </div>
          </div>

          <Row className="gy-3">
            {empresaId.historias && empresaId.historias.length > 0 ? (
              empresaId.historias.map((historia) => (
                <Col key={historia._id} md={4}>
                  <Card>
                    <Card.Body>

                      <div className='titular_history'>
                      <Card.Title>
                      <span style={{fontWeight: 'lighter'}}>Actividad:</span> {historia.activity}</Card.Title>
                      
                     <div className='contenedor_iconos'>


                      <i 
                      className='bx bx-edit'
                      style={{fontSize: '20px'}}
                      onClick={() => handleEditHistory(historia._id, historia.activity, historia.tickets)}></i>

                      <i 
                      className='bx bx-trash' 
                      style={{fontSize: '20px'}} 
                      onClick={() => handleDeleteHistory(historia._id)}
                      ></i>
                      </div>
                      </div>
                      
                      
                    
                      {historia.tickets && historia.tickets.length > 0 ? (
                        historia.tickets.map((ticket, index) => (
                          <Card.Text key={index} className="mt-2">
                            <span style={{ 'fontWeight': 'bold' }}>Ticket {index + 1}</span> {ticket}
                          </Card.Text>
                        ))
                      ) : (
                        <Card.Text>No hay tickets disponibles.</Card.Text>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <p>No hay historias disponibles.</p>
            )}
          </Row>
        </>
      ) : (
        <p>No se encontró la empresa.</p>
      )}
    </Container>
  );
};

export default EmpresaId;
