import './App.scss';
import AboutPage from './pages/about/about';
import Header from '@components/layout/header/Header';
import Home from '@pages/home/Home';
import HomeLayout from '@components/layout/home-layout/HomeLayout';
import { Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { NotFoundPage } from './pages/not-found/not-found';

const HOME_PATH = '/';
const RESERVE_HOME_PATH = '/index.html';
const ABOUT_PATH = '/about';
const OTHER_PATH = '*';

const App = () => {
  return (
    <ThemeProvider>
      <div className="app">
        <Header />
        <Routes>
          <Route element={<HomeLayout />}>
            <Route path={HOME_PATH} element={<Home />} />
            <Route path={RESERVE_HOME_PATH} element={<Home />} />
          </Route>

          <Route path={ABOUT_PATH} element={<AboutPage />} />
          <Route path={OTHER_PATH} element={<NotFoundPage />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
};

export default App;
