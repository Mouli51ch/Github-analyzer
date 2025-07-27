Here’s a cleaned-up and better-formatted version of your README.md for Github-analyzer. I’ve improved headings, list formatting, code blocks, and clarity. No features or content were removed.

---

# GitHub Repository Analyzer 🔍

A powerful, AI-driven Next.js application that provides comprehensive analysis of any public GitHub repository. Get instant insights into code structure, contributors, languages, issues, and more with a beautiful, modern UI.

---

## ✨ Features

### 🤖 AI-Powered Analysis

- **Smart Code Summaries:** Uses Google Gemini AI to analyze and summarize repository structure
- **Architecture Insights:** Automatically detects frameworks, libraries, and architectural patterns
- **Plagiarism Detection:** Advanced code similarity analysis across files
- **Contract Analysis:** Special handling for Solidity smart contracts

### 📊 Repository Intelligence

- **Comprehensive Stats:** Stars, forks, watchers, size, license, and creation date
- **Language Breakdown:** Visual representation of code distribution by programming language
- **Contributor Analysis:** Top contributors with avatars, commit counts, and activity
- **Issue & PR Tracking:** Open issues and pull requests with detailed status
- **Recent Activity:** Latest commits with messages, authors, and timestamps

### 🎨 Modern User Experience

- **Responsive Design:** Works seamlessly on desktop, tablet, and mobile devices
- **Beautiful UI:** Clean, modern interface with smooth animations
- **Accessible:** Built with accessibility best practices
- **Fast Performance:** Optimized with Next.js 15 and Turbopack
- **Real-time Analysis:** Live progress indicators during repository processing

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Google Gemini API key

### Installation

1. **Clone the repository**
    ```bash
    git clone https://github.com/Mouli51ch/Github-analyzer.git
    cd Github-analyzer/my-next-app
    ```

2. **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3. **Configure environment variables**

    Create a `.env.local` file in the root directory:
    ```env
    GEMINI_API_KEY=your_gemini_api_key_here
    ```
    > **Get your Gemini API key:** Visit [Google AI Studio](https://makersuite.google.com/app/apikey) to obtain your free API key.

4. **Start the development server**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

5. **Open the application**

    Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📖 Usage

1. **Enter Repository:** Input a GitHub repository URL (e.g., `https://github.com/facebook/react`) or use the shorthand format (`facebook/react`)
2. **Start Analysis:** Click the "Analyze" button to begin comprehensive repository analysis
3. **View Results:** Explore detailed insights including:
    - Repository statistics and metadata
    - Programming language distribution
    - Contributor profiles and activity
    - Open issues and pull requests
    - Recent commit history
    - AI-generated code summaries
    - Plagiarism and similarity detection

---

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** – React framework with App Router
- **React 19** – Latest React with concurrent features
- **TailwindCSS 4** – Utility-first CSS framework
- **TypeScript** – Type-safe JavaScript

### UI & Design

- **Radix UI** – Accessible component primitives
- **Lucide React** – Beautiful icon library
- **Custom CSS** – Poppins font and animations
- **Responsive Design** – Mobile-first approach

### Backend & AI

- **Google Gemini AI** – Advanced language model for code analysis
- **GitHub API** – Repository data and statistics
- **Node.js** – Server-side JavaScript runtime
- **Git CLI** – Repository cloning and analysis

### Development Tools

- **ESLint** – Code linting and formatting
- **Turbopack** – Fast bundler for development
- **PostCSS** – CSS processing

---

## 🔌 API Reference

### `POST /api/analyze`

Analyzes a GitHub repository and returns comprehensive insights.

**Request:**
```json
{
  "repoUrl": "https://github.com/owner/repository"
}
```

**Response:**
```json
{
  "result": {
    "summary": "AI-generated analysis summary",
    "repoInfo": {
      "name": "repository",
      "full_name": "owner/repository",
      "stargazers_count": 1234,
      "forks_count": 567,
      "language": "JavaScript"
    },
    "contributors": [...],
    "languages": {...},
    "issues": [...],
    "pulls": [...],
    "commits": [...],
    "plagiarismResults": [...]
  }
}
```

---

## 📁 Project Structure

```
my-next-app/
├── app/                    # Next.js App Router
│   ├── api/
│   │   └── analyze/
│   │       └── route.js    # Analysis API endpoint
│   ├── layout.js           # Root layout component
│   └── page.jsx            # Home page
├── public/                 # Static assets
├── src/                    # Additional source files
├── GitHubRepoAnalyzer.jsx  # Main UI component
├── moulis-cursor.js        # Core analysis engine
├── package.json            # Project dependencies
├── next.config.ts          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS setup
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

---

## 🧩 Core Components

### `GitHubRepoAnalyzer.jsx` – Main React Component

- 🎨 User interface and search functionality
- 🔄 API communication and state management
- 📊 Results visualization and formatting
- 📱 Responsive design with animations
- ♿ Accessibility features

### `moulis-cursor.js` – Analysis Engine

- 📥 Repository cloning and file system analysis
- 🔍 Language detection and code statistics
- 🏗️ Framework and library identification
- 🤖 Google Gemini AI integration
- 🔍 Code similarity and plagiarism detection
- 🧹 Temporary file cleanup

### `app/api/analyze/route.js` – API Route Handler

- 📨 HTTP request processing
- ✅ Input validation and sanitization
- 🎯 Analysis orchestration
- 📤 Structured response formatting
- ⚠️ Error handling and logging

---

## 🌍 Environment Variables

| Variable         | Description                              | Required | Example      |
|------------------|------------------------------------------|----------|--------------|
| `GEMINI_API_KEY` | Google Gemini API key for AI analysis    | ✅ Yes   | `AIza...`    |

> **Tip:** Keep your API keys secure and never commit them to version control.

---

## 🚀 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Mouli51ch/Github-analyzer)

1. **Connect Repository:** Link your GitHub repository to Vercel
2. **Configure Environment:** Add `GEMINI_API_KEY` in project settings
3. **Deploy:** Automatic deployment on every push to main branch

#### Alternative Platforms

- **Netlify:** Full-stack deployment with serverless functions
- **Railway:** Container-based deployment
- **AWS Amplify:** Scalable hosting with CI/CD
- **Heroku:** Traditional PaaS deployment

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure all checks pass before submitting

---

## 📄 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Gemini AI** – Powering intelligent code analysis
- **GitHub API** – Providing comprehensive repository data
- **Next.js Team** – Amazing React framework
- **Vercel** – Seamless deployment platform
- **Radix UI** – Accessible component library
- **Lucide** – Beautiful icon collection

---

## 📞 Support

Need help? Here's how to get support:

1. **Documentation:** Check this README and code comments
2. **Issues:** Browse [existing issues](https://github.com/Mouli51ch/Github-analyzer/issues)
3. **New Issue:** Create a detailed bug report or feature request
4. **Discussions:** Join community discussions

### Reporting Issues

When reporting issues, please include:

- Operating system and browser version
- Steps to reproduce the problem
- Expected vs actual behavior
- Error messages and console logs
- Repository URL that caused the issue (if applicable)

---

<div align="center">

**Made with ❤️ by [Mouli51ch](https://github.com/Mouli51ch)**

⭐ **Star this repo if you found it helpful!** ⭐

</div>

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

---

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) – Learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) – An interactive Next.js tutorial.
- [Next.js GitHub Repository](https://github.com/vercel/next.js) – Your feedback and contributions are welcome!

---

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

[MIT](./LICENSE)

---

**Made with ❤️ by [Mouli51ch](https://github.com/Mouli51ch)**

---

Let me know if you want this as a downloadable file or want further customization!
 
