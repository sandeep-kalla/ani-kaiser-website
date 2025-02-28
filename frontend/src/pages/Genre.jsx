import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const Genre = () => {
  const { genreName } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [genreData, setGenreData] = useState({
    genreName: '',
    animes: [],
    genres: [],
    topAiringAnimes: [],
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const page = parseInt(searchParams.get('page')) || 1;

  useEffect(() => {
    const fetchAnimeByGenre = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/genre/${genreName}`, {
          params: { page },
        });

        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to fetch anime list');
        }

        setGenreData(response.data.data);
      } catch (error) {
        console.error('Error fetching anime by genre:', error);
        setError(error.message || 'Failed to load anime list');
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeByGenre();
  }, [genreName, page]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl text-red-500">{error}</h2>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-8 text-purple-400 capitalize">
            {genreData.genreName}
          </h1>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {genreData.animes?.map((anime) => (
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
                    <p className="text-sm text-gray-400 mt-2">
                      {anime.duration} • {anime.rating}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {genreData.animes?.length > 0 && (
            <div className="flex justify-center mt-8 space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearchParams({ page: Math.max(1, page - 1) })}
                disabled={page === 1}
                className={`px-4 py-2 rounded-lg ${
                  page === 1
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                Previous
              </motion.button>
              {genreData.hasNextPage && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSearchParams({ page: page + 1 })}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Next
                </motion.button>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:w-80">
          {/* Other Genres */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-purple-400">Other Genres</h2>
            <div className="flex flex-wrap gap-2">
              {genreData.genres?.map((genre) => (
                <Link
                  key={genre}
                  to={`/genre/${genre.toLowerCase()}`}
                  className="px-3 py-1 bg-gray-700 text-sm text-gray-300 rounded-full hover:bg-purple-600 hover:text-white transition-colors"
                >
                  {genre}
                </Link>
              ))}
            </div>
          </div>

          {/* Top Airing Anime */}
          {genreData.topAiringAnimes?.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-purple-400">Top Airing Anime</h2>
              <div className="space-y-4">
                {genreData.topAiringAnimes.map((anime) => (
                  <Link
                    key={anime.id}
                    to={`/anime/${anime.id}`}
                    className="flex gap-3 group"
                  >
                    <img
                      src={anime.poster}
                      alt={anime.name}
                      className="w-16 h-24 object-cover rounded"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder.jpg';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white group-hover:text-purple-400 transition-colors truncate">
                        {anime.name}
                      </h3>
                      <p className="text-sm text-gray-400 truncate mt-1">
                        {anime.jname}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                          {anime.type}
                        </span>
                        {(anime.episodes?.sub > 0 || anime.episodes?.dub > 0) && (
                          <span className="text-xs bg-purple-600 px-2 py-1 rounded">
                            {anime.episodes.sub > 0 && `SUB: ${anime.episodes.sub}`}
                            {anime.episodes.sub > 0 && anime.episodes.dub > 0 && ' | '}
                            {anime.episodes.dub > 0 && `DUB: ${anime.episodes.dub}`}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Genre; 