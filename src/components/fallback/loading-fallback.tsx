import styles from './fallback.module.scss';

const Loading: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <div
        className={styles.spinner}
        role="status"
        aria-label="Loading..."
      ></div>
      <span className={styles.title}>Loading...</span>
    </div>
  );
};

export default Loading;
