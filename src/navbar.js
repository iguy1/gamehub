import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
import gaming from './gaming.gif'; 

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
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
              <Link to="/slither">SnakeGame</Link>
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
      <div className="navbar-dropdown" onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
        <button className="dropdown-button">Games</button>
        {isDropdownOpen && (
          <div className="dropdown-content">
            <Link to="/home">Home</Link>
            <Link to="/tictactoe">TicTacToe</Link>
            <Link to="/game">Regular Show</Link>
            <Link to="/">Copter Game</Link>
            <Link to="/slither">SnakeGame</Link>
            <Link to="/chess">Chess</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;