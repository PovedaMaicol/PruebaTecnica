import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import userService from '../services/users';
import './styles/registrationForm.css'


const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    password: '',
  });

  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate(); // Inicializa el hook useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userService.register(formData); // Llama al servicio para registrar al usuario
      setSuccessMessage('Usuario registrado exitosamente');
      setTimeout(() => {
        navigate('/'); // Redirige al usuario al path '/login'
      }, 2000); // Agrega un pequeño retraso para que el usuario vea el mensaje de éxito
    } catch (error) {
      setErrorMessage('Error al registrar usuario. Verifica los datos.');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2>Registro de Usuario</h2>
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUsername" className="mb-3">
              <Form.Label>Nombre de usuario</Form.Label>
              <Form.Control
                type="text"
                name="username"
                placeholder="Ingresa tu nombre de usuario"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formName" className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Ingresa tu nombre completo"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Ingresa tu contraseña"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

<div className='container_btn'>
<Button variant="primary" type="submit">
Registrarse
</Button>
<Button variant="second" onClick={() => navigate('/')}>Cancelar</Button>
</div>
            
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RegistrationForm;
