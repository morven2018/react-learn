import CharacterApiService from '@services/api/apiService';
import React from 'react';

class ErrorTestButton extends React.Component {
  triggerError = async () => {
    await CharacterApiService.triggerTestError();
  };

  render() {
    return <button onClick={this.triggerError}>Generate Error</button>;
  }
}

export default ErrorTestButton;
