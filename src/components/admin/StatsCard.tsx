// src/app/admin/components/StatsCard.tsx
interface StatsCardProps {
  title: string
  value: string
  icon: string
  trend?: string
}

export default function StatsCard({ title, value, icon, trend }: StatsCardProps) {
  const isPositiveTrend = trend?.startsWith('+')

  return (
    <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:transform hover:-translate-y-2 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-2xl shadow-lg">
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
            isPositiveTrend 
              ? 'bg-green-100 text-green-600' 
              : 'bg-red-100 text-red-600'
          }`}>
            {trend}
          </span>
        )}
      </div>
      
      <div className="text-3xl font-bold text-purple-600 mb-2">{value}</div>
      <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</div>
    </div>
  )
}