import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const AnimeCard = ({ anime, isSpotlight = false }) => {
  if (!anime) return null;
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="relative group"
    >
      <Link to={`/anime/${anime.id}`}>
        <div className="relative overflow-hidden rounded-lg">
          <img 
            src={anime.poster} 
            alt={anime.name}
            className={`w-full ${isSpotlight ? 'h-[400px]' : 'h-[300px]'} object-cover`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute bottom-0 p-4">
              <h3 className="text-white font-semibold">{anime.name}</h3>
              {anime.episodes && (
                <p className="text-purple-400">
                  {`Sub: ${anime.episodes.sub || 0} | Dub: ${anime.episodes.dub || 0}`}
                </p>
              )}
              {anime.type && (
                <p className="text-purple-300">{anime.type}</p>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const Home = () => {
  const [trendingAnime, setTrendingAnime] = useState([]);
  const [recentEpisodes, setRecentEpisodes] = useState([]);
  const [spotlightAnime, setSpotlightAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSpotlight, setCurrentSpotlight] = useState(0);
  const spotlightRef = useRef(null);
  const autoScrollRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/home`);
        console.log('API Response:', response.data);

        if (response.data.success && response.data.data) {
          const { trendingAnimes, latestEpisodeAnimes, spotlightAnimes } = response.data.data;
          
          setTrendingAnime(trendingAnimes || []);
          setRecentEpisodes(latestEpisodeAnimes || []);
          setSpotlightAnime(spotlightAnimes || []);
          
          console.log('Trending Anime:', trendingAnimes);
          console.log('Recent Episodes:', latestEpisodeAnimes);
          console.log('Spotlight Anime:', spotlightAnimes);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-scroll effect for spotlight
  useEffect(() => {
    if (spotlightAnime.length === 0) return;

    const startAutoScroll = () => {
      autoScrollRef.current = setInterval(() => {
        setCurrentSpotlight((prev) => (prev + 1) % spotlightAnime.length);
      }, 5000); // Change slide every 5 seconds
    };

    startAutoScroll();

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [spotlightAnime]);

  const handleSpotlightScroll = (direction) => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }

    if (direction === 'prev') {
      setCurrentSpotlight((prev) => 
        prev === 0 ? spotlightAnime.length - 1 : prev - 1
      );
    } else {
      setCurrentSpotlight((prev) => 
        (prev + 1) % spotlightAnime.length
      );
    }

    // Restart auto-scroll after user interaction
    autoScrollRef.current = setInterval(() => {
      setCurrentSpotlight((prev) => (prev + 1) % spotlightAnime.length);
    }, 5000);
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl text-red-500">Error: {error}</h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 space-y-12 py-8">
      {/* Spotlight Anime Section */}
      {spotlightAnime.length > 0 && (
        <section className="relative" ref={spotlightRef}>
          <h2 className="text-3xl font-bold mb-6 text-purple-400">Spotlight Anime</h2>
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSpotlight}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                <AnimeCard anime={spotlightAnime[currentSpotlight]} isSpotlight={true} />
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              onClick={() => handleSpotlightScroll('prev')}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-r-lg hover:bg-black/70 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => handleSpotlightScroll('next')}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-l-lg hover:bg-black/70 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dots Navigation */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {spotlightAnime.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (autoScrollRef.current) {
                      clearInterval(autoScrollRef.current);
                    }
                    setCurrentSpotlight(index);
                    autoScrollRef.current = setInterval(() => {
                      setCurrentSpotlight((prev) => (prev + 1) % spotlightAnime.length);
                    }, 5000);
                  }}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    currentSpotlight === index ? 'bg-purple-500' : 'bg-gray-500 hover:bg-purple-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trending Anime Section */}
      {trendingAnime.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold mb-6 text-purple-400">Trending Anime</h2>
          <div className="overflow-x-auto pb-4">
            <div className="flex space-x-6">
              {trendingAnime.map((anime) => (
                <div key={anime.id} className="w-64 flex-shrink-0">
                  <AnimeCard anime={anime} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Episodes Section */}
      {recentEpisodes.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold mb-6 text-purple-400">Recent Episodes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {recentEpisodes.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        </section>
      )}

      {/* Show message if no data is available */}
      {!spotlightAnime.length && !trendingAnime.length && !recentEpisodes.length && (
        <div className="text-center py-12">
          <h2 className="text-2xl text-yellow-500">No anime data available</h2>
        </div>
      )}
    </div>
  );
};

export default Home; 