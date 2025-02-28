import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState({
    animes: [],
    mostPopularAnimes: [],
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false
  });
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    genres: '',
    status: '',
    type: '',
    season: '',
    language: '',
    rated: '',
    sort: '',
    start_date: '',
    score: ''
  });

  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page')) || 1;

  // Fetch search suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query || query.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/api/search/suggestion`, {
          params: { q: query }
        });

        if (response.data.success) {
          setSuggestions(response.data.data.suggestions || []);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  // Fetch search results
  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setSearchResults({
          animes: [],
          mostPopularAnimes: [],
          currentPage: 1,
          totalPages: 1,
          hasNextPage: false
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Remove empty filters
        const activeFilters = Object.entries(filters).reduce((acc, [key, value]) => {
          if (value) acc[key] = value;
          return acc;
        }, {});

        const response = await axios.get(`http://localhost:3000/api/search`, {
          params: {
            q: query,
            page,
            ...activeFilters
          },
        });

        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to fetch results');
        }

        setSearchResults(response.data.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setError('Failed to load search results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, page, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    // Reset to page 1 when filters change
    setSearchParams(prev => {
      prev.set('page', '1');
      return prev;
    });
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchParams({ q: suggestion.name, page: '1' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-8 text-purple-400">
        Search Results for "{query}"
      </h1>

      {/* Search Suggestions */}
      {suggestions.length > 0 && (
        <div className="mb-8 bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4 text-purple-400">Suggestions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {suggestions.map((suggestion) => (
              <motion.div
                key={suggestion.id}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-600 transition-colors"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <img
                      src={suggestion.poster}
                      alt={suggestion.name}
                      className="w-16 h-20 object-cover rounded"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder.jpg';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">
                      {suggestion.name}
                    </p>
                    <p className="text-gray-400 text-xs truncate mt-1">
                      {suggestion.jname}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {suggestion.moreInfo.map((info, index) => (
                        <span
                          key={index}
                          className="inline-block bg-gray-800 text-gray-300 text-xs px-1.5 py-0.5 rounded"
                        >
                          {info}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <select
          value={filters.type}
          onChange={(e) => handleFilterChange('type', e.target.value)}
          className="bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Types</option>
          <option value="tv">TV</option>
          <option value="movie">Movie</option>
          <option value="ova">OVA</option>
          <option value="ona">ONA</option>
          <option value="special">Special</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Status</option>
          <option value="finished-airing">Finished</option>
          <option value="currently-airing">Ongoing</option>
          <option value="not-yet-aired">Not Yet Aired</option>
        </select>

        <select
          value={filters.language}
          onChange={(e) => handleFilterChange('language', e.target.value)}
          className="bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Languages</option>
          <option value="sub">Subbed</option>
          <option value="dub">Dubbed</option>
          <option value="sub-&-dub">Sub & Dub</option>
        </select>

        <select
          value={filters.season}
          onChange={(e) => handleFilterChange('season', e.target.value)}
          className="bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Seasons</option>
          <option value="spring">Spring</option>
          <option value="summer">Summer</option>
          <option value="fall">Fall</option>
          <option value="winter">Winter</option>
        </select>

        <select
          value={filters.sort}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
          className="bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Sort By</option>
          <option value="recently-added">Recently Added</option>
          <option value="score">Score</option>
          <option value="title">Title</option>
          <option value="year">Year</option>
        </select>

        <select
          value={filters.rated}
          onChange={(e) => handleFilterChange('rated', e.target.value)}
          className="bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Ratings</option>
          <option value="g">G</option>
          <option value="pg">PG</option>
          <option value="pg-13">PG-13</option>
          <option value="r">R</option>
          <option value="r+">R+</option>
        </select>
      </div>

      {/* Results Grid */}
      {error ? (
        <div className="text-center py-12">
          <h2 className="text-2xl text-red-500">{error}</h2>
        </div>
      ) : searchResults.animes?.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {searchResults.animes.map((anime) => (
            <motion.div
              key={anime.id}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
            >
              <Link to={`/anime/${anime.id}`}>
                <div className="relative">
                  <img
                    src={anime.poster}
                    alt={anime.name}
                    className="w-full h-[300px] object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder.jpg';
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded text-xs">
                    {anime.type}
                  </div>
                  {(anime.episodes?.sub > 0 || anime.episodes?.dub > 0) && (
                    <div className="absolute bottom-2 left-2 bg-purple-600 px-2 py-1 rounded text-xs">
                      {anime.episodes.sub > 0 && `SUB: ${anime.episodes.sub}`}
                      {anime.episodes.sub > 0 && anime.episodes.dub > 0 && ' | '}
                      {anime.episodes.dub > 0 && `DUB: ${anime.episodes.dub}`}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white truncate">
                    {anime.name}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {anime.duration} • {anime.rating}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          No results found for "{query}"
        </div>
      )}

      {/* Pagination */}
      {searchResults.animes?.length > 0 && (
        <div className="flex justify-center mt-8 space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSearchParams({ q: query, page: Math.max(1, page - 1) })}
            disabled={page === 1}
            className={`px-4 py-2 rounded-lg ${
              page === 1
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            Previous
          </motion.button>
          {searchResults.hasNextPage && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchParams({ q: query, page: page + 1 })}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Next
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default Search; 