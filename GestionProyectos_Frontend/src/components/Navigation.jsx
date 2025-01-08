import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Navigation = ({ user, handleLogout }) => {

    if (!user) return null; 

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">EmpresasApp</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/empresas">Empresas</Nav.Link>
            <Nav.Link as={Link} to="/empresas/1">Ver Empresa</Nav.Link>
            <Nav.Link as={Link} onClick={handleLogout} to="/">Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
