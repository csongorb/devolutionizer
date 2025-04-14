const express = require('express');
const cors = require('cors');
const simpleGit = require('simple-git');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const app = express();
const PORT = 3001;

const REPO_PATH = 'C:/Users/admin/repotest/itisasifyouweremakinglove';
const TEMP_DIR = path.join(__dirname, 'temp');
const VERSIONS_PATH = path.join(__dirname, '..', 'frontend', 'public', 'versions.json');

const git = simpleGit(REPO_PATH);

app.use(cors());
app.use(express.json());
app.use('/preview', express.static(TEMP_DIR));

// Serve versions.json
app.get('/versions.json', (req, res) => {
  fs.readFile(VERSIONS_PATH, 'utf8', (err, data) => {
    if (err) {
      console.error('❌ Failed to read versions.json:', err);
      return res.status(500).json({ error: 'Failed to read versions' });
    }
    res.type('application/json').send(data);
  });
});

// Save versions.json
app.put('/versions.json', (req, res) => {
  console.log('📝 Saving version to:', VERSIONS_PATH);
  console.log('📦 Body:', req.body);

  fs.writeFile(VERSIONS_PATH, JSON.stringify(req.body, null, 2), (err) => {
    if (err) {
      console.error('❌ Failed to write versions.json:', err);
      return res.status(500).json({ error: 'Failed to save versions' });
    }
    res.json({ success: true });
  });
});

// Get commits with files
app.get('/commits', async (req, res) => {
  try {
    const log = await git.log({ multiLine: true });
    const commitsWithFiles = await Promise.all(
      log.all.map(async (commit) => {
        const fileOutput = await git.raw(['show', '--pretty=format:', '--name-only', commit.hash]);
        const files = fileOutput
          .split('\n')
          .map(f => f.trim())
          .filter(f => f.length > 0);
        return {
          hash: commit.hash,
          message: commit.body ? `${commit.message}\n${commit.body}` : commit.message,
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

// Serve raw files (e.g. PNG)
app.get('/raw/:hash/*', async (req, res) => {
  const { hash } = req.params;
  const filePath = req.params[0];
  const outputPath = path.join(TEMP_DIR, hash);
  const fullFilePath = path.join(outputPath, filePath);

  try {
    if (!fs.existsSync(fullFilePath)) {
      fs.mkdirSync(outputPath, { recursive: true });
      execSync(`git archive ${hash} | tar -x -C "${outputPath}"`, { cwd: REPO_PATH });
    }
    res.sendFile(fullFilePath);
  } catch (error) {
    console.error('❌ Error sending raw file:', error);
    res.status(500).send('Failed to serve file');
  }
});

// Serve text content (e.g. .md, .txt)
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

// Ensure HTML preview loads from correct snapshot
app.get('/preview/:hash/*', async (req, res) => {
  const { hash } = req.params;
  const filePath = req.params[0];
  const outputPath = path.join(TEMP_DIR, hash);
  const fullFilePath = path.join(outputPath, filePath);

  try {
    if (!fs.existsSync(fullFilePath)) {
      fs.mkdirSync(outputPath, { recursive: true });
      execSync(`git archive ${hash} | tar -x -C "${outputPath}"`, { cwd: REPO_PATH });
    }

    if (!fs.existsSync(fullFilePath)) {
      return res.status(404).send('File not found in this version.');
    }

    res.sendFile(fullFilePath);
  } catch (error) {
    console.error('❌ Error serving HTML file:', error.message);
    res.status(500).send('Failed to serve preview file.');
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
