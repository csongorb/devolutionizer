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

  useEffect(() => {
    axios.get('http://localhost:3001/commits')
      .then(res => setCommits(res.data))
      .catch(err => console.error('Error fetching commits:', err));
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedCommits', JSON.stringify(selectedHashes));
  }, [selectedHashes]);

  const handleSelectHashes = (newHashes) => {
    setSelectedHashes(newHashes);
  };

  const selectedCommits = commits.filter(c => selectedHashes.includes(c.hash));

  return (
    <Router>
      <div style={{ padding: '1rem' }}>
        <h1>Devolutionizer</h1>
        <nav>
          <Link to="/editor">Editor</Link> | <Link to="/player">Player</Link>
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
            element={<p>Welcome! Choose Editor or Player above.</p>}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
