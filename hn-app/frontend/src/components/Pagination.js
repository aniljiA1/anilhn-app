import React from 'react';
import './Pagination.css';

const Pagination = ({ pagination, onPageChange }) => {
  const { page, totalPages, hasNextPage, hasPrevPage } = pagination;

  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 2;
  const left = page - delta;
  const right = page + delta + 1;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= left && i < right)) {
      pages.push(i);
    }
  }

  const withEllipsis = [];
  let prev;
  for (const p of pages) {
    if (prev && p - prev > 1) withEllipsis.push('...');
    withEllipsis.push(p);
    prev = p;
  }

  return (
    <div className="pagination">
      <button
        className="page-btn"
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPrevPage}
      >
        ← Prev
      </button>

      <div className="page-numbers">
        {withEllipsis.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="page-ellipsis">…</span>
          ) : (
            <button
              key={p}
              className={`page-num ${p === page ? 'active' : ''}`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        className="page-btn"
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNextPage}
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;
