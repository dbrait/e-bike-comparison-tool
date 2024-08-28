import React, { useState } from 'react';
import styles from './FilterOptions.module.css';

function FilterOptions({ filters, onFilterChange, brands, bikeTypes, modelYears, warranties, topSpeedRange }) {
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleCheckboxChange = (event, filterName) => {
    const { value, checked } = event.target;
    let newValues;
    if (checked) {
      newValues = [...filters[filterName], value];
    } else {
      newValues = filters[filterName].filter(item => item !== value);
    }
    onFilterChange({ ...filters, [filterName]: newValues });
  };

  const renderDropdownCheckboxGroup = (name, options, label) => (
    <div className={styles.filterSelect}>
      <button 
        onClick={() => setOpenDropdown(openDropdown === name ? null : name)}
        className={styles.dropdownButton}
      >
        {label} ({filters[name].length})
      </button>
      {openDropdown === name && (
        <div className={styles.dropdownContent}>
          {options.map((option) => (
            <label key={option} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                value={option}
                checked={filters[name].includes(option)}
                onChange={(e) => handleCheckboxChange(e, name)}
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className={styles.filterContainer}>
      {renderDropdownCheckboxGroup('brand', brands, 'Brand')}
      {renderDropdownCheckboxGroup('bikeType', bikeTypes, 'Bike Type')}
      {renderDropdownCheckboxGroup('modelYear', modelYears, 'Model Year')}
      {renderDropdownCheckboxGroup('warranty', warranties, 'Warranty')}

      <div className={styles.filterSelect}>
        <label>Price Range</label>
        <input
          type="number"
          value={filters.priceRange[0]}
          onChange={(e) => onFilterChange({ ...filters, priceRange: [Number(e.target.value), filters.priceRange[1]] })}
          placeholder="Min Price"
        />
        <input
          type="number"
          value={filters.priceRange[1]}
          onChange={(e) => onFilterChange({ ...filters, priceRange: [filters.priceRange[0], Number(e.target.value)] })}
          placeholder="Max Price"
        />
      </div>

      <div className={styles.filterSelect}>
        <label>Top Speed Range</label>
        <input
          type="range"
          min={topSpeedRange.min}
          max={topSpeedRange.max}
          value={filters.topSpeed}
          onChange={(e) => onFilterChange({ ...filters, topSpeed: Number(e.target.value) })}
        />
        <span>{filters.topSpeed} mph</span>
      </div>
    </div>
  );
}

export default FilterOptions;