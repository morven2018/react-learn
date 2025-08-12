import React from 'react';
import style from './pagination.module.scss';

const VisiblePages = 3;

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  isLoading,
  onPageChange,
  maxVisiblePages = VisiblePages,
}) => {
  if (totalPages <= 1 || isLoading) return null;

  const pages = [];
  const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (startPage > 1) {
    pages.push(
      <button
        key={1}
        onClick={() => onPageChange(1)}
        className={style.pageButton}
      >
        1
      </button>
    );
    if (startPage > 2) {
      pages.push(
        <span key="left-ellipsis" className={style.ellipsis}>
          ...
        </span>
      );
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(
      <button
        key={i}
        onClick={() => onPageChange(i)}
        className={`${style.pageButton} ${i === currentPage ? style.active : ''}`}
        disabled={i === currentPage}
      >
        {i}
      </button>
    );
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pages.push(
        <span key="right-ellipsis" className={style.ellipsis}>
          ...
        </span>
      );
    }
    pages.push(
      <button
        key={totalPages}
        onClick={() => onPageChange(totalPages)}
        className={style.pageButton}
      >
        {totalPages}
      </button>
    );
  }

  return (
    <div className={style.pagination}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className={style.navButton}
      >
        &lt;
      </button>

      {pages}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        className={style.navButton}
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
