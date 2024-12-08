import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, CardMedia, Button, Grid, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import '../../App.css'

const Welcome = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({})

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);

  const retrieve = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/product', {
        params: filters, // Send filters as query parameters
      });
      setProducts(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateFilters = () => {
    setFilters({ maxPrice, minPrice, category })
  }

  useEffect(() => {
    updateFilters()
  }, [minPrice, maxPrice, category])

  useEffect(() => {
    console.log(filters)
    retrieve();
  }, [filters]);

  useEffect(() => {
    retrieve();
  }, []);


  return (
    <div className='main-page'>
      <Box sx={{ padding: 2 }}>
        <div className='filters'>
          <select
            name="category"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: "100%" }}
          >
            <option value="Sneakers">Sneakers</option>
            <option value="Loafers">Loafers</option>
            <option value="Running Shoes">Running Shoes</option>
            <option value="Boots">Boots</option>
          </select>

          <div style={{ marginTop: '30px' }}>
            <label>Min Price: ${minPrice}</label>
            <input
              type="range"
              name='minPrice'
              min="0"
              max="1000"
              step="10"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <label>Max Price: ${maxPrice}</label>
            <input
              type="range"
              name='maxPrice'
              min="0"
              max="1000"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </Box>
      <Box sx={{ padding: 2 }}>
        <Typography variant="h4" component="h1" sx={{ marginBottom: 3, textAlign: 'center' }}>
          Welcome to Our Product Showcase
        </Typography>

        {products.length > 0 ? (
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={4} sm={4} md={3} key={product._id}>
                <Card sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.images?.[0]?.url || 'https://via.placeholder.com/200x140'}

                    alt={product.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="h6" component="div" gutterBottom>
                      {product.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
                      {product.description.length > 100
                        ? `${product.description.slice(0, 100)}...`
                        : product.description}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      ${product.price}
                    </Typography>
                  </CardContent>
                  <Box sx={{ padding: 2 }}>
                    <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
                      <Button variant="contained" size="small" color="primary" fullWidth>
                        View Details
                      </Button>
                    </Link>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', marginTop: 5 }}>
            No products available.
          </Typography>
        )}
      </Box>
    </div>
  );
};

export default Welcome;
