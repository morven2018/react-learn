import './App.css';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import { Component } from 'react';

class App extends Component {
  state = {
    count: 0,
  };

  handleIncrement = () => {
    this.setState((prevState: { count: number }) => ({
      count: prevState.count + 1,
    }));
  };

  render() {
    return (
      <>
        <div>
          <a href="https://vite.dev" target="_blank" rel="noreferrer">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noreferrer">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card">
          <button onClick={this.handleIncrement}>
            count is {this.state.count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </>
    );
  }
}

export default App;
