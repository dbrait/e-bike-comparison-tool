import React, { useState, useRef, useEffect } from 'react';
import { useEBikeContext } from '../context/EBikeContext';
import styles from './FilterOptions.module.css';

function FilterOptions() {
  const { 
    filters, 
    handleFilterChange, 
    brands, 
    bikeTypes, 
    modelYears, 
    warranties,
    ratings,
    motors,
    weights,
    ranges
  } = useEBikeContext();
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRefs = useRef({});

  useEffect(() => {
    function handleClickOutside(event) {
      if (openDropdown && !dropdownRefs.current[openDropdown].contains(event.target)) {
        setOpenDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const renderDropdown = (name, options, label) => (
    <div key={name} className={styles.filterSelect} ref={el => dropdownRefs.current[name] = el}>
      <button 
        onClick={() => setOpenDropdown(openDropdown === name ? null : name)}
        className={styles.dropdownButton}
      >
        {label}
      </button>
      {openDropdown === name && (
        <div className={styles.dropdownContent}>
          {options.map((option) => (
            <label key={option} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                value={option}
                checked={filters[name].includes(option)}
                onChange={(e) => {
                  const newValue = e.target.checked
                    ? [...filters[name], option]
                    : filters[name].filter(item => item !== option);
                  handleFilterChange(name, newValue);
                }}
              />
              {name === 'rating' ? (
                <span className={styles.ratingStars}>{renderStars(parseInt(option))}</span>
              ) : (
                option
              )}
            </label>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className={styles.filterContainer}>
      {renderDropdown('brand', brands, 'Brand')}
      {renderDropdown('bikeType', bikeTypes, 'Bike Type')}
      {renderDropdown('modelYear', modelYears, 'Model Year')}
      {renderDropdown('warranty', warranties, 'Warranty')}
      {renderDropdown('rating', ratings, 'Rating')}
      {renderDropdown('motor', motors, 'Motor')}
      {renderDropdown('weight', weights, 'Weight')}
      {renderDropdown('range', ranges, 'Range')}
    </div>
  );
}

export default FilterOptions;