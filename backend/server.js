// server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const animeRoutes = require('./routes/animeRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Helps secure Express apps by setting HTTP response headers
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies
app.use(morgan('dev')); // HTTP request logger

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100000, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    error: 'Too many requests, please try again later.'
  }
});

// Apply rate limiting to all requests
app.use(limiter);

// Base route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the Anime API. Please refer to the documentation for usage.',
    version: '1.0.0',
    endpoints: {
      home: '/api/home',
      azlist: '/api/azlist/:sortOption',
      qtip: '/api/qtip/:animeId',
      anime: '/api/anime/:animeId',
      search: '/api/search?q=query',
      searchSuggestion: '/api/search/suggestion?q=query',
      producer: '/api/producer/:name',
      genre: '/api/genre/:name',
      category: '/api/category/:category',
      schedule: '/api/schedule?date=yyyy-mm-dd',
      episodes: '/api/anime/:animeId/episodes',
      servers: '/api/episode/servers?animeEpisodeId=id',
      sources: '/api/episode/sources?animeEpisodeId=id&server=server&category=category'
    }
  });
});

// Use anime routes
app.use('/api', animeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  const statusCode = err.status || 500;
  const errorMessage = err.message || 'Something went wrong on the server';
  
  res.status(statusCode).json({
    success: false,
    error: errorMessage,
    status: statusCode
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: 'The requested endpoint does not exist.'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Anime API server running on port ${PORT}`);
});

module.exports = app;