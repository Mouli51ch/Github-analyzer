"use client";
// Copied from testing/GitHubRepoAnalyzer.jsx
// React UI for GitHub Repo Analysis

import { useState } from "react"
import { Search, Star, GitFork, Eye, Users, Calendar, Code, AlertCircle, GitPullRequest, Bug } from "lucide-react"
// Update these imports to match your project structure

// Replacing custom UI components with HTML elements for compatibility



export default function GitHubRepoAnalyzer() {
  // CSS variables for design system
  const cssVars = {
    '--primary-gradient': 'linear-gradient(to right, #9333ea, #2563eb)',
    '--background-gradient': 'linear-gradient(to bottom right, #f8fafc, #f1f5f9)',
    '--text-primary': '#111827',
    '--text-secondary': '#4b5563',
    '--text-muted': '#6b7280',
    '--success': '#10b981',
    '--warning': '#f59e0b',
    '--error': '#ef4444',
    '--info': '#3b82f6',
    '--text-4xl': '2.25rem',
    '--text-2xl': '1.5rem',
    '--text-xl': '1.25rem',
    '--text-lg': '1.125rem',
    '--text-base': '1rem',
    '--text-sm': '0.875rem',
    '--text-xs': '0.75rem',
    '--font-bold': 700,
    '--font-semibold': 600,
    '--font-medium': 500,
    '--font-normal': 400,
    '--space-1': '0.25rem',
    '--space-2': '0.5rem',
    '--space-3': '0.75rem',
    '--space-4': '1rem',
    '--space-6': '1.5rem',
    '--space-8': '2rem',
    '--space-12': '3rem',
    '--header-height': '4rem',
    '--card-padding': '1.5rem',
    '--section-gap': '2rem',
  };

  function formatNumber(n) {
    if (n >= 1e6) return (n/1e6).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 1e3) return (n/1e3).toFixed(1).replace(/\.0$/, '') + 'K';
    return n?.toLocaleString?.() ?? n;
  }

  function formatDate(date) {
    if (!date) return '';
    return new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  const [searchQuery, setSearchQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [repoData, setRepoData] = useState(null);

  // Helper to parse the result into sections
  function parseSections(text) {
    if (!text) return {};
    // Split by headings (##, --- lines, or numbered sections)
    const sections = {};
    let current = "summary";
    let buffer = [];
    const lines = text.split(/\r?\n/);
    for (let line of lines) {
      if (/^---+$/.test(line.trim())) {
        if (buffer.length) {
          sections[current] = buffer.join("\n").trim();
          buffer = [];
        }
        current = null;
      } else if (/^#+\s*(.+)/.test(line)) {
        if (buffer.length && current) {
          sections[current] = buffer.join("\n").trim();
          buffer = [];
        }
        current = line.replace(/^#+\s*/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
      } else if (/^\d+\.\s+/.test(line)) {
        if (buffer.length && current) {
          sections[current] = buffer.join("\n").trim();
          buffer = [];
        }
        current = line.replace(/^\d+\.\s+/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
        buffer.push(line);
      } else {
        buffer.push(line);
      }
    }
    if (buffer.length && current) {
      sections[current] = buffer.join("\n").trim();
    }
    return sections;
  }


  function renderSections(repoData) {
    if (!repoData) return null;
    let parsed = repoData;
    if (typeof repoData.description === 'string' && repoData.description.startsWith('{')) {
      try { parsed = { ...repoData, ...JSON.parse(repoData.description) }; } catch {}
    }
    const { summary, repoInfo, contributors, languages, issues, pulls, commits, plagiarismResults } = parsed;
    const sections = parseSections(summary);
    // Responsive grid helpers
    const gridStats = {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '24px',
      marginBottom: '32px',
    };
    const gridContrib = {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '16px',
      marginBottom: '32px',
    };
    // Language breakdown percent
    let langTotal = 0;
    if (languages) langTotal = Object.values(languages).reduce((a, b) => a + b, 0);
    return (
      <div style={{ color: 'var(--text-primary)' }}>
        {/* Project Summary */}
        {sections && sections["summary"] && (
          <section style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-secondary)' }}>🧠 Project Summary</h3>
            <p style={{ marginTop: 8, whiteSpace: "pre-wrap", color: 'var(--text-muted)', fontSize: 'var(--text-base)' }}>{sections["summary"]}</p>
          </section>
        )}
        {/* Statistics Cards */}
        {repoInfo && (
          <section role="region" aria-label="Repository statistics" style={gridStats}>
            {/* Stars */}
            <div className="card" style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px #e5e7eb', padding: 24, transition: 'all 0.2s', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-muted)' }}>Stars</span>
                <Star size={16} color="#f59e0b" fill="#f59e0b" />
              </div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>{formatNumber(repoInfo.stargazers_count)}</div>
            </div>
            {/* Forks */}
            <div className="card" style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px #e5e7eb', padding: 24, transition: 'all 0.2s', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-muted)' }}>Forks</span>
                <GitFork size={16} color="#2563eb" />
              </div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>{formatNumber(repoInfo.forks_count)}</div>
            </div>
            {/* Watchers */}
            <div className="card" style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px #e5e7eb', padding: 24, transition: 'all 0.2s', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-muted)' }}>Watchers</span>
                <Eye size={16} color="#10b981" />
              </div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>{formatNumber(repoInfo.subscribers_count)}</div>
            </div>
            {/* Size */}
            <div className="card" style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px #e5e7eb', padding: 24, transition: 'all 0.2s', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-muted)' }}>Repo Size</span>
                <Code size={16} color="#9333ea" />
              </div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>{(repoInfo.size/1024).toFixed(1)} MB</div>
            </div>
          </section>
        )}
        {/* Language Breakdown Card */}
        {languages && (
          <section style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px #e5e7eb', padding: 24, marginBottom: 32, border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Code size={20} color="#2563eb" />
              <span style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' }}>Language Breakdown</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {Object.entries(languages).map(([lang, val]) => {
                const percent = langTotal ? Math.round((val/langTotal)*100) : 0;
                return (
                  <div key={lang} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>{lang}</span>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{percent}%</span>
                    </div>
                    <div style={{ background: '#e5e7eb', borderRadius: 4, height: 8, width: '100%' }}>
                      <div style={{ background: 'linear-gradient(to right, #9333ea, #2563eb)', height: 8, borderRadius: 4, width: percent + '%' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
        {/* Issues & PRs Card */}
        {repoInfo && (
          <section style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px #e5e7eb', padding: 24, marginBottom: 32, border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <AlertCircle size={20} color="#f59e0b" />
              <span style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' }}>Issues & Pull Requests</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Bug size={16} color="#ef4444" />
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>Open Issues</span>
                </div>
                <span style={{ background: '#fee2e2', color: '#ef4444', borderRadius: 8, padding: '2px 10px', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)' }}>{repoInfo.open_issues_count}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <GitPullRequest size={16} color="#10b981" />
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>Open PRs</span>
                </div>
                <span style={{ background: '#f1f5f9', color: '#10b981', borderRadius: 8, padding: '2px 10px', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)' }}>{pulls ? pulls.length : 'N/A'}</span>
              </div>
            </div>
            <hr style={{ margin: '24px 0', border: 0, borderTop: '1px solid #e5e7eb' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
              <span>Created: {formatDate(repoInfo.created_at)}</span>
              <span>Updated: {formatDate(repoInfo.updated_at)}</span>
              <span>License: {repoInfo.license?.spdx_id || 'N/A'}</span>
            </div>
          </section>
        )}
        {/* Contributors Section */}
        {contributors && contributors.length > 0 && (
          <section role="region" aria-label="Top contributors" style={gridContrib}>
            {contributors.map(c => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, border: '1px solid #e5e7eb', borderRadius: 12, background: '#fff' }}>
                <img src={c.avatar_url} alt={c.login} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', background: '#f1f5f9' }} onError={e => {e.target.style.display='none'}} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.login}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{formatNumber(c.contributions)} commits</div>
                </div>
              </div>
            ))}
          </section>
        )}
        {/* Recent Commits Section */}
        {commits && commits.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Calendar size={20} color="#2563eb" />
              <span style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' }}>Recent Commits</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {commits.map(c => (
                <div key={c.sha} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 12, border: '1px solid #e5e7eb', borderRadius: 12, background: '#fff' }}>
                  <span style={{ width: 8, height: 8, background: '#10b981', borderRadius: '50%', marginTop: 8, flexShrink: 0, display: 'inline-block' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>{c.commit.message.split('\n')[0]}</div>
                    <div style={{ display: 'flex', gap: 12, fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 4 }}>
                      <span>by {c.commit.author.name}</span>
                      <span>{formatDate(c.commit.author.date)}</span>
                      <span style={{ fontFamily: 'monospace', background: '#f1f5f9', borderRadius: 4, padding: '0 4px' }}>{c.sha.slice(0,7)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        {/* Summary Sections (contracts, architecture, API, plagiarism, etc.) */}
        {Object.entries(sections).map(([key, value]) => {
          if (key === "summary") return null;
          let title = key.replace(/-/g, ' ');
          if (/api endpoint summary/i.test(title)) title = 'API Endpoint Summary';
          else if (/contract structure and functions/i.test(title)) title = 'Contract Structure & Functions';
          else if (/app architecture/i.test(title)) title = 'App Architecture';
          else if (/project summary/i.test(title)) title = 'Project Summary';
          else if (/api endpoints/i.test(title)) title = 'API Endpoints';
          else if (/solidity/i.test(title)) title = 'Solidity';
          else if (/nodejs\/nextjs/i.test(title)) title = 'Node.js/Next.js';
          else if (/frontend-backend-smart contract/i.test(title)) title = 'Frontend-Backend-Smart Contract';
          const isPlagiarism = /plagiarism|similarity/i.test(title);
          return (
            <section key={key} style={{ marginBottom: 32 }}>
              <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: isPlagiarism ? 'var(--error)' : 'var(--info)', marginBottom: 8 }}>
                {isPlagiarism ? "🚨 Plagiarism & Similarity Check" : title.charAt(0).toUpperCase() + title.slice(1)}
              </h4>
              <div style={{ background: isPlagiarism ? "#fee2e2" : "#f1f5f9", borderRadius: 6, padding: 12, whiteSpace: "pre-wrap", fontSize: 'var(--text-base)' }}>
                {value}
              </div>
            </section>
          );
        })}
      </div>
    );
  }

  const handleAnalyze = async () => {
    if (!searchQuery.trim()) return;
    setIsAnalyzing(true);
    setRepoData(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl: searchQuery })
      });
      const data = await res.json();
      if (data.error) {
        setRepoData({
          fullName: searchQuery,
          description: data.error,
        });
      } else if (data.result) {
        setRepoData({
          fullName: searchQuery,
          ...data.result,
        });
      } else {
        setRepoData({
          fullName: searchQuery,
          description: 'No data',
        });
      }
    } catch (err) {
      setRepoData({
        fullName: searchQuery,
        description: 'Failed to analyze repository.',
      });
    }
    setIsAnalyzing(false);
  };

  return (
    <>
      {/* Google Fonts: Poppins */}
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ minHeight: '100vh', background: 'var(--background-gradient)', fontFamily: 'Poppins, sans-serif', ...cssVars }}>
      {/* Header */}
      <header style={{ height: 'var(--header-height)', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center', padding: '0 32px', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(to right, #9333ea, #2563eb)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Code size={20} color="#fff" />
          </div>
          <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', background: 'linear-gradient(to right, #9333ea, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>GitHub Repo Analyzer</h1>
        </div>
        <span style={{ background: '#f1f5f9', color: '#6366f1', borderRadius: 8, padding: '2px 12px', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)' }}>Beta</span>
      </header>
      <main style={{ maxWidth: 800, margin: '0 auto', padding: 'var(--space-12) var(--space-4)' }}>
        {/* Search Section */}
        <section style={{ maxWidth: 512, margin: '0 auto', marginBottom: 48 }}>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', textAlign: 'center', color: 'var(--text-primary)', marginBottom: 16 }}>Analyze Any GitHub Repository</h2>
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <Search size={20} color="#9ca3af" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} aria-hidden="true" />
            <input
              type="text"
              aria-label="GitHub repository search"
              placeholder="Enter repository URL or owner/repo (e.g., facebook/react)"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                height: 48,
                fontSize: 'var(--text-lg)',
                paddingLeft: 40,
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                outline: 'none',
                marginBottom: 0,
                color: 'var(--text-primary)',
                background: '#fff',
                boxSizing: 'border-box',
              }}
              onKeyDown={e => e.key === "Enter" && handleAnalyze()}
              className="focus-visible"
            />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !searchQuery.trim()}
            className="button"
            style={{
              width: '100%',
              height: 48,
              fontSize: 'var(--text-lg)',
              background: 'linear-gradient(to right, #9333ea, #2563eb)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontWeight: 'var(--font-semibold)',
              cursor: isAnalyzing || !searchQuery.trim() ? 'not-allowed' : 'pointer',
              marginTop: 8,
              transition: 'transform 0.2s',
            }}
            aria-busy={isAnalyzing}
          >
            {isAnalyzing ? "Analyzing..." : "Analyze"}
          </button>
        </section>
        {/* Loading State */}
        {isAnalyzing && (
          <div className="animate-pulse" style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-base)', margin: '32px 0' }}>Analyzing repository...</div>
        )}
        {/* Results Card */}
        {repoData && (
          <section style={{ marginTop: 32, border: '1px solid #e5e7eb', borderRadius: 16, padding: 32, background: '#fff', boxShadow: '0 2px 8px #e5e7eb' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', marginBottom: 24, color: 'var(--text-primary)' }}>{repoData.fullName}</h3>
            {renderSections(repoData)}
          </section>
        )}
      </main>
      {/* Animation & Focus CSS */}
      <style>{`
        body, input, button, textarea, select, h1, h2, h3, h4, h5, h6, p, span, div {
          font-family: 'Poppins', sans-serif !important;
        }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4,0,0.6,1) infinite; }
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:.5;} }
        .card:hover { transform: translateY(-2px); box-shadow: 0 10px 25px -3px rgba(0,0,0,0.1); transition: all 0.2s; }
        .button:hover { transform: translateY(-1px); transition: transform 0.2s; }
        .focus-visible:focus-visible { outline: 2px solid #3b82f6; outline-offset: 2px; }
      `}</style>
      </div>
    </>
  );
}
