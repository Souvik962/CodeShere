import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { useThemeStore } from './store/useThemeStore.js';

// Initialize theme before rendering the app
const themeStore = useThemeStore.getState();
themeStore.initializeTheme();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);