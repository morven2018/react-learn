import { useNavigate } from 'react-router-dom';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <main>
      <div>
        <h2>This page doesn’t exist.</h2>
        <button onClick={handleGoHome}>Home</button>
      </div>
    </main>
  );
};

export default NotFoundPage;
