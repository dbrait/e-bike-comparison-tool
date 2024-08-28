import React from 'react';
import { useEBikeContext } from './context/EBikeContext';
import FilterOptions from './components/FilterOptions';
import EBikeGrid from './components/EBikeGrid';
import SearchBar from './components/SearchBar';
import Pagination from './components/Pagination';
import './App.css';

function App() {
  const {
    eBikes,
    removeBikeFromComparison,
    handleSearch,
    handleFilterChange,
    handlePageChange,
    resetSearch,
    filters,
    brands,
    bikeTypes,
    modelYears,
    warranties,
    topSpeedRange,
    currentPage,
    totalPages,
    loading,
    error
  } = useEBikeContext();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="app">
      <h1 className="title">Electric Bike Comparison Tool</h1>
      <div className="searchContainer">
        <SearchBar onSearch={handleSearch} />
        <button onClick={resetSearch} className="resetButton">Reset</button>
      </div>
      <FilterOptions
        filters={filters}
        onFilterChange={handleFilterChange}
        brands={brands}
        bikeTypes={bikeTypes}
        modelYears={modelYears}
        warranties={warranties}
        topSpeedRange={topSpeedRange}
      />
      <EBikeGrid 
        eBikes={eBikes} 
        onRemoveBike={removeBikeFromComparison}
      />
      <div className="paginationContainer">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default App;