import CharacterApiService from '@services/api/apiService';
import React from 'react';
import style from './ErrorTestButton.module.scss';

const ErrorTestButton = () => {
  const triggerError = React.useCallback(async () => {
    await CharacterApiService.triggerTestError();
  }, []);

  return (
    <div className={style.buttonWrapper}>
      <button onClick={triggerError} className={style.errorButton}>
        Generate Error
      </button>
    </div>
  );
};

export default ErrorTestButton;
