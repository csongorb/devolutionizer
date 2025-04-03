import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from 'react-router-dom';
import Editor from './Editor';
import Player from './Player';

// Wrap app in a component that lets us use useLocation
function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const location = useLocation();
  const isPlayerPage = location.pathname === '/player';

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  const [selectedHashes, setSelectedHashes] = useState(() => {
    const saved = localStorage.getItem('selectedCommits');
    return saved ? JSON.parse(saved) : [];
  });

  const [commits, setCommits] = useState([]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    axios
      .get('http://localhost:3001/commits')
      .then((res) => setCommits(res.data))
      .catch((err) => console.error('❌ Error fetching commits:', err));
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedCommits', JSON.stringify(selectedHashes));
  }, [selectedHashes]);

  const handleSelectHashes = (newHashes) => {
    setSelectedHashes(newHashes);
  };

  const selectedCommits = commits.filter((c) =>
    selectedHashes.includes(c.hash)
  );

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
      {/* 🌙 Dark Mode Toggle */}
      <div className="flex justify-end p-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 rounded bg-gray-800 text-white dark:bg-white dark:text-gray-900 shadow hover:scale-105 transition"
        >
          {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4 text-center">💿 Devolutionizer</h1>

        {/* Only show Editor link if NOT in /player */}
        <nav className="flex justify-center space-x-6 mb-8">
          {!isPlayerPage && (
            <Link to="/editor" className="text-blue-500 hover:underline">
              Editor
            </Link>
          )}
          <Link to="/player" className="text-blue-500 hover:underline">
            Player
          </Link>
        </nav>

        <Routes>
          <Route
            path="/editor"
            element={
              <Editor
                commits={commits}
                selectedHashes={selectedHashes}
                onSelectHashes={handleSelectHashes}
              />
            }
          />
          <Route
            path="/player"
            element={<Player selectedCommits={selectedCommits} />}
          />
          <Route
            path="/"
            element={<p className="text-center">Welcome! Choose Editor or Player above 💌</p>}
          />
        </Routes>
      </div>
    </div>
  );
}

export default AppWrapper;
