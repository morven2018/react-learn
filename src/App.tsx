import Loading from './components/fallback/loading-fallback';
import MainContent from './components/main/main-content';
import React, { useEffect, useState } from 'react';

const App: React.FC = () => {
  return (
    <div className="app">
      <header>
        <h1>React Performance. CO2 Emissions Data</h1>
      </header>

      <main>
        <React.Suspense fallback={<Loading />}>
          <MainContent />
        </React.Suspense>
      </main>
    </div>
  );
};

export default App;
