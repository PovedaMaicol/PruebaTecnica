import React from 'react';
import { Link } from 'react-router-dom';
import './styles/cardEmpresa.css';

const CardEmpresa = ({ empresa, setIsVisible, isVisible }) => {
  if (empresa) {
    return (
      <div className="card-empresa">
        <div style={{zIndex: 10}}>
          <i className='bx bxs-x-square'></i>
          <i className='bx bx-edit'  ></i>
          
          </div>
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
