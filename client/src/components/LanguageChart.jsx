import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = ['#f1e05a', '#3178c6', '#3572A5', '#dea584', '#00ADD8', '#b07219', '#f34b7d', '#563d7c']

export default function LanguageChart({ repos }) {
  const counts = repos.reduce((acc, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1
    }
    return acc
  }, {})

  const data = Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8)

  if (data.length === 0) return null

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 mb-6 flex flex-col lg:flex-row gap-8 items-center">
      <div className="flex-1 w-full">
        <h3 className="text-white font-semibold text-base mb-4">Language Distribution</h3>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px', fontSize: '14px' }}
              itemStyle={{ color: '#d1d5db' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex-1 w-full">
        <h3 className="text-white font-semibold text-base mb-4">Breakdown</h3>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center gap-4">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-gray-300 text-base flex-1">{item.name}</span>
              <span className="text-gray-500 text-sm">{item.value} repo{item.value !== 1 ? 's' : ''}</span>
              <div className="w-32 bg-gray-800 rounded-full h-2">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${(item.value / repos.length) * 100}%`,
                    backgroundColor: COLORS[index % COLORS.length],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}