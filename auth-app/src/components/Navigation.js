import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  return (
    <nav className="navigation">
      <ul>
        <li>
          <Link to="/logistics-dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/truck-space-analyzer">Space Analyzer</Link>
        </li>
        <li>
          <Link to="/tokenized-spaces">Tokenized Spaces</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation; 