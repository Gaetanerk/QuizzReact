import React from 'react';
import './styles/quizz.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import CreateUser from './components/CreateUser';
import Game from './components/Game';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/createUser" element={<CreateUser />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </Router>
  );
};

export default App;