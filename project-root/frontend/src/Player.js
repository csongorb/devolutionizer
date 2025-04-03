import React, { useState } from 'react';
import { motion } from 'framer-motion';

function Player({ selectedCommits }) {
  const [previewMap, setPreviewMap] = useState({}); // store previews by commit+file

  const fetchFile = async (hash, filepath) => {
    const key = `${hash}:${filepath}`;

    // If already open, close it
    if (previewMap[key]) {
      setPreviewMap((prev) => {
        const newMap = { ...prev };
        delete newMap[key];
        return newMap;
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/file/${hash}/${filepath}`);
      const text = await response.text();
      setPreviewMap((prev) => ({ ...prev, [key]: { name: filepath, content: text } }));
    } catch (error) {
      alert('❌ Error loading file: ' + error.message);
    }
  };

  return (
    <div className="px-4 py-6">
      <h2 className="text-2xl font-bold text-center mb-6">🎬 Exhibited Commits</h2>

      {selectedCommits.length > 0 ? (
        <div className="space-y-6">
          {selectedCommits.map((commit) => (
            <motion.div
              key={commit.hash}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-700 border border-blue-200 dark:border-gray-600 p-4 rounded-lg shadow-md"
            >
              <p className="text-lg font-semibold text-gray-800 dark:text-white">{commit.message}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                {commit.author_name} — {new Date(commit.date).toLocaleString()}
              </p>

              {commit.files && commit.files.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">📂 Changed Files:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    {commit.files.map((file, index) => {
                      const key = `${commit.hash}:${file}`;
                      const preview = previewMap[key];

                      return (
                        <li key={index}>
                          <div className="flex justify-between items-center">
                            <span>{file}</span>
                            {/\.(js|md|txt|html|json)$/i.test(file) && (
                              <button
                                onClick={() => fetchFile(commit.hash, file)}
                                className="ml-2 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                              >
                                {preview ? 'Hide' : 'View'}
                              </button>
                            )}
                          </div>

                          {/* Inline preview just under file */}
                          {preview && (
                            <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded text-sm text-gray-800 dark:text-gray-200">
                              <h4 className="font-bold mb-1">{preview.name}</h4>
                              <pre className="whitespace-pre-wrap max-h-64 overflow-auto">
                                {preview.content}
                              </pre>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-12 text-lg">
          No commits selected. 💔
        </p>
      )}
    </div>
  );
}

export default Player;
