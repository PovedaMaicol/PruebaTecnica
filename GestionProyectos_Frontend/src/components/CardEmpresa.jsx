import React from 'react';
import { Link } from 'react-router-dom';
import './styles/cardEmpresa.css';

const CardEmpresa = ({ empresa }) => {
  if (empresa) {
    return (
      <div className="card-empresa">
        <Link to={`/empresas/${empresa.id}`}>
        <h4>{empresa.name}</h4>
        <p>{empresa.city}</p>
        </Link>
         
      </div>
    );
  }

    return null;
};

export default CardEmpresa;
