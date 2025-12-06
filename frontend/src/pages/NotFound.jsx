// Page for 404 Not Found
import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1>
        4
        <img className="gif" src="https://media.tenor.com/OF1DTe387GoAAAAM/gato-cat.gif" alt="0" />
        4
      </h1>
      <p>Oops! The page you're looking for does not exist.</p>
      <Link to="/" className="home-link">Go back to Home</Link>
    </div>
  );
};

export default NotFound;
