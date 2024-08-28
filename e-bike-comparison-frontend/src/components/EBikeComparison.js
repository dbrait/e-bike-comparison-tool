import React from 'react';
import EBikeGrid from './EBikeGrid';
import SearchBar from './SearchBar';
import FilterOptions from './FilterOptions';
import Pagination from './Pagination';
import { useEBikeContext } from '../context/EBikeContext';

function EBikeComparison() {
  const {
    eBikes,
    selectedEBikes,
    searchTerm,
    filters,
    currentPage,
    totalPages,
    loading,
    error,
    handleSearch,
    handleFilterChange,
    handleEBikeSelect,
    handlePageChange,
  } = useEBikeContext();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <FilterOptions filters={filters} onFilterChange={handleFilterChange} />
      <EBikeGrid 
        eBikes={eBikes} 
        selectedEBikes={selectedEBikes} 
        onEBikeSelect={handleEBikeSelect}
        searchTerm={searchTerm}
        filters={filters}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default EBikeComparison;