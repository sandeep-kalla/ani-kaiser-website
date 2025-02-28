const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = 'https://anikaiser-api.vercel.app/api/v2/hianime';

app.use(cors());
app.use(express.json());

// Helper function to make API requests
async function fetchFromAPI(endpoint, params = {}) {
  try {
    const url = `${BASE_URL}${endpoint}`;
    console.log('Fetching from URL:', url, 'with params:', params);
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.error(`API Error:`, error.message);
    console.error('Error details:', error.response?.data || error);
    throw {
      success: false,
      error: 'API Error',
      status: error.response?.status || 500,
      data: error.response?.data || error,
      message: error.response?.data?.message || error.message
    };
  }
}

// Home Page
app.get('/api/home', async (req, res) => {
  try {
    const data = await fetchFromAPI('/home');
    res.json(data);
  } catch (error) {
    res.status(error.status || 500).json(error);
  }
});

// A-Z List
app.get('/api/azlist/:sortOption', async (req, res) => {
  try {
    const { sortOption } = req.params;
    const { page = 1 } = req.query;
    const data = await fetchFromAPI(`/azlist/${sortOption}`, { page });
    res.json(data);
  } catch (error) {
    res.status(error.status || 500).json(error);
  }
});

// Anime Qtip Info
app.get('/api/qtip/:animeId', async (req, res) => {
  try {
    const { animeId } = req.params;
    const data = await fetchFromAPI(`/qtip/${animeId}`);
    res.json(data);
  } catch (error) {
    res.status(error.status || 500).json(error);
  }
});

// Anime About Info
app.get('/api/anime/:animeId', async (req, res) => {
  try {
    const { animeId } = req.params;
    const data = await fetchFromAPI(`/anime/${animeId}`);
    res.json(data);
  } catch (error) {
    res.status(error.status || 500).json(error);
  }
});

// Search
app.get('/api/search', async (req, res) => {
  try {
    const data = await fetchFromAPI('/search', req.query);
    res.json(data);
  } catch (error) {
    res.status(error.status || 500).json(error);
  }
});

// Search Suggestions
app.get('/api/search/suggestion', async (req, res) => {
  try {
    const data = await fetchFromAPI('/search/suggestion', req.query);
    res.json(data);
  } catch (error) {
    res.status(error.status || 500).json(error);
  }
});

// Producer Animes
app.get('/api/producer/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const { page = 1 } = req.query;
    const data = await fetchFromAPI(`/producer/${name}`, { page });
    res.json(data);
  } catch (error) {
    res.status(error.status || 500).json(error);
  }
});

// Genre Animes
app.get('/api/genre/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const { page = 1 } = req.query;
    const data = await fetchFromAPI(`/genre/${name}`, { page });
    res.json(data);
  } catch (error) {
    res.status(error.status || 500).json(error);
  }
});

// Category Animes
app.get('/api/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1 } = req.query;
    const data = await fetchFromAPI(`/category/${category}`, { page });
    res.json(data);
  } catch (error) {
    res.status(error.status || 500).json(error);
  }
});

// Estimated Schedules
app.get('/api/schedule', async (req, res) => {
  try {
    const data = await fetchFromAPI('/schedule', req.query);
    res.json(data);
  } catch (error) {
    res.status(error.status || 500).json(error);
  }
});

// Anime Episodes
app.get('/api/anime/:animeId/episodes', async (req, res) => {
  try {
    const { animeId } = req.params;
    const data = await fetchFromAPI(`/anime/${animeId}/episodes`);
    res.json(data);
  } catch (error) {
    res.status(error.status || 500).json(error);
  }
});

// Anime Episode Servers
app.get('/api/episode/servers', async (req, res) => {
  try {
    const { animeEpisodeId } = req.query;
    if (!animeEpisodeId) {
      throw new Error('animeEpisodeId is required');
    }
    
    const data = await fetchFromAPI('/episode/servers', { animeEpisodeId });
    res.json(data);
  } catch (error) {
    res.status(error.status || 500).json(error);
  }
});

// Anime Episode Streaming Links
app.get('/api/episode/sources', async (req, res) => {
  try {
    const { animeEpisodeId, server = 'hd-1', category = 'sub' } = req.query;
    if (!animeEpisodeId) {
      throw new Error('animeEpisodeId is required');
    }
    
    const data = await fetchFromAPI('/episode/sources', {
      animeEpisodeId,
      server,
      category
    });
    res.json(data);
  } catch (error) {
    res.status(error.status || 500).json(error);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!',
    message: err.message
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

app.listen(PORT, () => {
  console.log(`Anime API backend running on port ${PORT}`);
});

module.exports = app;