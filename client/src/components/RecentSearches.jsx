import { useState, useEffect } from 'react'

export default function RecentSearches({ onSelect }) {
  const [recent, setRecent] = useState([])

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('recentSearches') || '[]')
    setRecent(stored)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const stored = JSON.parse(localStorage.getItem('recentSearches') || '[]')
      setRecent(stored)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  if (recent.length === 0) return null

  return (
    <div className="mt-4 flex items-center gap-3 flex-wrap">
      <span className="text-sm font-medium text-gray-500">Recent:</span>
      {recent.map((name) => (
        <button
          key={name}
          onClick={() => onSelect(name)}
          className="text-sm font-medium bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-1.5 rounded-full transition-colors"
        >
          {name}
        </button>
      ))}
    </div>
  )
}