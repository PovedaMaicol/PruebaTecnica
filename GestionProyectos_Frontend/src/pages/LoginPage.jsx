import React from 'react';
import './styles/loginPage.css';
import { Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const LoginPage = ({
  setUser,
  handleLogin,
  username,
  password,
  setUsername,
  setPassword,
  setErrorMessage,
  errorMessage,
}) => {
  const btn = {
    margin: '0 auto',
    display: 'flex',
    textAlign: 'center', // Propiedad corregida
    width: '150px',
    justifyContent: 'center',
  };

  return (
    <div className='padre container'>
      <div className='contenedor'>
        <div className='cabezote'>
          <i className='fa-regular fa-pen-to-square'></i>
          <h1>Empresas</h1>
          <br />
          <p>SIGN IN TO CONTINUE <br/>
          <a href='/empresas#/users'>or Register Here</a></p>
        </div>

        {errorMessage && <div className='error-message'>{errorMessage}</div>}

        <Form className='form' onSubmit={handleLogin}>
          <Form.Group>
            <Form.Control
              type='text'
              data-testid='username'
              value={username}
              name='Username'
              placeholder='username'
              onChange={({ target }) => setUsername(target.value)}
            />
          </Form.Group>
          <br />
          <Form.Group>
            <Form.Control
              type='password'
              data-testid='password'
              value={password}
              name='Password'
              placeholder='password'
              onChange={({ target }) => setPassword(target.value)}
            />
            <br />
          </Form.Group>
          <br />
          <Button style={btn} variant='primary' type='submit'>
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
