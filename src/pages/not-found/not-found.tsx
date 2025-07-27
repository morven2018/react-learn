import style from './not-found.module.scss';
import { useNavigate } from 'react-router-dom';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <main>
      <div className={style.notFoundPage}>
        <h2 className={style.header}>This page doesn’t exist.</h2>
        <button onClick={handleGoHome} className={style.homeButton}>
          Home
        </button>
      </div>
    </main>
  );
};

export default NotFoundPage;
