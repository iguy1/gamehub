import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
import gaming from './gaming.gif'; 

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <img src={gaming} alt="Logo" className="logo-image" style={{ width: "120px" }} />
            <span className="logo-text">GameHub</span>
          </Link>
        </div>
        <div className={`navbar-links ${isOpen ? 'open' : ''}`}>
          <ul>
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <Link to="/tictactoe">TicTacToe</Link>
            </li>
            <li>
              <Link to="/game">Regular Show</Link>
            </li>
            <li>
              <Link to="/">Copter Game</Link>
            </li>
            <li>
              <Link to = "/slither">SnakeGame</Link>
            </li>
            <li>
              <Link to="/chess">Chess</Link>
            </li>
          </ul>
        </div>
        <div className="navbar-toggle" onClick={toggleNavbar}>
          <span className="navbar-toggle-icon">&#9776;</span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;