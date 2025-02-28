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