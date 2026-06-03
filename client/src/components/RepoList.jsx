import { useState } from 'react'
import RepoCard from './RepoCard'
import LanguageChart from './LanguageChart'

const SORT_OPTIONS = [
  { value: 'stars', label: '⭐ Stars' },
  { value: 'name', label: '🔤 Name' },
  { value: 'updated', label: '🕐 Updated' },
]

export default function RepoList({ repos, totalRepos, onLoadMore, loadingMore }) {
  const [sortBy, setSortBy] = useState('stars')

  const sorted = [...repos].sort((a, b) => {
    if (sortBy === 'stars') return b.stargazers_count - a.stargazers_count
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    if (sortBy === 'updated') return new Date(b.updated_at) - new Date(a.updated_at)
    return 0
  })

  const hasMore = repos.length < totalRepos

  return (
    <div className="mt-8">
      <LanguageChart repos={repos} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h3 className="text-white font-semibold text-lg">
          Repositories{' '}
          <span className="text-gray-500 text-base font-normal ml-1">
            ({repos.length} of {totalRepos})
          </span>
        </h3>
        <div className="flex gap-2 flex-wrap">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSortBy(opt.value)}
              className={`text-sm font-medium px-4 py-2 rounded-xl transition-colors ${
                sortBy === opt.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        {sorted.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={onLoadMore}
            disabled={loadingMore}
            className="bg-gray-800 hover:bg-gray-700 text-white disabled:opacity-50 font-medium px-8 py-3.5 rounded-xl text-base transition-colors w-full sm:w-auto"
          >
            {loadingMore ? 'Loading...' : 'Load more repositories'}
          </button>
        </div>
      )}
    </div>
  )
}