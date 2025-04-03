import React from 'react';

function Player({ selectedCommits }) {
  return (
    <div>
      <h2>Exhibited Commits</h2>
      {selectedCommits.length > 0 ? (
        <ul>
          {selectedCommits.map(commit => (
            <li key={commit.hash}>
              <strong>{commit.message}</strong><br />
              <em>{commit.author_name}</em> — {new Date(commit.date).toLocaleString()}
            </li>
          ))}
        </ul>
      ) : (
        <p>No commits selected.</p>
      )}
    </div>
  );
}

export default Player;
