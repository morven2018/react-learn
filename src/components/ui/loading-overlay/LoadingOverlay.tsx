import React from 'react';
import Spinner from '../spinner/Spinner';
import styles from './LoadingOverlay.module.scss';

const message = 'Loading...';

interface LoadingOverlayProps {
  visible: boolean;
}

class LoadingOverlay extends React.Component<LoadingOverlayProps> {
  render() {
    const { visible } = this.props;

    if (!visible) return null;

    return (
      <div className={styles.overlay}>
        <div className="loading-content">
          <Spinner />
          {message && <span className="loading-text">{message}</span>}
        </div>
      </div>
    );
  }
}

export default LoadingOverlay;
