import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Editor from './Editor';
import Player from './Player';

function App() {
  const [commits, setCommits] = useState([]);
  const [selectedHashes, setSelectedHashes] = useState(() => {
    // Initialize state from localStorage
    const savedHashes = localStorage.getItem('selectedCommits');
    return savedHashes ? JSON.parse(savedHashes) : [];
  });

  // Fetch commits from the backend
  useEffect(() => {
    axios.get('http://localhost:3001/commits')
      .then((response) => {
        setCommits(response.data);
      })
      .catch((error) => console.error('Error fetching commits:', error));
  }, []);

  // Save selected hashes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('selectedCommits', JSON.stringify(selectedHashes));
  }, [selectedHashes]);

  const handleSelectHashes = (newHashes) => {
    setSelectedHashes(newHashes);
  };

  const selectedCommits = commits.filter(commit => selectedHashes.includes(commit.hash));

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Devolutionizer</h1>
      <Editor
        commits={commits}
        selectedHashes={selectedHashes}
        onSelectHashes={handleSelectHashes}
      />
      <Player selectedCommits={selectedCommits} />
    </div>
  );
}

export default App;
