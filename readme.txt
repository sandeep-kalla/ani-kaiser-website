I'll create a backend API to interact with the Aniwatch API you've deployed at anikaiser-api.vercel.app. Based on the documentation you've provided, I'll build a comprehensive client that can utilize all the features of the API.

First, let's start with setting up a basic Node.js project with Express to create our backend:

```javascript
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
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error.message);
    throw {
      success: false,
      error: error.response?.data?.message || error.message,
      status: error.response?.status || 500
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
    const data = await fetchFromAPI('/episode/servers', req.query);
    res.json(data);
  } catch (error) {
    res.status(error.status || 500).json(error);
  }
});

// Anime Episode Streaming Links
app.get('/api/episode/sources', async (req, res) => {
  try {
    const data = await fetchFromAPI('/episode/sources', req.query);
    res.json(data);
  } catch (error) {
    res.status(error.status || 500).json(error);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
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

```

Now, let's create a more detailed service layer that handles the specific API calls and provides more functionality:

```javascript
// services/animeService.js
const axios = require('axios');

class AnimeService {
  constructor(baseURL) {
    this.baseURL = baseURL || 'https://anikaiser-api.vercel.app/api/v2/hianime';
    this.axios = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  async getHomePage() {
    try {
      const response = await this.axios.get('/home');
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  async getAZList(sortOption, page = 1) {
    try {
      const response = await this.axios.get(`/azlist/${sortOption}`, {
        params: { page }
      });
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  async getAnimeQtipInfo(animeId) {
    try {
      const response = await this.axios.get(`/qtip/${animeId}`);
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  async getAnimeInfo(animeId) {
    try {
      const response = await this.axios.get(`/anime/${animeId}`);
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  async searchAnime(query, options = {}) {
    try {
      const params = { q: query, page: options.page || 1, ...options };
      const response = await this.axios.get('/search', { params });
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  async getSearchSuggestions(query) {
    try {
      const response = await this.axios.get('/search/suggestion', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  async getProducerAnimes(producerName, page = 1) {
    try {
      const response = await this.axios.get(`/producer/${producerName}`, {
        params: { page }
      });
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  async getGenreAnimes(genreName, page = 1) {
    try {
      const response = await this.axios.get(`/genre/${genreName}`, {
        params: { page }
      });
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  async getCategoryAnimes(category, page = 1) {
    try {
      const response = await this.axios.get(`/category/${category}`, {
        params: { page }
      });
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  async getSchedule(date) {
    try {
      const response = await this.axios.get('/schedule', {
        params: { date }
      });
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  async getAnimeEpisodes(animeId) {
    try {
      const response = await this.axios.get(`/anime/${animeId}/episodes`);
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  async getEpisodeServers(animeEpisodeId) {
    try {
      const response = await this.axios.get('/episode/servers', {
        params: { animeEpisodeId }
      });
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  async getEpisodeSources(animeEpisodeId, server = 'hd-1', category = 'sub') {
    try {
      const response = await this.axios.get('/episode/sources', {
        params: { animeEpisodeId, server, category }
      });
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  // Advanced search with multiple parameters
  async advancedSearch({
    query,
    page = 1,
    genres,
    type,
    sort,
    season,
    language,
    status,
    rated,
    startDate,
    endDate,
    score
  }) {
    try {
      const params = {
        q: query,
        page,
        genres: genres ? genres.join(',') : undefined,
        type,
        sort,
        season,
        language,
        status,
        rated,
        start_date: startDate,
        end_date: endDate,
        score
      };

      // Remove undefined parameters
      Object.keys(params).forEach(key => 
        params[key] === undefined && delete params[key]
      );

      const response = await this.axios.get('/search', { params });
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  // Helper method to handle errors
  _handleError(error) {
    console.error('API Error:', error.message);
    
    const errorResponse = {
      success: false,
      error: 'API Error'
    };
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      errorResponse.status = error.response.status;
      errorResponse.data = error.response.data;
      errorResponse.message = error.response.data?.message || error.message;
    } else if (error.request) {
      // The request was made but no response was received
      errorResponse.message = 'No response received from server';
      errorResponse.request = error.request;
    } else {
      // Something happened in setting up the request that triggered an Error
      errorResponse.message = error.message;
    }
    
    throw errorResponse;
  }
}

module.exports = AnimeService;

```

Let's also create the controller layer to better organize our code:

```javascript
// controllers/animeController.js
const AnimeService = require('../services/animeService');
const animeService = new AnimeService();

// Home controller
exports.getHomePage = async (req, res, next) => {
  try {
    const result = await animeService.getHomePage();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// A-Z List controller
exports.getAZList = async (req, res, next) => {
  try {
    const { sortOption } = req.params;
    const { page } = req.query;
    const result = await animeService.getAZList(sortOption, page);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Anime Qtip controller
exports.getAnimeQtip = async (req, res, next) => {
  try {
    const { animeId } = req.params;
    const result = await animeService.getAnimeQtipInfo(animeId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Anime Info controller
exports.getAnimeInfo = async (req, res, next) => {
  try {
    const { animeId } = req.params;
    const result = await animeService.getAnimeInfo(animeId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Search controller
exports.searchAnime = async (req, res, next) => {
  try {
    const { q, page, ...otherParams } = req.query;
    const result = await animeService.searchAnime(q, { page, ...otherParams });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Advanced Search controller
exports.advancedSearch = async (req, res, next) => {
  try {
    const {
      q,
      page,
      genres,
      type,
      sort,
      season,
      language,
      status,
      rated,
      start_date,
      end_date,
      score
    } = req.query;

    // Handle genres as array if it's a comma-separated string
    const genresArray = genres ? genres.split(',') : undefined;

    const result = await animeService.advancedSearch({
      query: q,
      page,
      genres: genresArray,
      type,
      sort,
      season,
      language,
      status,
      rated,
      startDate: start_date,
      endDate: end_date,
      score
    });
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Search Suggestions controller
exports.getSearchSuggestions = async (req, res, next) => {
  try {
    const { q } = req.query;
    const result = await animeService.getSearchSuggestions(q);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Producer Animes controller
exports.getProducerAnimes = async (req, res, next) => {
  try {
    const { name } = req.params;
    const { page } = req.query;
    const result = await animeService.getProducerAnimes(name, page);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Genre Animes controller
exports.getGenreAnimes = async (req, res, next) => {
  try {
    const { name } = req.params;
    const { page } = req.query;
    const result = await animeService.getGenreAnimes(name, page);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Category Animes controller
exports.getCategoryAnimes = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { page } = req.query;
    const result = await animeService.getCategoryAnimes(category, page);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Schedule controller
exports.getSchedule = async (req, res, next) => {
  try {
    const { date } = req.query;
    const result = await animeService.getSchedule(date);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Anime Episodes controller
exports.getAnimeEpisodes = async (req, res, next) => {
  try {
    const { animeId } = req.params;
    const result = await animeService.getAnimeEpisodes(animeId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Episode Servers controller
exports.getEpisodeServers = async (req, res, next) => {
  try {
    const { animeEpisodeId } = req.query;
    const result = await animeService.getEpisodeServers(animeEpisodeId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Episode Sources controller
exports.getEpisodeSources = async (req, res, next) => {
  try {
    const { animeEpisodeId, server, category } = req.query;
    const result = await animeService.getEpisodeSources(animeEpisodeId, server, category);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

```

Now let's create the routes file to organize our API endpoints:

```javascript
// routes/animeRoutes.js
const express = require('express');
const router = express.Router();
const animeController = require('../controllers/animeController');

// Home Page route
router.get('/home', animeController.getHomePage);

// A-Z List route
router.get('/azlist/:sortOption', animeController.getAZList);

// Anime Qtip Info route
router.get('/qtip/:animeId', animeController.getAnimeQtip);

// Anime About Info route
router.get('/anime/:animeId', animeController.getAnimeInfo);

// Basic Search route
router.get('/search', animeController.searchAnime);

// Advanced Search route
router.get('/advanced-search', animeController.advancedSearch);

// Search Suggestions route
router.get('/search/suggestion', animeController.getSearchSuggestions);

// Producer Animes route
router.get('/producer/:name', animeController.getProducerAnimes);

// Genre Animes route
router.get('/genre/:name', animeController.getGenreAnimes);

// Category Animes route
router.get('/category/:category', animeController.getCategoryAnimes);

// Estimated Schedules route
router.get('/schedule', animeController.getSchedule);

// Anime Episodes route
router.get('/anime/:animeId/episodes', animeController.getAnimeEpisodes);

// Anime Episode Servers route
router.get('/episode/servers', animeController.getEpisodeServers);

// Anime Episode Streaming Links route
router.get('/episode/sources', animeController.getEpisodeSources);

module.exports = router;

```

Finally, let's update our main server file to use these routes:

```javascript
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
  max: 100, // limit each IP to 100 requests per windowMs
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

```

Let's also create a sample `.env` file for configuration:

```plaintext
# Server Configuration
PORT=3000
NODE_ENV=development

# API Configuration
BASE_API_URL=https://anikaiser-api.vercel.app/api/v2/hianime

# Rate Limiter
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX=100

# Cache Configuration
CACHE_ENABLED=true
CACHE_TTL=600  # 10 minutes

```

Finally, let's create a package.json file:

```json
{
  "name": "anime-api-backend",
  "version": "1.0.0",
  "description": "A backend API for anime information using anikaiser-api.vercel.app",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  },
  "keywords": [
    "anime",
    "api",
    "express",
    "aniwatch",
    "hianime"
  ],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "axios": "^1.6.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "express-rate-limit": "^7.1.4",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "nodemon": "^3.0.1"
  }
}

```

## How to Use This Backend API

1. **Setup Instructions**:
   - Copy all the files to your project directory
   - Run `npm install` to install dependencies
   - Create a `.env` file with the provided template
   - Start the server with `npm start` or `npm run dev` for development

2. **Key Features**:
   - Complete implementation of all Aniwatch API endpoints
   - Rate limiting to prevent abuse
   - Error handling and logging
   - Clean architecture with service-controller pattern
   - CORS enabled for cross-origin requests
   - Security headers with Helmet

3. **API Endpoints**:
   - **Home Page**: `/api/home`
   - **A-Z List**: `/api/azlist/:sortOption?page=1`
   - **Anime Qtip**: `/api/qtip/:animeId`
   - **Anime Info**: `/api/anime/:animeId`
   - **Search**: `/api/search?q=query&page=1`
   - **Advanced Search**: `/api/advanced-search` with multiple parameters
   - **Search Suggestions**: `/api/search/suggestion?q=query`
   - **Producer Animes**: `/api/producer/:name?page=1`
   - **Genre Animes**: `/api/genre/:name?page=1`
   - **Category Animes**: `/api/category/:category?page=1`
   - **Schedules**: `/api/schedule?date=yyyy-mm-dd`
   - **Anime Episodes**: `/api/anime/:animeId/episodes`
   - **Episode Servers**: `/api/episode/servers?animeEpisodeId=id`
   - **Episode Sources**: `/api/episode/sources?animeEpisodeId=id&server=server&category=category`

The API provides complete access to all the features mentioned in the documentation, with a clean architecture that makes it easy to maintain and extend.