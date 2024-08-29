import React, { useState } from 'react';
import { useEBikeContext } from '../context/EBikeContext';
import styles from './SearchBar.module.css';

function SearchBar() {
  const [searchInput, setSearchInput] = useState('');
  const { handleSearch, resetFilters } = useEBikeContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchInput);
  };

  const handleReset = () => {
    setSearchInput('');
    resetFilters();
  };

  return (
    <div className={styles.searchContainer}>
      <form onSubmit={handleSubmit} className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search for e-bikes..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>Search</button>
      </form>
      <button onClick={handleReset} className={styles.resetButton}>Reset</button>
    </div>
  );
}

export default SearchBar;