
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Editor from './Editor';
import Player from './Player';

function App() {
  const [commits, setCommits] = useState([]);
  const [selectedHashes, setSelectedHashes] = useState(() => {
    const saved = localStorage.getItem('selectedCommits');
    return saved ? JSON.parse(saved) : [];
  });

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    axios.get('http://localhost:3001/commits')
      .then(res => {
        setCommits(res.data);
      })
      .catch(err => {
        console.error('❌ Error fetching commits:', err);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedCommits', JSON.stringify(selectedHashes));
  }, [selectedHashes]);

  const handleSelectHashes = (newHashes) => {
    setSelectedHashes(newHashes);
  };

  return (
    <Router>
      <div className="flex justify-end mb-4 p-2">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-sm px-3 py-1 bg-gray-800 text-white dark:bg-white dark:text-gray-800 rounded shadow hover:scale-105 transition"
        >
          {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Devolutionizer</h1>
        <nav className="space-x-4 mb-6">
          <Link to="/editor" className="text-blue-500 hover:underline">Editor</Link>
          <Link to="/player" className="text-blue-500 hover:underline">Player</Link>
        </nav>
        <Routes>
          <Route path="/editor" element={
            <Editor
              commits={commits}
              selectedHashes={selectedHashes}
              onSelectHashes={handleSelectHashes}
            />
          } />
          <Route path="/player" element={
            <Player allCommits={commits} />
          } />
          <Route path="/" element={<p>Welcome! Choose Editor or Player above.</p>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
