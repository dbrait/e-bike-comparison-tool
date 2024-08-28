import React from 'react';
import styles from './StarRating.module.css';

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className={styles.starRating}>
      {[...Array(5)].map((_, index) => {
        if (index < fullStars) {
          return <span key={index} className={styles.fullStar}>★</span>;
        } else if (index === fullStars && hasHalfStar) {
          return <span key={index} className={styles.halfStar}>★</span>;
        } else {
          return <span key={index} className={styles.emptyStar}>☆</span>;
        }
      })}
    </div>
  );
};

export default StarRating;