'use client';
import styles from './notification.module.scss';
import { useEffect, useState } from 'react';

type NotificationProps = {
  message: string;
  duration?: number;
  onClose?: () => void;
};

export const CustomNotification = ({
  message,
  duration = 3000,
  onClose,
}: NotificationProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`${styles.notification} ${visible ? styles.visible : styles.hidden}`}
    >
      <div className={`${styles.notificationContent}`}>{message}</div>
    </div>
  );
};
