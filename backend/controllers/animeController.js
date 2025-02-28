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