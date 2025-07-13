import CharacterApiService from '@services/api/apiService';
import React from 'react';
import style from './ErrorTestButton.module.scss';

class ErrorTestButton extends React.Component {
  triggerError = async () => {
    await CharacterApiService.triggerTestError();
  };

  render() {
    return (
      <div className={style.buttonWrapper}>
        <button onClick={this.triggerError} className={style.errorButton}>
          Generate Error
        </button>
      </div>
    );
  }
}

export default ErrorTestButton;
