import ErrorBoundary from './components/fallback/error-boundary';
import ErrorFallback from './components/fallback/error-fallback';
import Loading from './components/fallback/loading-fallback';
import MainContent from './components/main/main-content';
import React from 'react';

const App: React.FC = () => {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="app">
      <header>
        <h1>React Performance. CO2 Emissions Data</h1>
      </header>

      <main>
        <ErrorBoundary fallback={<ErrorFallback onRetry={handleRetry} />}>
          <React.Suspense fallback={<Loading />}>
            <MainContent />
          </React.Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
};

export default App;
