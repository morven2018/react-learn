import Spinner from './spinner/spinner';
import styles from './spinner/spinner.module.scss';

interface LoadingOverlayProps {
  visible: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <div className={styles.overlay}>
      <Spinner />
    </div>
  );
};

export default LoadingOverlay;
