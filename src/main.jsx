// main.jsx - the entry point. It starts React and shows <App /> inside the
// <div id="root"> that lives in index.html.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Load Bootstrap's ready-made styles for the whole app.
import 'bootstrap/dist/css/bootstrap.min.css';
// Our own small CSS file goes AFTER Bootstrap so it can override it.
import './index.css';

import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
