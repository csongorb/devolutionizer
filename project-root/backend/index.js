const express = require('express');
const cors = require('cors');
const simpleGit = require('simple-git');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// 🟡 Path to your local Git repository
const repoPath = path.resolve('C:/Users/admin/repotest/itisasifyouweremakinglove');
const git = simpleGit(repoPath);

// ✅ Endpoint to get real commits from your repo
app.get('/commits', async (req, res) => {
  try {
    const log = await git.log();
    res.json(log.all); // send all commits
  } catch (err) {
    console.error('Error fetching commits:', err);
    res.status(500).json({ error: 'Failed to get commits' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
