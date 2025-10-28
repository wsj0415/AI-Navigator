import React from 'react';
// Fix: Use relative path for component imports.
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    const half = Math.floor(maxPagesToShow / 2);
    
    if (totalPages <= maxPagesToShow + 2) { // 1 2 3 4 5 6 7
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else if (currentPage <= half + 2) { // 1 2 3 4 5 ... 10
        for (let i = 1; i <= maxPagesToShow; i++) {
            pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
    } else if (currentPage >= totalPages - half - 1) { // 1 ... 6 7 8 9 10
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - maxPagesToShow + 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else { // 1 ... 4 5 6 ... 10
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - half; i <= currentPage + half; i++) {
            pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav className="flex items-center justify-center gap-2 mt-8 py-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-arrow"
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>

      {pages.map((page, index) =>
        typeof page === 'number' ? (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={currentPage === page ? 'pagination-item active' : 'pagination-item'}
          >
            {page}
          </button>
        ) : (
          <span key={index} className="pagination-ellipsis">
            {page}
          </span>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-arrow"
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>
      <style>{`
        .pagination-arrow { display: inline-flex; align-items: center; justify-content: center; padding: 0.5rem; border-radius: 0.375rem; transition: background-color 0.2s; }
        .pagination-arrow:not(:disabled) { color: #4b5563; }
        .pagination-arrow:not(:disabled):hover { background-color: #e5e7eb; }
        .dark .pagination-arrow:not(:disabled) { color: #9ca3af; }
        .dark .pagination-arrow:not(:disabled):hover { background-color: #374151; }
        .pagination-arrow:disabled { color: #d1d5db; cursor: not-allowed; }
        .dark .pagination-arrow:disabled { color: #4b5563; }
        .pagination-item { display: inline-flex; align-items: center; justify-content: center; width: 2.25rem; height: 2.25rem; border-radius: 0.375rem; font-size: 0.875rem; font-weight: 500; transition: background-color 0.2s, color 0.2s; }
        .pagination-item:hover { background-color: #f3f4f5; }
        .dark .pagination-item:hover { background-color: #374151; }
        .pagination-item.active { background-color: #3b82f6; color: #ffffff; }
        .dark .pagination-item.active { background-color: #3b82f6; }
        .pagination-ellipsis { display: inline-flex; align-items: center; justify-content: center; width: 2.25rem; height: 2.25rem; font-size: 0.875rem; color: #6b7280; }
        .dark .pagination-ellipsis { color: #9ca3af; }
      `}</style>
    </nav>
  );
};

export default Pagination;
