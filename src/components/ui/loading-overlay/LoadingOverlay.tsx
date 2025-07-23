import Spinner from './spinner/Spinner';
import styles from './spinner/Spinner.module.scss';

const LoadingOverlay = (visible: boolean) => {
  if (!visible) return null;

  return (
    <div className={styles.overlay}>
      <Spinner />
    </div>
  );
};

export default LoadingOverlay;
