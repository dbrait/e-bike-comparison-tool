import React from 'react';
import styles from './Pagination.module.css';

function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className={styles.pagination}>
      <button 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1}
        className={styles.pageButton}
      >
        Previous
      </button>
      <span className={styles.pageInfo}>Page {currentPage} of {totalPages}</span>
      <button 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
        className={styles.pageButton}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;