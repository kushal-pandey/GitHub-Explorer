import { useState } from 'react'

const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5', Rust: '#dea584', Go: '#00ADD8',
  Java: '#b07219', 'C++': '#f34b7d', C: '#555555', Ruby: '#701516', PHP: '#4F5D95', CSS: '#563d7c',
  HTML: '#e34c26', Shell: '#89e051', Swift: '#ffac45', Kotlin: '#A97BFF',
}

export default function RepoCard({ repo }) {
  const [expanded, setExpanded] = useState(false)
  const color = LANGUAGE_COLORS[repo.language] || '#8b949e'
  const updated = new Date(repo.updated_at).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 md:p-6 hover:border-gray-600 transition-colors flex flex-col h-full">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-400 font-semibold hover:underline text-base md:text-lg"
          >
            {repo.name}
          </a>

          {repo.description && (
            <p className="text-gray-400 text-sm mt-2 leading-relaxed line-clamp-2">
              {repo.description}
            </p>
          )}

          <div className="flex items-center gap-5 mt-4 flex-wrap">
            {repo.language && (
              <span className="flex items-center gap-2 text-sm text-gray-400">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                {repo.language}
              </span>
            )}
            <span className="text-sm text-gray-500">
              ⭐ {repo.stargazers_count.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">
              Updated {updated}
            </span>
          </div>
        </div>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-gray-400 hover:text-white text-sm font-medium flex-shrink-0 bg-gray-800 px-3 py-1.5 rounded-lg transition-colors"
        >
          {expanded ? '▲ Less' : '▼ More'}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-800 flex flex-wrap gap-6 text-sm text-gray-400">
          <span>
            🔀 Default branch: <span className="text-gray-200 font-medium">{repo.default_branch}</span>
          </span>
          <span>
            🐛 Open issues: <span className="text-gray-200 font-medium">{repo.open_issues_count}</span>
          </span>
        </div>
      )}
    </div>
  )
}