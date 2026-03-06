const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Route
app.post('/api/github', async (req, res) => {
  const url = req.body.url;

  // Validate input
  if (!url) {
    return res.status(400).json({ error: "GitHub URL is required" });
  }

  const parts = url.split("/");

  const owner = parts[3];
  const repo = parts[4];

  const githubApiUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`;

  try {
    const response = await axios.get(githubApiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
      }
    });

    // Keep only files
    const files = response.data.tree.filter(item => item.type === "blob");

    // Extract only file paths
    const filePaths = files.map(file => file.path);

    res.json(filePaths);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});