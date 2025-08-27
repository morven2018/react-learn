import styles from './fallback.module.scss';

const Loading: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <div
        className={styles.spinner}
        role="status"
        aria-label="Loading..."
      ></div>
      <span className="visually-hidden">Loading...</span>
    </div>
  );
};

export default Loading;
