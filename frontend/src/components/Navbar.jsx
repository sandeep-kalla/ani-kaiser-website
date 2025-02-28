import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showDesktopGenres, setShowDesktopGenres] = useState(false);
  const [showMobileGenres, setShowMobileGenres] = useState(false);
  const [genres, setGenres] = useState([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const genreButtonRef = useRef(null);
  const genreDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length > 2) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/search/suggestion?q=${searchQuery}`);
          setSuggestions(response.data.results || []);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      } else {
        setSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Fetch genres when component mounts
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/genre/action`);
        if (response.data.success) {
          setGenres(response.data.data.genres || []);
        }
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Handle desktop genre dropdown
      if (genreButtonRef.current && genreDropdownRef.current) {
        if (!genreButtonRef.current.contains(event.target) && 
            !genreDropdownRef.current.contains(event.target)) {
          setShowDesktopGenres(false);
        }
      }

      // Handle mobile menu - only close if clicking outside both the menu and the toggle button
      if (mobileMenuRef.current && 
          !mobileMenuRef.current.contains(event.target) && 
          !event.target.closest('.mobile-menu-button')) {
        setShowMobileMenu(false);
        setShowMobileGenres(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setShowMobileMenu(false);
    setShowMobileGenres(false);
  }, [navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      setSearchQuery('');
    }
  };

  const handleMobileMenuToggle = () => {
    setShowMobileMenu((prev) => !prev);
    if (showMobileGenres) setShowMobileGenres(false);
  };

  const handleMobileMenuClose = () => {
    setShowMobileMenu(false);
    setShowMobileGenres(false);
  };

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/otaku.png" 
              alt="AniKaiser Logo" 
              className="h-8 w-8"
            />
            <motion.span 
              whileHover={{ scale: 1.1 }}
              className="text-2xl font-bold"
            >
              <span className="text-white">Ani</span>
              <span className="text-purple-500">Kaiser</span>
            </motion.span>
          </Link>

          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full bg-gray-700 text-white rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Search anime..."
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                    />
                  </svg>
                </button>
              </form>
              
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute w-full mt-2 bg-gray-700 rounded-lg shadow-xl z-50"
                  >
                    {suggestions.map((suggestion) => (
                      <Link
                        key={suggestion.id}
                        to={`/anime/${suggestion.id}`}
                        className="block px-4 py-2 hover:bg-gray-600 text-white"
                        onClick={() => setShowSuggestions(false)}
                      >
                        {suggestion.title}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/az-list" className="text-gray-300 hover:text-white transition-colors">
              A-Z List
            </Link>
            
            <div className="relative" ref={genreButtonRef}>
              <button
                onClick={() => setShowDesktopGenres(!showDesktopGenres)}
                className="text-gray-300 hover:text-white transition-colors focus:outline-none"
              >
                Genres
              </button>
              
              <AnimatePresence>
                {showDesktopGenres && (
                  <motion.div
                    ref={genreDropdownRef}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-64 bg-gray-700 rounded-lg shadow-xl z-50 py-2"
                  >
                    <div className="max-h-96 overflow-y-auto">
                      {genres.map((genre) => (
                        <Link
                          key={genre}
                          to={`/genre/${genre.toLowerCase()}`}
                          className="block px-4 py-2 text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
                          onClick={() => setShowDesktopGenres(false)}
                        >
                          {genre}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={handleMobileMenuToggle}
              className="mobile-menu-button text-gray-300 hover:text-white p-2 focus:outline-none relative z-50"
              aria-label={showMobileMenu ? "Close menu" : "Open menu"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 transition-transform duration-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={showMobileMenu ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence mode="wait">
          {showMobileMenu && (
            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-gray-700"
            >
              <div className="py-3 space-y-3">
                <Link
                  to="/az-list"
                  className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  onClick={handleMobileMenuClose}
                >
                  <div className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <span>A-Z List</span>
                  </div>
                </Link>

                <div className="px-4">
                  <button
                    onClick={() => setShowMobileGenres(!showMobileGenres)}
                    className="w-full flex items-center justify-between py-2 text-gray-300 hover:text-white transition-colors focus:outline-none"
                  >
                    <div className="flex items-center space-x-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      <span>Genres</span>
                    </div>
                  </button>

                  <AnimatePresence>
                    {showMobileGenres && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 pl-7 space-y-2"
                      >
                        {genres.map((genre) => (
                          <Link
                            key={genre}
                            to={`/genre/${genre.toLowerCase()}`}
                            className="block py-1 text-gray-400 hover:text-white transition-colors"
                            onClick={handleMobileMenuClose}
                          >
                            {genre}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar; 