# GitHub Repository Analyzer

A modern full-stack web app to analyze any public GitHub repository with **AI-powered insights**, including code summaries, contributors, language breakdown, issues, pull requests, recent commits, and plagiarism detection.



---

## 🚀 Features

- 🔍 **Instant GitHub Repo Analysis**: Enter any GitHub URL or `owner/repo` for instant insights.
- 🤖 **AI-Powered Summaries**: Uses Google Gemini to summarize architecture and check for similarity or plagiarism.
- 📊 **Repository Stats**: Stars, forks, size, license, and more.
- 🧠 **Language Breakdown**: Visual representation of code by programming language.
- 🛠️ **Issues & Pull Requests**: Displays open issues and PRs with status indicators.
- 👥 **Top Contributors**: Lists main contributors with avatars and commit counts.
- 🕒 **Recent Commits**: Displays latest commit messages, authors, and SHAs.
- ✨ **Modern UI**: Fully responsive design using the Poppins font.
- 🔐 **Secure API Key Handling**: API keys are kept server-side only.

---

## 🧪 Demo

Try it live: [https://your-vercel-url.vercel.app](https://your-vercel-url.vercel.app)

---

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Mouli51ch/Github-analyzer.git
cd Github-analyzer/my-next-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file inside `my-next-app/`:

```env
GEMINI_API_KEY=your-gemini-api-key-here
```

> ⚠️ **Never commit your API key to GitHub.**

### 4. Run the app locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Project Structure

```
my-next-app/
├── app/
│   ├── api/
│   │   └── analyze/route.js      # API route for analysis logic
│   ├── page.jsx                  # Main page UI
│   └── layout.jsx                # Root layout
├── moulis-cursor.js              # Core GitHub + Gemini agent logic
├── GitHubRepoAnalyzer.jsx        # Frontend UI component
├── .env.local                    # Environment variables (not committed)
├── package.json
└── README.md
```

---

## 🧰 Technologies Used

- [Next.js (App Router)](https://nextjs.org/)
- [React](https://react.dev/)
- [Google Gemini API](https://ai.google.dev/)
- [GitHub REST API](https://docs.github.com/en/rest)
- [Lucide React Icons](https://lucide.dev/)
- [Poppins Font](https://fonts.google.com/specimen/Poppins)

---

## 🔐 Security Best Practices

- API keys are **never exposed** to the client.
- Environment variables are securely loaded from `.env.local`.
- Follows best practices for responsive and accessible UI design.

---

## 📄 License

[MIT](./LICENSE)

---

> Made with ❤️ by [Mouli51ch](https://github.com/Mouli51ch) 
 
