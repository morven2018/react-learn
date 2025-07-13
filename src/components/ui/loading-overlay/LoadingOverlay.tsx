import React from 'react';
import Spinner from './spinner/Spinner';
import styles from './spinner/Spinner.module.scss';

interface LoadingOverlayProps {
  visible: boolean;
}

class LoadingOverlay extends React.Component<LoadingOverlayProps> {
  render() {
    const { visible } = this.props;

    if (!visible) return null;

    return (
      <div className={styles.overlay}>
        <Spinner />
      </div>
    );
  }
}

export default LoadingOverlay;
