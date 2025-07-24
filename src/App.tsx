import './App.scss';
import AboutPage from './pages/about/about';
import Header from '@components/layout/header/Header';
import Main from 'src/pages/home/Home';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { NotFoundPage } from './pages/not-found/not-found';

const HOME_PATH = '/';
const RESERVE_HOME_PATH = '/index.html';
const ABOUT_PATH = '/about';
const OTHER_PATH = '*';

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <Header />
        <Routes>
          <Route path={HOME_PATH} element={<Main />} />
          <Route path={RESERVE_HOME_PATH} element={<Main />} />
          <Route path={ABOUT_PATH} element={<AboutPage />} />
          <Route path={OTHER_PATH} element={<NotFoundPage />} />
        </Routes>
      </div>
    );
  }
}

export default App;
