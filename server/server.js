const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:5173",
  origin: "https://codebase-explainer.vercel.app",
}));
app.use(express.json());

const ALLOWED_EXTENSIONS = [".js", ".jsx", ".ts", ".tsx", ".py", ".java", ".c", ".cpp", ".md"];
const IGNORED_FOLDERS = ["node_modules", "dist", "build", ".git"];
const MAX_FILES = 50;
const MAX_FILE_CHARS = 1000;

// ─── Groq Helper (with rate limit retry) ────────────────────────────────────

async function callGroq(prompt) {
  const response = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }]
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
}

// ─── GitHub Route ─────────────────────────────────────────────────────────────

app.post('/api/github', async (req, res) => {
  const { url } = req.body;

  if (!url) return res.status(400).json({ error: "GitHub URL is required" });

  const parts = url.split("/");
  const owner = parts[3];
  const repo = parts[4];

  if (!owner || !repo) return res.status(400).json({ error: "Invalid GitHub repository URL" });

  try {
    const headers = {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json"
    };

    const repoInfo = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}`,
      { headers }
    );

    const defaultBranch = repoInfo.data.default_branch;

    const treeResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`,
      { headers }
    );

    const filteredPaths = treeResponse.data.tree
      .filter(item => item.type === "blob")
      .map(item => item.path)
      .filter(path =>
        ALLOWED_EXTENSIONS.some(ext => path.endsWith(ext)) &&
        !IGNORED_FOLDERS.some(folder => path.includes(folder))
      )
      .slice(0, MAX_FILES);

    const filesWithContent = await Promise.all(
      filteredPaths.map(async (path) => {
        const fileResponse = await axios.get(
          `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
          { headers }
        );
        const content = Buffer.from(fileResponse.data.content, "base64").toString("utf-8");
        return { path, content: content.slice(0, MAX_FILE_CHARS) };
      })
    );

    res.json({ repo: `${owner}/${repo}`, files: filesWithContent });

  } catch (error) {
    console.error(error.message);
    console.error(error.response?.data);
    res.status(500).json({ error: "Failed to fetch repository files" });
  }
});

// ─── Gemini Analyze Route ─────────────────────────────────────────────────────

app.post('/api/analyze', async (req, res) => {
  console.log("Analyze route hit");

  const { files } = req.body;

  if (!files || !Array.isArray(files)) {
    return res.status(400).json({ error: "Files array is required" });
  }

  try {
    const codebaseText = files
      .map(f => `### ${f.path}\n${f.content}`)
      .join("\n\n");

    const prompt = `You are a strict JSON API.
Analyze the following software codebase and return structured JSON.

CRITICAL RULES:
1. Output ONLY valid JSON
2. Do NOT include markdown or explanations
3. Do NOT include backticks
4. All keys must exist even if empty
5. List ALL technologies detected across ALL files. Include languages, frameworks, and libraries. Do not miss any.

JSON SCHEMA:
{
  "project_summary": "A detailed 3-4 sentence explanation of what this project is, written simply so a non-technical person can understand it.",
"main_purpose": "A clear 2-3 sentence explanation of the problem this project solves and who it is for, in plain English.",
  "technologies": ["string"],
  "key_files": [{ "path": "string", "description": "string" }],
  "modules": [{ "name": "string", "description": "string", "files": ["string"] }],
  "dependencies": [{ "from": "string", "to": "string", "type": "import | function_call | module_dependency" }]
}

CODEBASE FILES:
${codebaseText}

Return ONLY JSON.`;

    const groqData = await callGroq(prompt);
    const rawText = groqData.choices[0].message.content;

    const jsonStart = rawText.indexOf("{");
    const jsonEnd = rawText.lastIndexOf("}") + 1;
    const analysis = JSON.parse(rawText.slice(jsonStart, jsonEnd));

    res.json({ analysis });

  } catch (error) {
    console.error(error.response?.data);
    res.status(500).json({ error: "Failed to analyze codebase" });
  }
});

// ─── Start Server ─────────────────────────────────────────────────────────────

app.listen(port, () => console.log(`Server running on port ${port}`));