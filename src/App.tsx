import './App.scss';
import AboutPage from '@pages/about/about';
import Header from '@components/layout/header/Header';
import ThemeProvider from '@context/theme-provider';

//import Home from '@pages/home/Home';
//import HomeLayout from '@components/layout/home-layout/home-layout';
//import NotFoundPage from '@pages/not-found/not-found';
//import { Route, Routes } from 'react-router-dom';

/*const HOME_PATH = '/';
const RESERVE_HOME_PATH = '/index.html';
const ABOUT_PATH = '/about';
const OTHER_PATH = '*';*/

const App = () => {
  return (
    <ThemeProvider>
      <Header />
      <AboutPage />
    </ThemeProvider>
  );
};

export default App;
