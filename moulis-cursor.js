import { GoogleGenAI } from "@google/genai";
import fetch from 'node-fetch';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function fetchReadme(owner, repo) {
    const url = `https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`;
    try {
        const res = await fetch(url);
        if (!res.ok) return null;
        return await res.text();
    } catch {
        return null;
    }
}

function cloneRepo(repoUrl, destDir) {
    try {
        execSync(`git clone --depth 1 ${repoUrl} "${destDir}"`, { stdio: 'ignore' });
        return true;
    } catch (e) {
        return false;
    }
}

function walkDir(dir, callback) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach(dirent => {
        const fullPath = path.join(dir, dirent.name);
        if (dirent.isDirectory()) {
            callback(fullPath, true);
            walkDir(fullPath, callback);
        } else {
            callback(fullPath, false);
        }
    });
}

function countLines(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return data.split(/\r?\n/).length;
    } catch {
        return 0;
    }
}

function getLanguageFromExt(ext) {
    const map = {
        '.js': 'JavaScript', '.ts': 'TypeScript', '.py': 'Python', '.sol': 'Solidity', '.java': 'Java',
        '.c': 'C', '.cpp': 'C++', '.cs': 'C#', '.rb': 'Ruby', '.go': 'Go', '.php': 'PHP', '.rs': 'Rust',
        '.html': 'HTML', '.css': 'CSS', '.md': 'Markdown', '.json': 'JSON', '.sh': 'Shell', '.yml': 'YAML', '.yaml': 'YAML'
    };
    return map[ext.toLowerCase()] || ext;
}

function analyzeRepo(dir) {
    const langStats = {};
    const keyFolders = new Set();
    const folderNames = ['contracts', 'src', 'docs', 'test', 'lib', 'public', 'build', 'dist'];
    let frameworks = new Set();

    walkDir(dir, (fullPath, isDir) => {
        if (isDir) {
            const base = path.basename(fullPath).toLowerCase();
            if (folderNames.includes(base)) keyFolders.add(base);
        } else {
            const ext = path.extname(fullPath);
            const lang = getLanguageFromExt(ext);
            if (!langStats[lang]) langStats[lang] = 0;
            langStats[lang] += countLines(fullPath);

            // Framework/library detection
            if (path.basename(fullPath) === 'package.json') {
                try {
                    const pkg = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
                    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
                    if (deps) {
                        Object.keys(deps).forEach(dep => {
                            if (/react/i.test(dep)) frameworks.add('React');
                            if (/hardhat/i.test(dep)) frameworks.add('Hardhat');
                            if (/next/i.test(dep)) frameworks.add('Next.js');
                            if (/vue/i.test(dep)) frameworks.add('Vue.js');
                            if (/express/i.test(dep)) frameworks.add('Express');
                        });
                    }
                } catch {}
            }
            if (path.basename(fullPath) === 'requirements.txt') {
                try {
                    const reqs = fs.readFileSync(fullPath, 'utf8');
                    if (/flask/i.test(reqs)) frameworks.add('Flask');
                    if (/django/i.test(reqs)) frameworks.add('Django');
                } catch {}
            }
        }
    });
    return {
        langStats,
        keyFolders: Array.from(keyFolders),
        frameworks: Array.from(frameworks)
    };
}

async function extractCodeSummaries(tempDir) {
    // Gather contract structure, API endpoints, and architecture hints
    let contractsSummary = '';
    let apiSummary = '';
    let archSummary = '';
    let contractFiles = [];
    let backendFiles = [];
    let frontendFiles = [];
    let apiFiles = [];
    let allCodeFiles = [];

    function collectFiles(dir) {
        fs.readdirSync(dir, { withFileTypes: true }).forEach(dirent => {
            const fullPath = path.join(dir, dirent.name);
            if (dirent.isDirectory()) {
                collectFiles(fullPath);
            } else {
                const ext = path.extname(fullPath).toLowerCase();
                if ([".js", ".ts", ".sol", ".py", ".java", ".c", ".cpp", ".cs", ".rb", ".go", ".php", ".rs"].includes(ext)) {
                    allCodeFiles.push(fullPath);
                }
                if (ext === '.sol') contractFiles.push(fullPath);
                if ([".js", ".ts"].includes(ext)) {
                    // Heuristics for backend/frontend/api
                    if (/api|routes|controller|server|app/i.test(fullPath)) apiFiles.push(fullPath);
                    if (/backend|server|api/i.test(fullPath)) backendFiles.push(fullPath);
                    if (/frontend|src|components|pages|client/i.test(fullPath)) frontendFiles.push(fullPath);
                }
            }
        });
    }
    collectFiles(tempDir);

    // Read and concatenate code for summaries (limit to first 1000 lines per type)
    function readFiles(files, maxLines = 1000) {
        let lines = [];
        for (const file of files) {
            try {
                const content = fs.readFileSync(file, 'utf8').split(/\r?\n/);
                lines = lines.concat(content.slice(0, maxLines - lines.length));
                if (lines.length >= maxLines) break;
            } catch {}
        }
        return lines.join('\n');
    }
    contractsSummary = readFiles(contractFiles, 1000);
    apiSummary = readFiles(apiFiles, 1000);
    archSummary = [
        readFiles(backendFiles, 500),
        readFiles(frontendFiles, 500)
    ].join('\n---\n');

    // Plagiarism & Similarity Check
    let plagiarismResults = [];
    for (const file of allCodeFiles.slice(0, 10)) { // Limit to 10 files for performance
        try {
            const code = fs.readFileSync(file, 'utf8');
            // Use Gemini to check for copied code or reused contracts
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: [{ role: 'user', parts: [{ text: `Does the following code appear to be copied from StackOverflow, GitHub, or a well-known open source contract? If so, name the likely source and rate the similarity (0-100). If it is a common smart contract (like OpenZeppelin), say so.\n\nFile: ${file}\n\nCode:\n${code.substring(0, 1200)}\n` }] }],
                config: {
                    systemInstruction: `You are a plagiarism and code similarity detector. Be concise and specific.`,
                }
            });
            plagiarismResults.push({ file, result: response.text });
        } catch {}
    }

    return { contractsSummary, apiSummary, archSummary, plagiarismResults };
}

async function describeGithubProject(repoUrl) {
    // Parse owner and repo from URL
    const match = repoUrl.match(/github.com\/(.+?)\/(.+?)(?:\.|\/|$)/);
    if (!match) return "Invalid GitHub URL.";
    const owner = match[1];
    const repo = match[2];
    const readme = await fetchReadme(owner, repo);
    if (!readme) return "Could not fetch README.md from the repository.";

    // Fetch GitHub API data
    const apiBase = `https://api.github.com/repos/${owner}/${repo}`;
    const [repoInfo, contributors, languages, issues, pulls, commits] = await Promise.all([
        fetch(apiBase).then(r => r.json()),
        fetch(`${apiBase}/contributors?per_page=5`).then(r => r.json()),
        fetch(`${apiBase}/languages`).then(r => r.json()),
        fetch(`${apiBase}/issues?state=open&per_page=100`).then(r => r.json()),
        fetch(`${apiBase}/pulls?state=open&per_page=100`).then(r => r.json()),
        fetch(`${apiBase}/commits?per_page=5`).then(r => r.json()),
    ]);

    // Clone repo to temp dir
    const osTmp = process.platform === 'win32' ? process.env.TEMP : '/tmp';
    const tempDir = path.join(osTmp, `mouli-cursor-${Date.now()}`);
    if (!cloneRepo(repoUrl.replace(/\.git$/, ''), tempDir)) {
        return "Failed to clone repository.";
    }

    // Analyze repo
    const analysis = analyzeRepo(tempDir);

    // Extract code summaries for contracts, API, architecture, and plagiarism
    const { contractsSummary, apiSummary, archSummary, plagiarismResults } = await extractCodeSummaries(tempDir);

    // Use Gemini to summarize
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: 'user', parts: [{ text: `Summarize this GitHub project based on its README.md:\n\n${readme}\n\nAlso, here are some stats:\n- Lines of code per language: ${JSON.stringify(analysis.langStats)}\n- Key folders: ${analysis.keyFolders.join(', ') || 'None'}\n- Frameworks/Libraries: ${analysis.frameworks.join(', ') || 'None'}\n\n---\nNow, provide a high-level summary of:\n1. Contract structure and functions (Solidity):\n${contractsSummary}\n\n2. App architecture (frontend-backend-smart contract):\n${archSummary}\n\n3. API endpoints and routes (Node.js/Express or similar):\n${apiSummary}\n` }] }],
        config: {
            systemInstruction: `You are Mouli's cursor, an expert project analyst. Given a GitHub README, codebase stats, and code samples, provide a concise and clear project description, contract structure, app architecture, and API endpoint summary.`,
        }
    });

    // Clean up temp dir
    try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch {}

    // Compose result object
    const result = {
        summary: response.text,
        repoInfo,
        contributors,
        languages,
        issues,
        pulls,
        commits,
        plagiarismResults,
    };
    return JSON.stringify(result);
}

export { describeGithubProject };
