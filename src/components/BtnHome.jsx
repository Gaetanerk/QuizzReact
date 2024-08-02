import React from 'react';
import { useNavigate } from 'react-router-dom';

const BtnHome = () => {
  const navigate = useNavigate(); // Utilisez le hook useNavigate

  const handleClick = () => {
    navigate('/home'); // Redirection vers /home
  };

  return (
    <button className="btnHome" onClick={handleClick}>
        Accueil
    </button>
  );
};

export default BtnHome;