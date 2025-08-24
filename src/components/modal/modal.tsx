import Portal from './portal';
import style from './modal.module.scss';
import { useEffect } from 'react';

type ModalProps = {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onResetForm?: () => void;
};

function Modal({
  isOpen,
  title,
  children,
  onClose,
  onResetForm,
}: Readonly<ModalProps>) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleResetForm = () => {
    onResetForm?.();
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <div
        className={style.overlay}
        onClick={onClose}
        data-testid="modal-overlay"
      >
        <div className={style.modal} onClick={(e) => e.stopPropagation()}>
          <div className={style.header}>
            <h2 className={style.title}>{title}</h2>
            <div className={style.headerActions}>
              <button
                className={style.resetButton}
                onClick={handleResetForm}
                aria-label="Reset form"
                title="Reset form"
              >
                ↺
              </button>

              <button
                className={style.closeBtn}
                onClick={onClose}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
          </div>
          <div className={style.content}>{children}</div>
        </div>
      </div>
    </Portal>
  );
}

export default Modal;
