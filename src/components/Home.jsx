import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/json/users.json')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleChange = (event) => {
    const userName = event.target.value;
    setSelectedUser(userName);

    const user = users.find(u => u.name === userName);
    if (user) {
      navigate('/game', { state: { user } });
    }
  };

  return (
    <>
      <div id="logoTitle">
        <img src="/images/2iquizz.png" alt="logo" />
      </div>
      <div id="logInOrCreate">
        <select id="userSelect" value={selectedUser} onChange={handleChange}>
          <option value="">Utilisez votre joueur</option>
          {users.map((user) => (
            <option key={user.name} value={user.name}>
              {user.name}
            </option>
          ))}
        </select>
        <p>OU</p>
        <button className="btnCreateUser" onClick={() => navigate('/createUser')} type="button">
          Créer un joueur
        </button>
      </div>
    </>
  );
};

export default Home;