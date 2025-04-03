import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Commits() {
  const [commits, setCommits] = useState([]);

  useEffect(() => {
    axios.get('/commits') // or 'http://localhost:3001/commits' if no proxy
      .then(response => {
        setCommits(response.data);
      })
      .catch(error => {
        console.error('Error fetching commits:', error);
      });
  }, []);

  return (
    <div>
      <h2>Commits</h2>
      <ul>
        {commits.map(commit => (
          <li key={commit.hash}>
            <strong>{commit.message}</strong><br />
            <em>{commit.author_name}</em> — {new Date(commit.date).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Commits;
