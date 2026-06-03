export default function UserProfile({ user }) {
  return (
    <div className="mt-8 bg-gray-900 border border-gray-800 rounded-2xl p-8 flex flex-row gap-8 items-center">
      <img
        src={user.avatar_url}
        alt={user.login}
        className="w-28 h-28 rounded-full border-2 border-gray-700 flex-shrink-0"
      />

      <div className="flex-1">
        <h2 className="text-2xl font-bold text-white">
          {user.name ? user.name : user.login}
        </h2>

        <a
          href={user.html_url}
          target="_blank"
          rel="noreferrer"
          className="text-blue-400 text-sm hover:underline"
        >
          @{user.login}
        </a>

        {user.bio && (
          <p className="text-gray-400 text-sm mt-2 max-w-xl">
            {user.bio}
          </p>
        )}

        <div className="flex gap-8 mt-4">
          <Stat label="Followers" value={user.followers} />
          <Stat label="Following" value={user.following} />
          <Stat label="Repos" value={user.public_repos} />
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="text-center">
      <div className="text-white font-bold text-lg">
        {(value ?? 0).toLocaleString()}
      </div>
      <div className="text-gray-500 text-xs">
        {label}
      </div>
    </div>
  )
}