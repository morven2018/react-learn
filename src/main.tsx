import '@assets/styles/app.scss';
import './index.css';
import App from './App.tsx';
import ErrorBoundary from '@components/common/ErrorBoundary.tsx';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
