import React, { useEffect, useState } from 'react';

function Editor({ commits, selectedHashes, onSelectHashes }) {
  const [versions, setVersions] = useState({});

  // Load versions from backend
  useEffect(() => {
    fetch('/versions.json')
      .then((res) => res.json())
      .then((data) => setVersions(data))
      .catch((err) => {
        console.error('❌ Failed to load versions.json:', err);
        setVersions({});
      });
  }, []);

  const toggleCommit = (hash) => {
    const updated = selectedHashes.includes(hash)
      ? selectedHashes.filter((h) => h !== hash)
      : [...selectedHashes, hash];

    onSelectHashes(updated);
  };

  const selectAll = () => {
    onSelectHashes(commits.map((c) => c.hash));
  };

  const clearAll = () => {
    onSelectHashes([]);
  };

  const saveVersion = async () => {
    const name = prompt("Enter version name:");
    if (!name) return;

    const newVersion = {
      ...versions,
      [name]: selectedHashes,
    };

    try {
      const res = await fetch('/versions.json', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVersion),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ Save failed:', errorText);
        alert("Save failed: " + errorText);
        return;
      }

      console.log('✅ Save successful!');
      setVersions(newVersion);
    } catch (err) {
      console.error('💥 Network or parsing error:', err);
      alert("Save failed: " + err.message);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">🛠 Editor: Select Commits to Exhibit</h2>
      <div className="flex gap-3">
        <button onClick={selectAll} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition">Select All</button>
        <button onClick={clearAll} className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 transition">Clear All</button>
        <button onClick={saveVersion} className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition">💾 Save as Version</button>
      </div>

      <ul className="space-y-2">
        {commits.map((commit) => (
          <li key={commit.hash} className="border-b border-gray-300 pb-2">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedHashes.includes(commit.hash)}
                onChange={() => toggleCommit(commit.hash)}
                className="mt-1"
              />
              <div>
                <div className="font-semibold">{commit.message.split('\n')[0]}</div>
                <div className="text-sm text-gray-600">{commit.author_name} — {new Date(commit.date).toLocaleString()}</div>
              </div>
            </label>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <h3 className="text-lg font-semibold">📦 Saved Versions</h3>
        <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
          {Object.keys(versions).length > 0 ? (
            Object.entries(versions).map(([name, hashes]) => (
              <li key={name}>
                <strong>{name}</strong>: {hashes.length} commits
              </li>
            ))
          ) : (
            <li>No versions saved.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Editor;
