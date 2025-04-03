const express = require('express');
const cors = require('cors');
const simpleGit = require('simple-git');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const app = express();
const PORT = 3001;

// 🔗 Path to your Git repo
const git = simpleGit('C:/Users/admin/repotest/itisasifyouweremakinglove');

app.use(cors());
app.use(express.json());

// ✅ Route: Get commits with changed files
app.get('/commits', async (req, res) => {
  try {
    const log = await git.log();

    const commitsWithFiles = await Promise.all(
      log.all.map(async (commit) => {
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

// ✅ Route: Serve raw file (e.g. PNG)
app.get('/raw/:hash/*', async (req, res) => {
  const { hash } = req.params;
  const filePath = req.params[0];
  const outputPath = path.join(__dirname, 'temp', hash);
  const fullFilePath = path.join(outputPath, filePath);

  try {
    if (!fs.existsSync(fullFilePath)) {
      fs.mkdirSync(outputPath, { recursive: true });
      execSync(`git archive ${hash} | tar -x -C "${outputPath}"`, {
        cwd: 'C:/Users/admin/repotest/itisasifyouweremakinglove',
      });
    }

    res.sendFile(fullFilePath);
  } catch (error) {
    console.error('❌ Error sending raw file:', error);
    res.status(500).send('Failed to serve file');
  }
});

// ✅ Route: Serve text file content
app.get('/file/:hash/*', async (req, res) => {
  const { hash } = req.params;
  const filePath = req.params[0];

  try {
    const fileContent = await git.show(`${hash}:${filePath}`);
    res.send(fileContent);
  } catch (error) {
    console.error('❌ Failed to load file:', error.message);
    res.status(500).send('Failed to load file.');
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
