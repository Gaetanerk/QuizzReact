import React, { useState } from 'react';
import BtnHome from './BtnHome';
import '../styles/quizz.css';
import Logo from './Logo';

const CreateUser = () => {
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [error, setError] = useState('');

  const avatars = [
    '/images/avatars/1.png',
    '/images/avatars/2.png',
    '/images/avatars/3.png',
    '/images/avatars/4.png',
  ];

  const handleSubmit = () => {
    if (!username || !selectedAvatar) {
      setError('Veuillez sélectionner un avatar et saisir un nom.');
      return;
    }

    const newUser = {
      name: username,
      score: 0,
      niveau: 1,
      avatar: parseInt(selectedAvatar),
    };

    fetch('http://localhost:3001/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Utilisateur ajouté:', data);
      setUsername('');
      setSelectedAvatar(null);
      setError('');
    })
    .catch(error => {
      console.error('Erreur lors de l\'ajout de l\'utilisateur:', error);
      setError('Une erreur est survenue.');
    });
  };

  return (
    <>
      <div className="nav">
        <Logo />
        <BtnHome />
      </div>
      <div className="avatarSelection">
        {avatars.map((avatar, index) => (
          <label key={index} className="avatarOption">
            <span className="avatarCircle">
              <img src={avatar} alt={`Avatar ${index + 1}`} />
            </span>
            <input 
              type="radio" 
              name="avatar" 
              value={index + 1} 
              onChange={(e) => setSelectedAvatar(e.target.value)} 
            />
          </label>
        ))}
      </div>
      <div id="formCreateUser">
        <input 
          type="text" 
          placeholder="Nom" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button className="btnCreateUser" type="button" onClick={handleSubmit}>
          Créer le joueur
        </button>
        {error && <p className="error">{error}</p>}
      </div>
    </>
  );
};

export default CreateUser;