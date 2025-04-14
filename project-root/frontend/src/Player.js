
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function Player({ allCommits }) {
  const [previewMap, setPreviewMap] = useState({});
  const [versions, setVersions] = useState({});
  const [selectedVersion, setSelectedVersion] = useState('');

  useEffect(() => {
    fetch('/versions.json')
      .then(res => res.json())
      .then(data => {
        setVersions(data);
        const firstVersion = Object.keys(data)[0];
        setSelectedVersion(firstVersion);
      })
      .catch(err => console.error('Failed to load versions.json:', err));
  }, []);

  const fetchTextFile = async (hash, filepath) => {
    const key = `${hash}:${filepath}`;
    if (previewMap[key]) {
      setPreviewMap(prev => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
      return;
    }
    try {
      const response = await fetch(`http://localhost:3001/file/${hash}/${filepath}`);
      const text = await response.text();
      setPreviewMap(prev => ({
        ...prev,
        [key]: { type: 'text', name: filepath, content: text }
      }));
    } catch (error) {
      alert('Error loading file: ' + error.message);
    }
  };

  const showImage = (hash, filepath) => {
    const key = `${hash}:${filepath}`;
    if (previewMap[key]) {
      setPreviewMap(prev => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
      return;
    }
    setPreviewMap(prev => ({
      ...prev,
      [key]: {
        type: 'image',
        name: filepath,
        src: `http://localhost:3001/raw/${hash}/${filepath}`,
      }
    }));
  };

  const commitsToShow = allCommits.filter(c =>
    versions[selectedVersion]?.includes(c.hash)
  );

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <aside className="w-64 p-6 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <h2 className="text-xl font-bold mb-4">📁 Versions</h2>
        <select
          className="w-full px-2 py-2 rounded border dark:bg-gray-700 dark:text-white"
          value={selectedVersion}
          onChange={(e) => setSelectedVersion(e.target.value)}
        >
          {Object.keys(versions).map(version => (
            <option key={version} value={version}>{version}</option>
          ))}
        </select>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">🎬 Exhibited Commits</h2>

        {commitsToShow.length > 0 ? (
          <div className="space-y-6">
            {commitsToShow.map((commit) => (
              <motion.div
                key={commit.hash}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-700 border border-blue-200 dark:border-gray-600 p-4 rounded-lg shadow-md"
              >
                <div className="mb-2">
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">
                    {commit.message.split('\n')[0]}
                  </p>
                  {commit.message.split('\n')[1] && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap mt-1">
                      {commit.message.split('\n').slice(1).join('\n')}
                    </p>
                  )}
                </div>
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
                        const isText = /\.(js|md|txt|html|json)$/i.test(file);
                        const isImage = /\.(png|jpg|jpeg|gif)$/i.test(file);
                        const isLaunchable = /\.html$/i.test(file);

                        return (
                          <li key={index}>
                            <div className="flex justify-between items-center">
                              <span>{file}</span>
                              <div className="flex gap-2">
                                {isText && (
                                  <button
                                    onClick={() => fetchTextFile(commit.hash, file)}
                                    className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                  >
                                    {preview ? 'Hide' : 'View'}
                                  </button>
                                )}
                                {isImage && (
                                  <button
                                    onClick={() => showImage(commit.hash, file)}
                                    className="px-2 py-1 text-xs bg-pink-500 text-white rounded hover:bg-pink-600 transition"
                                  >
                                    {preview ? 'Hide' : 'View Image'}
                                  </button>
                                )}
                                {isLaunchable && (
                                  <a
                                    href={`http://localhost:3001/preview/${commit.hash}/${file}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition"
                                  >
                                    Launch 🚀
                                  </a>
                                )}
                              </div>
                            </div>

                            {preview && (
                              <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded text-sm text-gray-800 dark:text-gray-200">
                                <h4 className="font-bold mb-1">{preview.name}</h4>
                                {preview.type === 'image' ? (
                                  <div className="w-full max-w-3xl max-h-[400px] overflow-auto rounded border bg-white dark:bg-black p-2">
                                    <img
                                      src={preview.src}
                                      alt={preview.name}
                                      className="w-full h-auto object-contain"
                                      style={{ maxHeight: '400px' }}
                                    />
                                  </div>
                                ) : (
                                  <pre className="whitespace-pre-wrap max-h-64 overflow-auto">
                                    {preview.content}
                                  </pre>
                                )}
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
            No commits selected for version <strong>{selectedVersion}</strong>. 💔
          </p>
        )}
      </main>
    </div>
  );
}

export default Player;
