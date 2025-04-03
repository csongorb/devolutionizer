import React from 'react';
import { motion } from 'framer-motion';

function Editor({ commits, selectedHashes, onSelectHashes }) {
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

  return (
    <div className="px-4 py-6">
      <h2 className="text-2xl font-bold text-center mb-6">🧠 Select Commits to Exhibit</h2>

      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={selectAll}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 shadow transition"
        >
          Select All
        </button>
        <button
          onClick={clearAll}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 shadow transition"
        >
          Clear All
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {commits.map((commit) => (
          <motion.div
            key={commit.hash}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg shadow hover:shadow-lg transition"
          >
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={selectedHashes.includes(commit.hash)}
                onChange={() => toggleCommit(commit.hash)}
                className="mt-1 h-5 w-5 text-blue-600"
              />
              <div>
                <p className="font-semibold text-gray-800 dark:text-white">{commit.message}</p>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  {commit.author_name} — {new Date(commit.date).toLocaleString()}
                </p>
              </div>
            </label>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Editor;
