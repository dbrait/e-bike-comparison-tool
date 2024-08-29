import React from 'react';
import { useEBikeContext } from './context/EBikeContext';
import EBikeGrid from './components/EBikeGrid';
import FilterOptions from './components/FilterOptions';
import SearchBar from './components/SearchBar';
import styles from './App.module.css';

function App() {
  const { eBikes, loading, error } = useEBikeContext();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.appContainer}>
      <h1 className={styles.title}>Electric Bike Comparison Tool</h1>
      <div className={styles.searchBarContainer}>
        <SearchBar />
      </div>
      <div className={styles.filterOptionsContainer}>
        <FilterOptions />
      </div>
      <EBikeGrid eBikes={eBikes} />
    </div>
  );
}

export default App;