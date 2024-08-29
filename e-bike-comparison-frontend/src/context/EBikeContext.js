import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const EBikeContext = createContext();

export const useEBikeContext = () => useContext(EBikeContext);

export const EBikeProvider = ({ children }) => {
  const [originalEBikes, setOriginalEBikes] = useState([]);
  const [eBikes, setEBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    brand: [],
    bikeType: [],
    modelYear: [],
    warranty: [],
    rating: [],
    motor: [],
    weight: [],
    range: [],
  });
  const [brands, setBrands] = useState([]);
  const [bikeTypes, setBikeTypes] = useState([]);
  const [modelYears, setModelYears] = useState([]);
  const [warranties, setWarranties] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [motors, setMotors] = useState([]);
  const [weights, setWeights] = useState([]);
  const [ranges, setRanges] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchEBikes = useCallback(async () => {
    console.log('Fetching e-bikes...');
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/data/e-bikes.csv');
      const text = await response.text();
      console.log('CSV text:', text.substring(0, 100)); // Log first 100 characters
      const rows = text.split('\n').map(row => row.split(','));
      const headers = rows[0];
      const data = rows.slice(1).map(row => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header.trim()] = row[index].trim();
        });
        return obj;
      });
      console.log('Parsed data:', data.slice(0, 2)); // Log first two items
      setOriginalEBikes(data);
      setEBikes(data);
      setBrands([...new Set(data.map(bike => bike.brand))]);
      setBikeTypes([...new Set(data.map(bike => bike.bikeType))]);
      setModelYears([...new Set(data.map(bike => bike.modelYear))]);
      setWarranties([...new Set(data.map(bike => bike.warranty))]);
      setRatings([...new Set(data.map(bike => bike.rating))]);
      setMotors([...new Set(data.map(bike => bike.motor))]);
      setWeights([...new Set(data.map(bike => bike.weight))]);
      setRanges([...new Set(data.map(bike => bike.range))]);
    } catch (err) {
      console.error('Error fetching e-bikes:', err);
      setError('Failed to fetch e-bikes data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEBikes();
  }, [fetchEBikes]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value
    }));
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredEBikes = eBikes.filter(bike => {
    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      return value.length === 0 || value.includes(bike[key]);
    });

    const matchesSearch = searchTerm === '' || 
      bike.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bike.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bike.bikeType.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilters && matchesSearch;
  });

  const resetFilters = () => {
    setFilters({
      brand: [],
      bikeType: [],
      modelYear: [],
      warranty: [],
      rating: [],
      motor: [],
      weight: [],
      range: [],
    });
    setSearchTerm('');
    setEBikes(originalEBikes); // Restore all e-bikes
  };

  const removeEBike = (id) => {
    setEBikes(prevEBikes => prevEBikes.filter(bike => bike.id !== id));
  };

  const value = {
    eBikes: filteredEBikes,
    loading,
    error,
    filters,
    handleFilterChange,
    handleSearch,
    brands,
    bikeTypes,
    modelYears,
    warranties,
    ratings,
    motors,
    weights,
    ranges,
    resetFilters,
    removeEBike,
  };

  return <EBikeContext.Provider value={value}>{children}</EBikeContext.Provider>;
};