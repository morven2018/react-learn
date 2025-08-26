'use client';
import style from './details.module.scss';
import { useRouter } from 'next/navigation';

export function CloseButton() {
  const router = useRouter();

  const handleClose = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('details');
    router.push(url.toString());
  };

  return (
    <button
      className={style.closeButton}
      onClick={handleClose}
      title="Close"
      aria-label="Close"
    >
      &times;
    </button>
  );
}
