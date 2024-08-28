import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

const EBikeContext = createContext();

export const useEBikeContext = () => useContext(EBikeContext);

export const EBikeProvider = ({ children }) => {
  const [eBikes, setEBikes] = useState([]);
  const [selectedEBikes, setSelectedEBikes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    brand: [],
    priceRange: [0, 10000],
    bikeType: [],
    modelYear: [],
    warranty: [],
    topSpeed: 100,
  });
  const [brands, setBrands] = useState([]);
  const [bikeTypes, setBikeTypes] = useState([]);
  const [modelYears, setModelYears] = useState([]);
  const [warranties, setWarranties] = useState([]);
  const [topSpeedRange, setTopSpeedRange] = useState({ min: 0, max: 100 });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const fetchEBikes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        // ... other filter params
        page: currentPage,
        limit: 10,
      });

      // Update this line to use the Netlify function URL
      const response = await axios.get('/.netlify/functions/get-bikes', { params });
      setEBikes(response.data.bikes || response.data); // Adjust based on the response structure
      setTotalPages(response.data.totalPages || 1); // Adjust if needed
    } catch (error) {
      console.error('Error fetching e-bikes:', error);
      setError('Failed to fetch e-bikes. Please try again later.');
    }
    setLoading(false);
  }, [searchTerm, filters, currentPage]);

  const fetchFilters = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/filters`);
      setBrands(response.data.brands);
      setBikeTypes(response.data.bikeTypes);
      setModelYears(response.data.modelYears);
      setWarranties(response.data.warranties);
      setTopSpeedRange(response.data.topSpeedRange);
    } catch (error) {
      console.error('Error fetching filters:', error);
      setError('Failed to fetch filters. Please try again later.');
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  useEffect(() => {
    fetchEBikes();
  }, [fetchEBikes]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleEBikeSelect = (bike) => {
    setSelectedEBikes(prevSelected => {
      if (prevSelected.find(b => b.id === bike.id)) {
        return prevSelected.filter(b => b.id !== bike.id);
      } else if (prevSelected.length < 5) {
        return [...prevSelected, bike];
      }
      return prevSelected;
    });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const removeBikeFromComparison = (bikeId) => {
    setEBikes((prevEBikes) => prevEBikes.filter((bike) => bike.id !== bikeId));
  };

  const resetSearch = () => {
    setSearchTerm('');
    setFilters({
      brand: [],
      priceRange: [0, 10000],
      bikeType: [],
      modelYear: [],
      warranty: [],
      topSpeed: 100,
    });
    setCurrentPage(1);
  };

  const value = {
    eBikes,
    selectedEBikes,
    searchTerm,
    filters,
    brands,
    bikeTypes,
    modelYears,
    warranties,
    topSpeedRange,
    currentPage,
    totalPages,
    loading,
    error,
    handleSearch,
    handleFilterChange,
    handleEBikeSelect,
    handlePageChange,
    removeBikeFromComparison,
    resetSearch,
  };

  return <EBikeContext.Provider value={value}>{children}</EBikeContext.Provider>;
};