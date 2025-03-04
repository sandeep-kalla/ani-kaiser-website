import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import '@videojs/http-streaming';
import '@videojs/themes/dist/forest/index.css';
import './WatchEpisode.css'; // Import custom CSS for mobile optimization

const WatchEpisode = () => {
  const { animeId, episodeId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [servers, setServers] = useState([]);
  const [selectedServer, setSelectedServer] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('sub');
  const [videoSource, setVideoSource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [episodeDetails, setEpisodeDetails] = useState(null);
  const [allEpisodes, setAllEpisodes] = useState([]);

  // Fetch episode details and initialize servers
  useEffect(() => {
    const fetchEpisodeDetails = async () => {
      try {
        setLoading(true);
        setVideoSource(null); // Reset video source when fetching new episode
        
        // First get the episodes list
        const episodesResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/anime/${animeId}/episodes`);
        
        if (!episodesResponse.data.success) {
          throw new Error(episodesResponse.data.message || 'Failed to fetch episodes');
        }

        const episodes = episodesResponse.data.data.episodes;
        setAllEpisodes(episodes);

        const currentEpisode = episodes.find(ep => ep.number === parseInt(episodeId));
        
        if (!currentEpisode) {
          throw new Error('Episode not found');
        }

        setEpisodeDetails(currentEpisode);

        // Get the servers for this episode
        const serverResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/episode/servers`, {
          params: { animeEpisodeId: currentEpisode.episodeId }
        });
        
        if (!serverResponse.data.success) {
          throw new Error(serverResponse.data.message || 'Failed to fetch servers');
        }

        // Store all category servers
        const availableServers = serverResponse.data.data[selectedCategory] || [];
        setServers(availableServers.map(s => s.serverName));
        
        // Set initial server and fetch video source
        if (availableServers.length > 0) {
          const initialServer = availableServers[0].serverName;
          setSelectedServer(initialServer);
          await fetchVideoSource(currentEpisode.episodeId, initialServer, selectedCategory);
        }

      } catch (error) {
        console.error('Error in episode setup:', error);
        setError(error.message || 'Failed to load episode');
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodeDetails();
  }, [animeId, episodeId]);

  // Handle category change separately
  useEffect(() => {
    const updateCategory = async () => {
      if (!episodeDetails) return;

      try {
        setLoading(true);
        
        // Get the servers for this episode and category
        const serverResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/episode/servers`, {
          params: { animeEpisodeId: episodeDetails.episodeId }
        });
        
        if (!serverResponse.data.success) {
          throw new Error(serverResponse.data.message || 'Failed to fetch servers');
        }

        const availableServers = serverResponse.data.data[selectedCategory] || [];
        setServers(availableServers.map(s => s.serverName));

        if (availableServers.length > 0) {
          const initialServer = availableServers[0].serverName;
          setSelectedServer(initialServer);
          await fetchVideoSource(episodeDetails.episodeId, initialServer, selectedCategory);
        }
      } catch (error) {
        console.error('Error updating category:', error);
        setError(error.message || 'Failed to update category');
      } finally {
        setLoading(false);
      }
    };

    updateCategory();
  }, [selectedCategory, episodeDetails]);

  // Initialize video player when source changes
  useEffect(() => {
    // Return early if no source
    if (!videoSource) return;
    
    // Ensure video element exists
    if (!videoRef.current) {
      return; // Return early if video element doesn't exist yet
    }

    // Ensure we clean up the previous player instance
    if (playerRef.current) {
      playerRef.current.dispose();
      playerRef.current = null;
    }

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      if (!videoRef.current) return; // Double check element still exists

      const options = {
        controls: true,
        responsive: true,
        fluid: true,
        playbackRates: [0.5, 1, 1.5, 2],
        sources: [{
          src: videoSource.url,
          type: 'application/x-mpegURL',
        }],
        html5: {
          hls: {
            overrideNative: true,
            enableLowInitialPlaylist: true,
            smoothQualityChange: true,
            handleManifestRedirects: true,
            withCredentials: false,
          },
          nativeTextTracks: false,
          nativeAudioTracks: false,
          nativeVideoTracks: false,
        },
        userActions: {
          hotkeys: true
        },
        // Add control bar configuration to ensure subtitle button is visible
        controlBar: {
          children: [
            'playToggle',
            'volumePanel',
            'currentTimeDisplay',
            'timeDivider',
            'durationDisplay',
            'progressControl',
            'liveDisplay',
            'remainingTimeDisplay',
            'customControlSpacer',
            'playbackRateMenuButton',
            'chaptersButton',
            'descriptionsButton',
            'subsCapsButton',  // This explicitly adds the subtitle/caption button
            'audioTrackButton',
            'fullscreenToggle'
          ]
        },
        // Add subtitle tracks directly in the player options
        tracks: videoSource.subtitles ? videoSource.subtitles.map((subtitle, index) => ({
          kind: 'subtitles',
          src: subtitle.file,
          srclang: subtitle.srclang || 'en',
          label: subtitle.label || 'Default',
          default: index === 0
        })) : []
      };

      // Initialize new player
      const player = videojs(videoRef.current, options);
      player.addClass('vjs-theme-forest');

      // Add subtitle tracks if available
      if (videoSource.subtitles && Array.isArray(videoSource.subtitles)) {
        // Clear existing text tracks
        while (player.remoteTextTracks().length > 0) {
          player.removeRemoteTextTrack(player.remoteTextTracks()[0]);
        }

        // Add all available subtitle tracks
        videoSource.subtitles.forEach((subtitle, index) => {
          const trackEl = player.addRemoteTextTrack({
            kind: 'subtitles',
            src: subtitle.file,
            srclang: subtitle.srclang || 'en',
            label: subtitle.label || 'Default',
            default: index === 0 // Make first track default
          }, false); // Set to false to manually control showing
          
          // Log subtitle track for debugging
          console.log(`Added subtitle track: ${subtitle.file}`, trackEl);
        });

        // Force enable the first subtitle track after a short delay
        setTimeout(() => {
          const tracks = player.textTracks();
          console.log('Available text tracks:', tracks.length);
          
          for (let i = 0; i < tracks.length; i++) {
            const track = tracks[i];
            console.log(`Track ${i}:`, track.label, track.language, track.kind);
            
            // Enable the first subtitle track
            if (track.kind === 'subtitles') {
              console.log('Setting track to showing:', track.label);
              track.mode = 'showing';
              break; // Only enable the first one
            }
          }
        }, 1000); // Give time for tracks to load
      }

      // Add keyboard controls
      const handleKeyPress = (e) => {
        if (e.target.tagName.toLowerCase() === 'input') return;

        const seekTime = 10;
        const volumeStep = 0.1;
        let speed;

        switch(e.key.toLowerCase()) {
          case ' ':
            e.preventDefault();
            player.paused() ? player.play() : player.pause();
            break;
          case 'arrowleft':
            e.preventDefault();
            player.currentTime(Math.max(0, player.currentTime() - seekTime));
            break;
          case 'arrowright':
            e.preventDefault();
            player.currentTime(Math.min(player.duration(), player.currentTime() + seekTime));
            break;
          case 'arrowup':
            e.preventDefault();
            player.volume(Math.min(1, player.volume() + volumeStep));
            break;
          case 'arrowdown':
            e.preventDefault();
            player.volume(Math.max(0, player.volume() - volumeStep));
            break;
          case 'm':
            player.muted(!player.muted());
            break;
          case 'f':
            if (player.isFullscreen()) {
              player.exitFullscreen();
            } else {
              player.requestFullscreen();
            }
            break;
          case '0':
          case '1':
          case '2':
          case '3':
          case '4':
          case '5':
            speed = Number(e.key) / 2;
            if (speed === 0) {
              player.pause();
            } else {
              player.playbackRate(speed);
            }
            break;
          default:
            break;
        }
      };

      document.addEventListener('keydown', handleKeyPress);
      playerRef.current = player;

      return () => {
        document.removeEventListener('keydown', handleKeyPress);
        clearTimeout(timeoutId);
        if (playerRef.current) {
          playerRef.current.dispose();
          playerRef.current = null;
        }
      };
    }, 100); // Small delay to ensure DOM is ready

    return () => {
      clearTimeout(timeoutId);
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [videoSource]);

  const fetchVideoSource = async (epId, server, category) => {
    try {
      setLoading(true);
      const sourceResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/episode/sources`, {
        params: {
          animeEpisodeId: epId,
          server,
          category
        }
      });

      if (!sourceResponse.data.success) {
        throw new Error(sourceResponse.data.message || 'Failed to fetch video source');
      }
      const { sources, tracks = [] } = sourceResponse.data.data;
      // Safely log subtitles if they exist
      if (tracks && tracks.length > 0 && tracks[0]?.file) {
        console.log("subtitle 1", tracks[0].file);
        if (tracks.length > 1 && tracks[1]?.file) {
          console.log("subtitle 2", tracks[1].file);
        }
      }
      // Update video source handling with all available subtitle tracks
      if (sources && sources.length > 0) {
        setVideoSource({
          url: sources[0].url,
          type: sources[0].type || 'hls',
          subtitles: tracks && tracks.length > 0 ? tracks.map(track => ({
            file: track.file,
            label: track.label || 'Default',
            kind: 'subtitles',
            srclang: track.lang || 'en'
          })) : null
        });
      } else {
        setVideoSource(null);
        setError('No video sources available');
      }
    } catch (error) {
      console.error('Error fetching video source:', error);
      setError(error.message || 'Failed to load video source');
    } finally {
      setLoading(false);
    }
  };

  const handleServerChange = async (server) => {
    setSelectedServer(server);
    if (episodeDetails) {
      await fetchVideoSource(episodeDetails.episodeId, server, selectedCategory);
    }
  };

  const handleCategoryChange = async (category) => {
    setSelectedCategory(category);
  };

  const handleEpisodeClick = (episode) => {
    navigate(`/watch/${animeId}/${episode.number}`);
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
        <button
          onClick={() => navigate(`/anime/${animeId}`)}
          className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Back to Anime Details
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Episode Title */}
      {episodeDetails && (
        <h1 className="text-2xl font-bold mb-4 text-purple-400">
          Episode {episodeDetails.number}: {episodeDetails.title}
        </h1>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content - Video Player and Controls */}
        <div className="lg:col-span-3 space-y-6">
          {/* Video Player */}
          <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden relative group">
            <div data-vjs-player>
              <video
                ref={videoRef}
                className="video-js vjs-big-play-centered vjs-theme-forest"
                playsInline
              />
            </div>
            
            {/* Keyboard Controls Help - Hidden on mobile */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-75 text-white p-4 rounded text-sm hidden md:block">
              <h3 className="font-semibold mb-2">Keyboard Controls:</h3>
              <ul className="space-y-1">
                <li>Space - Play/Pause</li>
                <li>← → - Seek 10s</li>
                <li>↑ ↓ - Volume</li>
                <li>M - Mute</li>
                <li>F - Fullscreen</li>
                <li>0-5 - Playback Speed</li>
              </ul>
            </div>
          </div>

          {/* Category Selection */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Category:</h3>
            <div className="flex gap-4">
              {['sub', 'dub', 'raw'].map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === category
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {category.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Server Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Servers:</h3>
            <div className="flex flex-wrap gap-4">
              {servers.map((server) => (
                <button
                  key={server}
                  onClick={() => handleServerChange(server)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedServer === server
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {server}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => navigate(`/anime/${animeId}`)}
              className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Back to Episodes
            </button>
            
            <div className="flex gap-4">
              {parseInt(episodeId) > 1 && (
                <button
                  onClick={() => navigate(`/watch/${animeId}/${parseInt(episodeId) - 1}`)}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Previous Episode
                </button>
              )}
              {episodeDetails && parseInt(episodeId) < episodeDetails.totalEpisodes && (
                <button
                  onClick={() => navigate(`/watch/${animeId}/${parseInt(episodeId) + 1}`)}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Next Episode
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Episodes List Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4 text-purple-400">Episodes</h2>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {allEpisodes.map((episode) => (
                <button
                  key={episode.number}
                  onClick={() => handleEpisodeClick(episode)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    episode.number === parseInt(episodeId)
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <div className="font-semibold">Episode {episode.number}</div>
                  <div className="text-sm truncate">{episode.title}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchEpisode;