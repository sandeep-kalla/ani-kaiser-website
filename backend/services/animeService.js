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