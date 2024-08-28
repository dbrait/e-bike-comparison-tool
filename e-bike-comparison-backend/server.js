const express = require('express');
const cors = require('cors');
const csv = require('csv-parser');
const fs = require('fs');
const NodeCache = require('node-cache');

const app = express();
const port = process.env.PORT || 5000;
const cache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes

app.use(cors({
  origin: 'http://localhost:3000' // or whatever your frontend URL is
}));
app.use(express.json());

let eBikes = [];

// Read CSV file and populate eBikes array
fs.createReadStream('e-bikes.csv')
  .pipe(csv())
  .on('data', (data) => {
    eBikes.push({
      id: data.id,
      name: data.name,
      brand: data.brand,
      price: parseFloat(data.price),
      range: parseFloat(data.range),
      weight: parseFloat(data.weight),
      motor: data.motor,
      battery: data.battery,
      bikeType: data.bikeType,
      rating: parseFloat(data.rating),
      modelYear: parseInt(data.modelYear),
      topSpeed: parseFloat(data.topSpeed),
      warranty: data.warranty,
      productUrl: data.productUrl, // Add this line
      imageUrl: data.imageUrl, // Add this line
    });
  })
  .on('end', () => {
    console.log(`Loaded ${eBikes.length} e-bikes from CSV`);
    console.log('Sample bike:', eBikes[0]); // Log a sample bike to check the data
  });

// GET all e-bikes
app.get('/api/e-bikes', (req, res) => {
  try {
    res.json(eBikes);
  } catch (error) {
    console.error('Error in GET all e-bikes:', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

const validateSearchParams = (req, res, next) => {
  const { minPrice, maxPrice } = req.query;
  
  if (minPrice && isNaN(parseFloat(minPrice))) {
    return res.status(400).json({ error: 'Invalid minPrice parameter' });
  }
  
  if (maxPrice && isNaN(parseFloat(maxPrice))) {
    return res.status(400).json({ error: 'Invalid maxPrice parameter' });
  }
  
  next();
};

// GET e-bikes with search and filter
app.get('/api/e-bikes/search', validateSearchParams, (req, res) => {
  try {
    const cacheKey = `search:${JSON.stringify(req.query)}`;
    const cachedResult = cache.get(cacheKey);

    if (cachedResult) {
      return res.json(cachedResult);
    }

    let result = [...eBikes];

    // Search
    if (req.query.search) {
      const searchTerm = req.query.search.toLowerCase();
      result = result.filter(bike => 
        bike.name.toLowerCase().includes(searchTerm) ||
        bike.brand.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by brand
    if (req.query.brand) {
      const brands = req.query.brand.split(',');
      result = result.filter(bike => brands.includes(bike.brand));
    }

    // Filter by price range
    if (req.query.minPrice && req.query.maxPrice) {
      const minPrice = parseFloat(req.query.minPrice);
      const maxPrice = parseFloat(req.query.maxPrice);
      result = result.filter(bike => bike.price >= minPrice && bike.price <= maxPrice);
    }

    // Filter by motor power
    if (req.query.motorPower) {
      const motorPowers = req.query.motorPower.split(',');
      result = result.filter(bike => motorPowers.includes(bike.motor));
    }

    // Filter by rating
    if (req.query.rating) {
      const minRating = parseFloat(req.query.rating);
      result = result.filter(bike => bike.rating >= minRating);
    }

    // Filter by bike type
    if (req.query.bikeType) {
      const bikeTypes = req.query.bikeType.split(',');
      result = result.filter(bike => bikeTypes.includes(bike.bikeType));
    }

    // Filter by weight range
    if (req.query.weightRange) {
      const [minWeight, maxWeight] = req.query.weightRange.split('-').map(Number);
      result = result.filter(bike => {
        if (maxWeight) {
          return bike.weight >= minWeight && bike.weight <= maxWeight;
        } else {
          return bike.weight >= minWeight;
        }
      });
    }

    // Filter by battery
    if (req.query.battery) {
      const batteries = req.query.battery.split(',');
      result = result.filter(bike => batteries.includes(bike.battery));
    }

    // Filter by model year
    if (req.query.modelYear) {
      const modelYears = req.query.modelYear.split(',').map(Number);
      result = result.filter(bike => modelYears.includes(bike.modelYear));
    }

    // Filter by top speed
    if (req.query.minTopSpeed && req.query.maxTopSpeed) {
      const minTopSpeed = parseFloat(req.query.minTopSpeed);
      const maxTopSpeed = parseFloat(req.query.maxTopSpeed);
      result = result.filter(bike => bike.topSpeed >= minTopSpeed && bike.topSpeed <= maxTopSpeed);
    }

    // Filter by warranty
    if (req.query.warranty) {
      const warranties = req.query.warranty.split(',');
      result = result.filter(bike => warranties.includes(bike.warranty));
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedResult = {
      bikes: result.slice(startIndex, endIndex),
      currentPage: page,
      totalPages: Math.ceil(result.length / limit),
      totalBikes: result.length,
    };

    res.json(paginatedResult);
    cache.set(cacheKey, paginatedResult);
  } catch (error) {
    console.error('Error in search endpoint:', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

// GET a single e-bike by ID
app.get('/api/e-bikes/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID parameter' });
    }
    
    const eBike = eBikes.find(bike => bike.id === id);
    if (eBike) {
      res.json(eBike);
    } else {
      res.status(404).json({ error: 'E-bike not found' });
    }
  } catch (error) {
    console.error('Error in get by ID endpoint:', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

// GET filters (brands and bike types)
app.get('/api/filters', (req, res) => {
  const brands = [...new Set(eBikes.map(bike => bike.brand))];
  const bikeTypes = [...new Set(eBikes.map(bike => bike.bikeType).filter(Boolean))];
  const modelYears = [...new Set(eBikes.map(bike => bike.modelYear).filter(Boolean))].sort((a, b) => b - a);
  const warranties = [...new Set(eBikes.map(bike => bike.warranty).filter(Boolean))];
  const topSpeeds = eBikes.map(bike => bike.topSpeed).filter(Boolean);
  const minTopSpeed = Math.min(...topSpeeds);
  const maxTopSpeed = Math.max(...topSpeeds);

  console.log('Available bike types:', bikeTypes);
  console.log('Available model years:', modelYears);
  console.log('Available warranties:', warranties);
  console.log('Top speed range:', { min: minTopSpeed, max: maxTopSpeed });

  res.json({ brands, bikeTypes, modelYears, warranties, topSpeedRange: { min: minTopSpeed, max: maxTopSpeed } });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
  console.log(`Number of e-bikes loaded: ${eBikes.length}`);
});