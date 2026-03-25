````markdown
# 🧠 Codebase Explainer

<p align="center">
  <strong>Drop any GitHub repo URL. Get an instant AI-powered breakdown.</strong><br>
  Architecture • Tech Stack • Key Files • Interactive 3D Dependency Graph
</p>

<p align="center">
  <a href="#"><strong>🚀 Live Demo</strong></a> · 
  <a href="https://github.com/aatmxn/codebase-explainer"><strong>📂 Repository</strong></a>
</p>

---

## 🌟 Overview

**Codebase Explainer** is a full-stack AI developer tool designed to eliminate the "onboarding slog." It takes any public GitHub repository URL and produces a structured technical breakdown in seconds. 

By combining the **GitHub REST API**, **Groq's LLaMA inference**, and **D3.js**, it provides an instant mental model of unfamiliar codebases—without the need to clone files or trace dependencies manually.

---

## ⚙️ How It Works

```mermaid
graph TD
    %% Nodes
    Start([User pastes GitHub URL])
    API[Backend calls GitHub REST API]
    Fetch[Fetch File Tree + Contents]
    Groq[Groq AI LLaMA Analysis]
    Process[Identify Modules & Dependencies]
    Render[Frontend Renders Analysis]
    
    %% Flow
    Start --> API
    API --> Fetch
    Fetch --> Groq
    Groq --> Process
    Process --> Render

    %% Subgraph for UI Details
    subgraph UI_Output [Analysis Breakdown]
    Render --> Summary[Project Purpose & Summary]
    Render --> Tech[Tech Stack & Frameworks]
    Render --> Diagram[Interactive 3D D3.js Diagram]
    end

    %% Styling
    style Start fill:#f9f,stroke:#333,stroke-width:2px
    style Groq fill:#34d399,stroke:#065f46,color:#fff
    style UI_Output fill:#f1f5f9,stroke:#cbd5e1
````

-----

## ✨ Features

  * 🔗 **GitHub URL Input** – Zero setup; just paste any public repo link.
  * 🤖 **AI-Powered Summary** – Purpose and high-level structure explained by LLaMA.
  * 📦 **Tech Stack Detection** – Automatic identification of languages and frameworks.
  * 📁 **Key Files & Modules** – Highlights the most important files in the codebase.
  * 🕸️ **3D Architecture Diagram** – Interactive D3.js visualization of file dependencies.
  * ⚡ **Groq Inference** – Ultra-fast responses via hardware-accelerated API.

-----

## 💻 Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React.js | UI & component rendering |
| **Backend** | Node.js + Express.js | REST API server |
| **AI** | Groq API (LLaMA) | Repository analysis & summarization |
| **Visualization** | D3.js | Interactive 3D dependency graph |
| **Data Source** | GitHub REST API | Fetching repo tree & file contents |

-----

## 🚀 Getting Started

### 1\. Clone & Install

```bash
git clone [https://github.com/aatmxn/codebase-explainer.git](https://github.com/aatmxn/codebase-explainer.git)
cd codebase-explainer

# Install Backend dependencies
cd server && npm install

# Install Frontend dependencies
cd ../client && npm install
```

### 2\. Environment Setup

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
GROQ_API_KEY=your_groq_api_key
GITHUB_TOKEN=your_github_personal_access_token
```

### 3\. Run the Application

```bash
# Start backend (from /server)
npm start

# Start frontend (from /client)
npm run dev
```

> 💡 **Note:** Frontend runs on `http://localhost:5173` | Backend runs on `http://localhost:5000`

-----

## 🗂️ Project Structure

```text
codebase-explainer/
├── client/                 # React frontend (D3.js visualization)
│   ├── src/
│   │   ├── components/     # UI components
│   │   └── pages/          # Analysis views
├── server/                 # Node.js + Express backend
│   ├── index.js            # Entry point
│   └── routes/             # API route handlers
└── README.md
```

-----

## 📜 License

This project is licensed under the **MIT License**.

\<p align="center"\>
Built with ⚡ \<strong\>Groq · React · Node.js · D3.js\</strong\>
\</p\>

```
