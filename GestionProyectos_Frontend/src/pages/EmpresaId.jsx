import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import empresaService from '../services/empresa';
import { Button, Card, Container, Form, Spinner, Alert, Row, Col } from 'react-bootstrap';
import './styles/empresaId.css';

const EmpresaId = () => {
  const { id } = useParams();
  const [empresaId, setEmpresaId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activity, setActivity] = useState('');
  const [editingHistoryId, setEditingHistoryId] = useState(null);

  const base = import.meta.env.VITE_API_URL;
  const url = '/api/empresas';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevaHistoria = { activity };

    try {
      if (editingHistoryId) {
        await empresaService.updateHistory(id, editingHistoryId, activity);
        const updatedHistorias = empresaId.historias.map((historia) =>
          historia._id === editingHistoryId ? { ...historia, activity } : historia
        );
        setEmpresaId({ ...empresaId, historias: updatedHistorias });
        setEditingHistoryId(null);
      } else {
        const response = await empresaService.addHistory(id, nuevaHistoria);
        const updatedHistorias = [...empresaId.historias, response];
        setEmpresaId({ ...empresaId, historias: updatedHistorias });
      }
      setActivity('');
      setIsVisible(false);
    } catch (err) {
      setError('No se pudo agregar o actualizar la historia. Inténtalo de nuevo.');
    }
  };

  const handleEditHistory = (historiaId, currentActivity) => {
    setEditingHistoryId(historiaId);
    setActivity(currentActivity);
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
        <h4 style={{margin: 0}}>Historias</h4>
        <p>Empresa {empresaId.name}<br/>
        Ciudad: {empresaId.city}</p>
        
          </div>




          {isVisible && (
        <Form className="mt-4" onSubmit={handleSubmit}>

          <div style={{
            display: 'flex', 
            justifyContent: 'space-between'}}>

          <h5>{editingHistoryId ? 
          'Editar Historia' : 'Agregar Nueva Historia'}
          </h5>

          <i className='bx bx-x-circle' 
          style={{'color': 'red', 'fontSize':'18px'}}
          onClick={() => setIsVisible(!isVisible)}></i>

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
                      <Card.Title>{historia.activity}</Card.Title>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEditHistory(historia._id, historia.activity)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteHistory(historia._id)}
                      >
                        Eliminar
                      </Button>
                      {historia.tickets && historia.tickets.length > 0 ? (
                        historia.tickets.map((ticket, index) => (
                          <Card.Text key={index} className="mt-2">
                           <span style={{'fontWeight': 'bold'}}>Ticket {index+1}</span> {ticket.titulo}
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
