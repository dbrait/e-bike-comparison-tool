import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { EBikeProvider } from './context/EBikeContext';

ReactDOM.render(
  <React.StrictMode>
    <EBikeProvider>
      <App />
    </EBikeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);