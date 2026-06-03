function SkeletonBlock({ className }) {
  return (
    <div className={`bg-gray-800 rounded-lg animate-pulse ${className}`} />
  )
}

export default function SkeletonLoader() {
  return (
    <div className="mt-8 space-y-6">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 flex gap-6 md:gap-8">
        <SkeletonBlock className="w-28 h-28 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-4 pt-2">
          <SkeletonBlock className="h-6 w-48" />
          <SkeletonBlock className="h-4 w-32" />
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-3/4" />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 mt-8">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5 md:p-6 space-y-3"
          >
            <SkeletonBlock className="h-5 w-56" />
            <SkeletonBlock className="h-4 w-full mt-3" />
            <SkeletonBlock className="h-4 w-2/3" />
            <div className="flex gap-5 pt-3 mt-2">
              <SkeletonBlock className="h-4 w-20" />
              <SkeletonBlock className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}