interface StatCardProps {
  icon: string
  label: string
  value: string
  change?: string
  trend?: 'up' | 'down'
  color?: 'green' | 'blue' | 'red' | 'yellow'
}

function StatCard({ icon, label, value, change, trend = 'up', color = 'green' }: StatCardProps) {
  const colorClasses = {
    green: 'bg-green-50 border-green-200',
    blue: 'bg-blue-50 border-blue-200',
    red: 'bg-red-50 border-red-200',
    yellow: 'bg-yellow-50 border-yellow-200',
  }

  const textColorClasses = {
    green: 'text-green-600',
    blue: 'text-blue-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
  }

  return (
    <div className={`${colorClasses[color]} border rounded-lg p-6 hover:shadow-lg transition-all`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-2 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend === 'up' ? '📈' : '📉'} {change}
            </p>
          )}
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </div>
  )
}

export default StatCard
