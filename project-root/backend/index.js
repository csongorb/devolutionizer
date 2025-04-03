const express = require('express');
const cors = require('cors');
const simpleGit = require('simple-git');

const app = express();
const PORT = 3001;

// path to your repo
const git = simpleGit('C:/Users/admin/repotest/itisasifyouweremakinglove');

app.use(cors());
app.use(express.json());

app.get('/commits', async (req, res) => {
  try {
    const log = await git.log();

    const commitsWithFiles = await Promise.all(
      log.all.map(async (commit) => {
        // Get changed files only (no commit message)
        const fileOutput = await git.raw([
          'show',
          '--pretty=format:',
          '--name-only',
          commit.hash,
        ]);

        const files = fileOutput
          .split('\n')
          .map(f => f.trim())
          .filter(f => f.length > 0);
          const path = require('path');

          app.get('/file/:hash/*', async (req, res) => {
            const { hash } = req.params;
            const filePath = req.params[0]; // wildcard path
          
            try {
              const fileContent = await git.show(`${hash}:${filePath}`);
              res.send(fileContent);
            } catch (error) {
              console.error('❌ Failed to load file:', error.message);
              res.status(500).send('Failed to load file.');
            }
          });
          


        return {
          hash: commit.hash,
          message: commit.message,
          author_name: commit.author_name,
          date: commit.date,
          files: files,
        };
      })
    );

    res.json(commitsWithFiles);
  } catch (error) {
    console.error('❌ Error fetching commits:', error);
    res.status(500).json({ error: 'Failed to get commits' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
