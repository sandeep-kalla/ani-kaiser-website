import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const AZList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [animeList, setAnimeList] = useState({
    sortOption: '',
    animes: [],
    totalPages: 1,
    currentPage: 1,
    hasNextPage: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const page = parseInt(searchParams.get('page')) || 1;
  const sortOption = searchParams.get('sort') || '0-9';

  useEffect(() => {
    const fetchAnimeList = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/api/azlist/${sortOption}`, {
          params: { page },
        });
        
        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to fetch anime list');
        }
        
        setAnimeList(response.data.data);
      } catch (error) {
        console.error('Error fetching anime list:', error);
        setError(error.message || 'Failed to load anime list');
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeList();
  }, [page, sortOption]);

  const handleSortChange = (option) => {
    setSearchParams({ sort: option, page: '1' });
  };

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
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-purple-400 mb-4 md:mb-0">Anime A-Z List</h1>
        
        <div className="flex flex-wrap gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSortChange('0-9')}
            className={`px-4 py-2 rounded-lg ${
              sortOption === '0-9'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            0-9
          </motion.button>
          {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
            'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].map((letter) => (
            <motion.button
              key={letter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSortChange(letter.toLowerCase())}
              className={`px-4 py-2 rounded-lg ${
                sortOption === letter.toLowerCase()
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {letter}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {animeList.animes?.map((anime) => (
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
                <p className="text-sm text-gray-400 truncate mt-1">
                  {anime.jname}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  {anime.duration} • {anime.rating}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {animeList.animes?.length > 0 && (
        <div className="flex justify-center mt-8 space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSearchParams({ sort: sortOption, page: Math.max(1, page - 1) })}
            disabled={page === 1}
            className={`px-4 py-2 rounded-lg ${
              page === 1
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            Previous
          </motion.button>
          {animeList.hasNextPage && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchParams({ sort: sortOption, page: page + 1 })}
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

export default AZList; 