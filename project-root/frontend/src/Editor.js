import React, { useState, useEffect } from 'react';

function Editor({ commits, onSelectCommits }) {
  const [selected, setSelected] = useState([]);

  const toggleCommit = (commit) => {
    const isSelected = selected.includes(commit);

    const updated = isSelected
      ? selected.filter(c => c !== commit)
      : [...selected, commit];

    setSelected(updated);
  };

  const selectAll = () => {
    setSelected(commits);
  };

  const clearAll = () => {
    setSelected([]);
  };

  // Whenever selected changes, inform App.js
  useEffect(() => {
    onSelectCommits(selected);
  }, [selected]);

  return (
    <div>
      <h2>Select Commits to Exhibit</h2>

      <button onClick={selectAll}>Select All</button>
      <button onClick={clearAll} style={{ marginLeft: '10px' }}>Clear All</button>

      <ul>
        {commits.map(commit => (
          <li key={commit.hash}>
            <label>
              <input
                type="checkbox"
                checked={selected.includes(commit)}
                onChange={() => toggleCommit(commit)}
              />
              <strong>{commit.message}</strong> by {commit.author_name}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Editor;
