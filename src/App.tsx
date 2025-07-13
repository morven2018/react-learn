import './App.css';
import Header from '@components/layout/header/Header';
import Main from '@components/layout/main/Main';
import React from 'react';

class App extends React.Component<{}, AppState> {
  render() {
    return (
      <div className="app">
        <Header />
        <Main />
      </div>
    );
  }
}

export default App;
