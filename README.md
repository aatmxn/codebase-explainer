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

### 📊 Automated Repository Analysis
At the heart of the platform are the dedicated analysis endpoints. By utilizing the `/api/github` and `/api/analyze` routes, the system can systematically crawl repository structures, identify key entry points, and summarize the intent of the codebase. This removes the guesswork from understanding how a project is organized.

### 🌐 Interactive Dependency Mapping
Visualizing how code interacts is crucial for impact analysis. The `DependencyGraph` component provides a dynamic view of how modules relate to one another. Users can see at a glance which files are the "hubs" of the application and which are the "leaves," helping to identify potential bottlenecks or overly-coupled modules.

### 🧊 Immersive 3D Visualization
Moving beyond flat documentation, **Codebase Explainer** features a cutting-edge 3D scene implementation. Utilizing `CameraRig.jsx`, the application can represent project metrics and structures in a spatial environment. This unique approach helps users perceive the "scale" of a project in a tactile, visual way that traditional text-based READMEs cannot match.

### 🚀 Streamlined User Experience
The interface is designed with a "user-first" philosophy. From the `HeroOverlay` that introduces the tool's value proposition to the `Dashboard` that manages active analysis tasks, every element is tuned for clarity.
*   **Features & HowItWorks:** Guided UI sections that ensure users maximize the tool's potential from the very first session.
*   **CTASection:** Quick-action areas designed to get you from a URL to an analyzed codebase in the fewest clicks possible.

### 🛡️ Robust Backend Processing
The server-side logic, powered by Express, ensures that complex analysis tasks are handled outside the main UI thread. This prevents interface lag during heavy processing and provides a secure environment for handling API interactions and environment configurations via `dotenv`.

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
    git clone https://github.com/[username]/codebase-explainer.git
    cd codebase-explainer
    ```

2.  **Setup the Backend Server**
    ```bash
    cd server
    npm install
    ```
    *Note: The server requires a `.env` file for configuration, although no specific keys are currently mandated by the core analysis logic.*

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
2.  Locate the input section (facilitated by `CTASection.jsx`).
3.  Enter the URL of the GitHub repository you wish to explain.
4.  The system will trigger the `POST /api/github` endpoint to fetch the necessary repository metadata.

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

## 🤝 Contributing

We welcome contributions to improve the **Codebase Explainer**! Your input helps make this project better for everyone.

### How to Contribute

1. **Fork the repository** - Click the 'Fork' button at the top right of this page
2. **Create a feature branch** 
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes** - Improve code, documentation, or features
4. **Test thoroughly** - Ensure all functionality works as expected
   ```bash
   npm test # If applicable
   ```
5. **Commit your changes** - Write clear, descriptive commit messages
   ```bash
   git commit -m 'Add: Amazing new feature that does X'
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request** - Submit your changes for review

### Development Guidelines

- ✅ Follow the existing code style and conventions (React/Express best practices)
- 📝 Add comments for complex 3D math or analysis logic
- 🧪 Ensure the API endpoints remain backward compatible
- 📚 Update the documentation if you modify the file structure or API surface
- 🎯 Keep commits focused and atomic

### Ideas for Contributions

We're looking for help with:
- 🐛 **Bug Fixes:** Address any UI glitches in the 3D scene or graph visualization.
- ✨ **New Features:** Add support for private repositories or additional visualization modes.
- 📖 **Documentation:** Improve the internal component documentation within `client/src/components`.
- ⚡ **Performance:** Optimize the analysis engine for extremely large repositories.

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
