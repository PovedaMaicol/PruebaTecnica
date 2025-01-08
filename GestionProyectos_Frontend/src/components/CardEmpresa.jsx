import React from 'react';
import { Link } from 'react-router-dom';

const CardEmpresa = ({ empresa }) => {
  if (empresa) {
    return (
      <div className="card-empresa">
        <Link to={`/empresas/${empresa.id}`}>
        <h2>{empresa.name}</h2>
        </Link>
         
      </div>
    );
  }

    return null;
};

export default CardEmpresa;
