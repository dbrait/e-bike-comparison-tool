import React from 'react';
import styles from './EBikeGrid.module.css';
import StarRating from './StarRating';

function EBikeGrid({ eBikes, onRemoveBike }) {
  if (!eBikes || eBikes.length === 0) {
    return <div>No e-bikes found.</div>;
  }

  return (
    <div className={styles.grid}>
      {eBikes.map((bike) => (
        <div key={bike.id} className={styles.card}>
          <button 
            className={styles.removeButton} 
            onClick={() => onRemoveBike(bike.id)}
            aria-label="Remove e-bike"
          >
            🗑️
          </button>
          {bike.imageUrl && (
            <img 
              src={bike.imageUrl} 
              alt={bike.name} 
              className={styles.bikeImage}
            />
          )}
          <h3 className={styles.cardTitle}>{bike.name}</h3>
          <p className={styles.cardInfo}>Brand: {bike.brand}</p>
          <p className={styles.cardInfo}>Price: ${bike.price}</p>
          <p className={styles.cardInfo}>Range: {bike.range} miles</p>
          <p className={styles.cardInfo}>Weight: {bike.weight} lbs</p>
          <p className={styles.cardInfo}>Motor: {bike.motor}</p>
          <p className={styles.cardInfo}>Battery: {bike.battery}</p>
          <p className={styles.cardInfo}>Bike Type: {bike.bikeType || 'N/A'}</p>
          <p className={styles.cardInfo}>Model Year: {bike.modelYear}</p>
          <p className={styles.cardInfo}>Top Speed: {bike.topSpeed} mph</p>
          <p className={styles.cardInfo}>Warranty: {bike.warranty}</p>
          <StarRating rating={bike.rating} />
          <a 
            href={bike.productUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.siteButton}
          >
            Go to Site
          </a>
        </div>
      ))}
    </div>
  );
}

export default EBikeGrid;