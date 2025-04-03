import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration'; // 👈
import './index.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// 👇 Enable offline capabilities
serviceWorkerRegistration.register();
