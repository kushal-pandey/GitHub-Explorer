import SearchBar from './components/SearchBar'
import UserProfile from './components/UserProfile'
import RepoList from './components/RepoList'
import SkeletonLoader from './components/SkeletonLoader'
import RecentSearches from './components/RecentSearches'
import useGitHub from './hooks/useGitHub'

export default function App() {
  const { data, allRepos, loading, loadingMore, error, fetchUser, loadMore } = useGitHub()

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
            GitHub Explorer
          </h1>
          <p className="text-gray-400 text-sm">Search any public GitHub profile</p>
        </div>

        <SearchBar onSearch={(name) => fetchUser(name, 1)} loading={loading} />
        <RecentSearches onSelect={(name) => fetchUser(name, 1)} />

        {error && (
          <div className="mt-6 p-4 bg-red-950 border border-red-800 rounded-xl text-red-300 text-center text-sm">
            {error}
          </div>
        )}

        {loading && <SkeletonLoader />}

        {!loading && data && (
          <>
            <UserProfile user={data.user} />
            <RepoList
              repos={allRepos}
              totalRepos={data.user.public_repos}
              onLoadMore={loadMore}
              loadingMore={loadingMore}
            />
          </>
        )}
      </div>
    </div>
  )
}