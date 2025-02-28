import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const CharacterCard = ({ character, voiceActor }) => (
  <div className="bg-gray-800 rounded-lg overflow-hidden">
    <div className="grid grid-cols-2 gap-2">
      {/* Character */}
      <div className="p-2">
        <img src={character.poster} alt={character.name} className="w-full h-40 object-cover rounded" />
        <div className="p-2">
          <h4 className="font-semibold text-sm">{character.name}</h4>
          <p className="text-gray-400 text-xs">{character.cast}</p>
        </div>
      </div>
      {/* Voice Actor */}
      <div className="p-2">
        <img src={voiceActor.poster} alt={voiceActor.name} className="w-full h-40 object-cover rounded" />
        <div className="p-2">
          <h4 className="font-semibold text-sm">{voiceActor.name}</h4>
          <p className="text-gray-400 text-xs">{voiceActor.cast}</p>
        </div>
      </div>
    </div>
  </div>
);

const AnimeCard = ({ anime }) => (
  <Link to={`/anime/${anime.id}`} className="block">
    <div className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform">
      <img src={anime.poster} alt={anime.name} className="w-full h-48 object-cover" />
      <div className="p-3">
        <h3 className="font-semibold text-sm truncate">{anime.name}</h3>
        <div className="text-xs text-gray-400 mt-1">
          <span>{anime.type}</span>
          {anime.episodes && (
            <span className="ml-2">
              EP: {anime.episodes.sub}/{anime.episodes.dub}
            </span>
          )}
        </div>
      </div>
    </div>
  </Link>
);

const AnimeDetails = () => {
  const { animeId } = useParams();
  const [animeData, setAnimeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/api/anime/${animeId}`);
        console.log('Anime Details Response:', response.data);

        if (response.data.success && response.data.data) {
          setAnimeData(response.data.data);
        } else {
          setError('Failed to load anime details');
        }
      } catch (error) {
        console.error('Error fetching anime details:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeDetails();
  }, [animeId]);

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
        <h2 className="text-2xl text-red-500">Error: {error}</h2>
      </div>
    );
  }

  if (!animeData?.anime?.info) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl text-yellow-500">Anime not found</h2>
      </div>
    );
  }

  const { info, moreInfo } = animeData.anime;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Anime Image and Quick Stats */}
        <div className="md:col-span-1 space-y-4">
          <img
            src={info.poster}
            alt={info.name}
            className="w-full rounded-lg shadow-lg"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
            }}
          />
          
          {/* Quick Stats */}
          <div className="bg-gray-800 rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Rating:</span>
              <span className="text-white">{info.stats.rating}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Quality:</span>
              <span className="text-white">{info.stats.quality}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Type:</span>
              <span className="text-white">{info.stats.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Duration:</span>
              <span className="text-white">{info.stats.duration}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-700">
              <div className="text-center">
                <div className="text-purple-400">Sub</div>
                <div className="text-lg font-bold">{info.stats.episodes.sub}</div>
              </div>
              <div className="text-center">
                <div className="text-purple-400">Dub</div>
                <div className="text-lg font-bold">{info.stats.episodes.dub}</div>
              </div>
            </div>
          </div>

          {/* Watch Button */}
          <Link
            to={`/watch/${info.id}/1`}
            className="block text-center bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Watch Now
          </Link>
        </div>

        {/* Anime Details */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-purple-400">{info.name}</h1>
            {moreInfo.studios && (
              <p className="text-gray-400 mt-2">Studio: {moreInfo.studios}</p>
            )}
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2">
            {moreInfo.genres?.map((genre) => (
              <Link
                key={genre}
                to={`/genre/${genre.toLowerCase()}`}
                className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm hover:bg-purple-700 transition-colors"
              >
                {genre}
              </Link>
            ))}
          </div>

          {/* More Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 p-3 rounded">
              <span className="text-gray-400">Status:</span>
              <span className="ml-2">{moreInfo.status}</span>
            </div>
            <div className="bg-gray-800 p-3 rounded">
              <span className="text-gray-400">Aired:</span>
              <span className="ml-2">{moreInfo.aired}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xl font-semibold mb-2 text-purple-400">Synopsis</h3>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {info.description}
            </p>
          </div>
        </div>
      </div>

      {/* Promotional Videos */}
      {info.promotionalVideos?.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-purple-400">Promotional Videos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {info.promotionalVideos.map((video, index) => (
              <div key={index} className="bg-gray-800 rounded-lg overflow-hidden">
                <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold">{video.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Characters & Voice Actors */}
      {info.characterVoiceActor?.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-purple-400">Characters & Voice Actors</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {info.characterVoiceActor.map((pair, index) => (
              <CharacterCard
                key={index}
                character={pair.character}
                voiceActor={pair.voiceActor}
              />
            ))}
          </div>
        </div>
      )}

      {/* Related Anime */}
      {animeData.relatedAnimes?.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-purple-400">Related Anime</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {animeData.relatedAnimes.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        </div>
      )}

      {/* Recommended Anime */}
      {animeData.recommendedAnimes?.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-purple-400">Recommended Anime</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {animeData.recommendedAnimes.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        </div>
      )}

      {/* Seasons */}
      {animeData.seasons?.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-purple-400">Seasons</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {animeData.seasons.map((season) => (
              <Link
                key={season.id}
                to={`/anime/${season.id}`}
                className={`block bg-gray-800 rounded-lg overflow-hidden ${
                  season.isCurrent ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                <img src={season.poster} alt={season.name} className="w-full h-48 object-cover" />
                <div className="p-3">
                  <h3 className="font-semibold text-sm">{season.title}</h3>
                  {season.isCurrent && (
                    <span className="text-xs text-purple-400 mt-1 block">Current Season</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimeDetails;