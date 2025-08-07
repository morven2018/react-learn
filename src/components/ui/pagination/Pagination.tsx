import React from 'react';
import style from './Pagination.module.scss';

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
  maxVisiblePages = 3,
}) => {
  if (totalPages <= 1 || isLoading) return null;

  const getVisiblePages = () => {
    const pages = [];
    const startPage = Math.max(
      1,
      currentPage - Math.floor(maxVisiblePages / 2)
    );
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('left-ellipsis');
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('right-ellipsis');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={style.pagination}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className={style.navButton}
      >
        &lt;
      </button>

      {visiblePages.map((page) => {
        if (page === 'left-ellipsis' || page === 'right-ellipsis') {
          return (
            <span key={page} className={style.ellipsis}>
              ...
            </span>
          );
        }
        if (typeof page === 'number') {
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`${style.pageButton} ${page === currentPage ? style.active : ''}`}
              disabled={page === currentPage}
            >
              {page}
            </button>
          );
        }
      })}

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
