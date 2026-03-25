<h1 align="center"> Codebase Explainer </h1>

<p align="center">
  <strong>Drop any GitHub repo URL. Get an instant AI-powered breakdown.</strong><br>
  Summary, Main Purpose, Architecture, Tech Stack, Key Files, Interactive 3D Dependency Graph
</p>

<p align="center">
  <a href="https://codebase-explainer.vercel.app/"><strong>🚀 Live Demo</strong></a> · 
  <a href="https://github.com/aatmxn/codebase-explainer"><strong>📂 Repository</strong></a>
</p>  


## 📌 Table of Contents

- [🚀 Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack & Architecture](#-tech-stack--architecture)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [🔧 Usage](#-usage)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)

---

## 🚀 Overview

**Codebase Explainer** is a full-stack AI developer tool designed to eliminate the "onboarding slog." It takes any public GitHub repository URL and produces a structured technical breakdown in seconds. 

By combining the **GitHub REST API**, **Groq's LLaMA inference**, and **D3.js**, it provides an instant mental model of unfamiliar codebases—without the need to clone files or trace dependencies manually.

### 💡 The Problem
> Understanding a new or large-scale codebase is one of the most significant "time-sinks" in modern software engineering. Developers often spend days "code-spelunking"—manually tracing dependencies, identifying core components, and trying to visualize the relationship between disparate modules. Existing documentation is frequently outdated, incomplete, or entirely missing, leading to increased cognitive load, slower feature delivery, and high barriers to entry for new contributors.

### ✅ The Solution
**Codebase Explainer** eliminates the manual labor associated with repository discovery. By providing an automated analysis pipeline, the platform allows users to submit a GitHub repository and receive a comprehensive breakdown of its structure and logic. Through the use of interactive dependency graphs and even immersive 3D visualizations, the tool provides a multi-dimensional view of software architecture. It doesn't just list files; it explains the "connective tissue" of the project, turning hours of manual research into seconds of automated insight.

### 🏗️ Architecture Overview
The system is built on a modern, decoupled architecture designed for performance and scalability:
*   **Frontend:** A React-based Single Page Application (SPA) utilizing Vite for lightning-fast builds and an atomic component structure for a highly responsive user experience.
*   **Backend:** A RESTful Express.js server that handles the heavy lifting of repository communication and data analysis.
*   **Communication:** Secure, promise-based data fetching via Axios, ensuring seamless integration between the user interface and the analysis engine.

---

## ✨ Key Features

🔗 GitHub URL Input — Paste any public repo link, zero setup required
🤖 AI-Powered Summary — Groq LLaMA analyzes and explains project purpose and structure
📦 Tech Stack Detection — Auto-identifies languages, frameworks, and libraries
📁 Key Files & Modules — Highlights the most important files in the codebase
🔗 Dependency Mapping — Surfaces project dependencies extracted from package manifests
🕸️ 3D Architecture Diagram — Interactive D3.js visualization of the file/folder dependency graph
⚡ Groq Inference — Ultra-fast LLM responses via Groq's hardware-accelerated API

---

## 🛠️ Tech Stack & Architecture

The project utilizes a curated selection of industry-standard technologies chosen for their reliability, developer experience, and performance characteristics.

| Technology | Purpose |
| :--- | :--- |
| **React** | Component-based UI for a reactive analysis interface. |
| **Groq AI** | Ultra-fast LLaMA 3 inference for codebase summarization. |
| **Node/Express** | Backend server handling GitHub API and Groq communication. |
| **D3.js** | Interactive 3D/2D dependency graph visualization. |
| **Axios** | Secure, promise-based data fetching. |

---

## 📁 Project Structure

The repository follows a clean separation of concerns, splitting the application into a `client` (frontend) and a `server` (backend). This structure supports independent scaling and deployment of the two primary layers.

```
aatmxn-codebase-explainer/
├── 📁 client/                       # Frontend React Application
│   ├── 📁 public/                   # Static assets (icons, manifest)
│   │   └── 📄 vite.svg              # Vite branding asset
│   ├── 📁 src/                      # Source code
│   │   ├── 📁 assets/               # Local assets and images
│   │   │   └── 📄 react.svg         # React branding asset
│   │   ├── 📁 components/           # Reusable UI components
│   │   │   ├── 📁 3d/               # 3D Visualization engine
│   │   │   │   ├── 📄 CameraRig.jsx # 3D view controls
│   │   │   │   ├── 📄 FloatingCubes.jsx # Visual 3D elements
│   │   │   │   └── 📄 Scene.jsx     # Main 3D environment container
│   │   │   ├── 📁 ui/               # Core UI presentation components
│   │   │   │   ├── 📄 CTASection.jsx # Call-to-action component
│   │   │   │   ├── 📄 Features.jsx  # Feature showcase component
│   │   │   │   ├── 📄 HeroOverlay.jsx # Landing page hero
│   │   │   │   └── 📄 HowItWorks.jsx # User onboarding guide
│   │   │   ├── 📄 Dashboard.jsx     # User command center
│   │   │   └── 📄 DependencyGraph.jsx # Visual code relationship mapper
│   │   ├── 📄 App.css               # Global component styles
│   │   ├── 📄 App.jsx               # Main application routing/logic
│   │   ├── 📄 index.css             # Base CSS and resets
│   │   └── 📄 main.jsx              # React entry point
│   ├── 📄 eslint.config.js          # Linting configuration
│   ├── 📄 index.html                # HTML template
│   ├── 📄 package.json              # Client-side dependencies
│   └── 📄 vite.config.js            # Vite build configuration
├── 📁 server/                       # Backend Express Application
│   ├── 📄 server.js                 # Main server entry and API routes
│   ├── 📄 package.json              # Server-side dependencies
│   └── 📄 .gitignore                # Server-specific ignore rules
└── 📄 README.md                     # Project documentation
```

---

## 🚀 Getting Started

To get a local instance of the **Codebase Explainer** up and running, follow these steps. This project assumes you have Node.js installed on your machine.

### Prerequisites

*   **Node.js:** Ensure you have the latest LTS version installed.
*   **Package Manager:** You can use `npm` (included with Node).

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/aatmxn/codebase-explainer.git
    cd codebase-explainer
    ```

2.  **Setup the Backend Server**
    ```bash
    cd server
    npm install
    ```
    *Note: The server requires a `.env` file for configuration, GROQ_API_KEY=your_groq_api_key
GITHUB_TOKEN=your_github_personal_access_token
PORT=5000*

3.  **Setup the Client Frontend**
    Open a new terminal window:
    ```bash
    cd client
    npm install
    ```

4.  **Running the Application**
    *   **Start Backend:** Inside the `server` directory, run your start command (e.g., `node server.js`).
    *   **Start Frontend:** Inside the `client` directory, run `npm run dev` (assuming standard Vite scripts).

---

## 🔧 Usage

The **codebase explainer** provides a streamlined workflow for analyzing repositories.

### Analyzing a Repository
1.  Navigate to the **Dashboard** via the web interface.
2.  Enter the URL of the GitHub repository you wish to explain.
3.  The system will trigger the `POST /api/github` endpoint to fetch the necessary repository metadata.

### Visualizing Code Logic
Once the repository is ingested:
*   Use the **Dependency Graph** to see the hierarchy of files and folders.
*   Explore the **3D Scene** to visualize the project's scale. The `CameraRig` allows you to rotate and zoom into specific clusters of the codebase.
*   Review the output from the `POST /api/analyze` endpoint, which provides a logical breakdown of the repository's purpose and functionality.

### API Endpoints for Developers
If you are looking to integrate with the backend directly:

*   **`POST /api/github`**: Accepts a repository URL and returns structural metadata.
*   **`POST /api/analyze`**: Performs a deep-dive analysis of the codebase content to generate explanations.

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for complete details.

### What this means:

- ✅ **Commercial use:** You can use this project commercially.
- ✅ **Modification:** You can modify the code.
- ✅ **Distribution:** You can distribute this software.
- ✅ **Private use:** You can use this project privately.
- ⚠️ **Liability:** The software is provided "as is", without warranty of any kind.
- ⚠️ **Trademark:** This license does not grant trademark rights.

---

<p align="center">Built with ⚡ <strong>Groq · React · Node.js · D3.js</strong></p>
