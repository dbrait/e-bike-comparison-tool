import React from 'react';
import { useEBikeContext } from '../context/EBikeContext';
import styles from './EBikeGrid.module.css';

function EBikeGrid() {
  const { eBikes, removeEBike } = useEBikeContext();

  if (!eBikes || eBikes.length === 0) {
    return <div>No e-bikes found.</div>;
  }

  const renderStars = (rating) => {
    const starCount = Math.round(parseFloat(rating));
    return '★'.repeat(starCount) + '☆'.repeat(5 - starCount);
  };

  return (
    <div className={styles.grid}>
      {eBikes.map((bike) => (
        <div key={bike.id} className={styles.card}>
          <button 
            className={styles.removeButton} 
            onClick={() => removeEBike(bike.id)}
            aria-label="Remove e-bike"
          >
            🗑️
          </button>
          <h3 className={styles.cardTitle}>{bike.name}</h3>
          <div className={styles.ratingContainer}>
            <span className={styles.stars}>{renderStars(bike.rating)}</span>
          </div>
          <img src={bike.imageUrl} alt={bike.name} className={styles.bikeImage} />
          <p className={styles.cardInfo}><strong>Brand:</strong> {bike.brand}</p>
          <p className={styles.cardInfo}><strong>Price:</strong> ${bike.price}</p>
          <p className={styles.cardInfo}><strong>Type:</strong> {bike.bikeType}</p>
          <p className={styles.cardInfo}><strong>Model Year:</strong> {bike.modelYear}</p>
          <p className={styles.cardInfo}><strong>Range:</strong> {bike.range}</p>
          <p className={styles.cardInfo}><strong>Weight:</strong> {bike.weight}</p>
          <p className={styles.cardInfo}><strong>Motor:</strong> {bike.motor}</p>
          <p className={styles.cardInfo}><strong>Top Speed:</strong> {bike.topSpeed}</p>
          <p className={styles.cardInfo}><strong>Warranty:</strong> {bike.warranty}</p>
          <p className={styles.cardInfo}><strong>Battery:</strong> {bike.battery}</p>
          <a 
            href={bike.productUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.goToSiteButton}
          >
            Go to Site
          </a>
        </div>
      ))}
    </div>
  );
}

export default EBikeGrid;