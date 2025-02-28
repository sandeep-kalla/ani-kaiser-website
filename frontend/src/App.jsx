import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import AnimeDetails from './pages/AnimeDetails';
import WatchEpisode from './pages/WatchEpisode';
import AZList from './pages/AZList';
import Genre from './pages/Genre';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-900 overflow-x-hidden">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/anime/:animeId" element={<AnimeDetails />} />
            <Route path="/watch/:animeId/:episodeId" element={<WatchEpisode />} />
            <Route path="/az-list" element={<AZList />} />
            <Route path="/genre/:genreName" element={<Genre />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
