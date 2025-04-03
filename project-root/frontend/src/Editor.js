import React from 'react';

function Editor({ commits, selectedHashes, onSelectHashes }) {
  const toggleCommit = (hash) => {
    const isSelected = selectedHashes.includes(hash);
    const updated = isSelected
      ? selectedHashes.filter(h => h !== hash)
      : [...selectedHashes, hash];

    onSelectHashes(updated);
  };

  const selectAll = () => {
    const allHashes = commits.map(commit => commit.hash);
    onSelectHashes(allHashes);
  };

  const clearAll = () => {
    onSelectHashes([]);
  };

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
                checked={selectedHashes.includes(commit.hash)}
                onChange={() => toggleCommit(commit.hash)}
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
