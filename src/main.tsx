import './index.scss';
import App from './App.tsx';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const element = document.getElementById('root');
if (element)
  createRoot(element).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
