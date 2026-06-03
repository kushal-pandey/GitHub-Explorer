import { useState } from 'react'

export default function SearchBar({ onSearch, loading }) {
  const [value, setValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (value.trim()) onSearch(value.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter a GitHub username..."
        className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-5 py-3.5 text-base text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors shadow-sm"
      />
      <button
        type="submit"
        disabled={loading || !value.trim()}
        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-all shadow-sm"
      >
        {loading ? 'Searching...' : 'Search'}
      </button>
    </form>
  )
}