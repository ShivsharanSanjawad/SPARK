import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';

// Create the root React node and render the application
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


