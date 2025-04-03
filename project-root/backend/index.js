const express = require('express');
const cors = require('cors');
const simpleGit = require('simple-git');

const app = express();
const PORT = 3001;
const git = simpleGit('C:/Users/admin/repotest/itisasifyouweremakinglove'); // YOUR repo path

app.use(cors());

app.get('/commits', async (req, res) => {
  try {
    const log = await git.log();
    const commits = log.all.map(commit => ({
      hash: commit.hash,
      message: commit.message,
      author_name: commit.author_name,
      date: commit.date
    }));
    res.json(commits);
  } catch (err) {
    console.error('Error fetching commits:', err);
    res.status(500).json({ error: 'Failed to fetch commits' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
