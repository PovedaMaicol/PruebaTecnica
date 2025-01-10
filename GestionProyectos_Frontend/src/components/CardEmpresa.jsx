import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import './styles/cardEmpresa.css';

const CardEmpresa = ({ empresa, onDelete }) => {
  if (!empresa) return null;

  return (
    <Card className="card-empresa mb-3">
      <Card.Body>
        {/* Encabezado con botones */}
        <div className="d-flex justify-content-between align-items-center">
          <Card.Title>{empresa.name}</Card.Title>
          <div>
          <i className='bx bx-trash' onClick={() => onDelete(empresa.id)}></i>
             
          
          
          </div>
        </div>
        
     
        <Card.Text>Ciudad: {empresa.city}</Card.Text>
        

        <Link to={`/empresas/${empresa.id}`} className="btn btn-link p-0">
          Ver detalles
        </Link>
      </Card.Body>
    </Card>
  );
};

export default CardEmpresa;
