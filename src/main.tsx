import '@assets/styles/app.scss';
import App from './App.tsx';
import ErrorBoundary from '@components/common/error-boundary.tsx';
import { store } from '@redux/store.ts';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
