import { useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export default function useGitHub() {
  const [data, setData] = useState(null)
  const [allRepos, setAllRepos] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [currentUsername, setCurrentUsername] = useState('')

  const saveRecentSearch = (name) => {
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]')
    const updated = [name, ...recent.filter((s) => s !== name)].slice(0, 5)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  const fetchUser = async (username, pageNum = 1) => {
    if (!username.trim()) return

    if (pageNum === 1) {
      setLoading(true)
      setError(null)
      setData(null)
      setAllRepos([])
      setCurrentUsername(username)
    } else {
      setLoadingMore(true)
    }

    try {
      const res = await fetch(
        `${API_BASE}/api/github/${username}?page=${pageNum}`
      )
      const json = await res.json()

      if (!res.ok) {
        setError(json.error || 'Something went wrong')
        return
      }

      if (pageNum === 1) {
        saveRecentSearch(username)
        setData(json)
        setAllRepos(json.repos)
        setPage(1)
      } else {
        setAllRepos((prev) => [...prev, ...json.repos])
        setPage(pageNum)
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const loadMore = () => fetchUser(currentUsername, page + 1)

  return { data, allRepos, loading, loadingMore, error, fetchUser, loadMore }
}