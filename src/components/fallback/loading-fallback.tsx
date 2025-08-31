import styles from './fallback.module.scss';

const Loading: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <output className={styles.spinner} aria-label="Loading..."></output>
      <span className={styles.title}>Loading...</span>
    </div>
  );
};

export default Loading;
