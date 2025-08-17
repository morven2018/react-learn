import Link from 'next/link';
import styles from './not-found.module.scss';

export default function NotFound() {
  return (
    <main>
      <div className={styles.notFoundPage}>
        <h2 className={styles.header}>This page doesn&#8216;t exist.</h2>
        <Link href="/" className={styles.homeButton}>
          Home
        </Link>
      </div>
    </main>
  );
}
