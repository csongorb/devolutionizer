import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Editor from './Editor';
import Player from './Player';

function App() {
  const [commits, setCommits] = useState([]);
  const [selectedCommits, setSelectedCommits] = useState([]);

  useEffect(() => {
    // Fetch commits from the backend
    axios.get('http://localhost:3001/commits')

      .then((response) => setCommits(response.data))
      .catch((error) => console.error('Error fetching commits:', error));
  }, []);

  const handleSelectCommits = (selected) => {
    setSelectedCommits(selected);
  };

  return (
    <div>
      <h1>Devolutionizer</h1>
      <Editor commits={commits} onSelectCommits={handleSelectCommits} />
      <Player selectedCommits={selectedCommits} />
    </div>
  );
}

export default App;
