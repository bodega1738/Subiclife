"use client"

import { useMemo } from "react"
import { useMockDBStore } from "@/lib/mock-db"
import { TrendingUp, CheckCircle, MapPin, Gift, Crown, Info } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

interface PointsHistoryProps {
  userId: string
  className?: string
}

interface PointsTransaction {
  id: string
  type: 'earned' | 'redeemed'
  amount: number
  source: string
  description: string
  created_at: string
  sourceType: 'booking_confirmed' | 'check_in' | 'points_earned' | 'tier_upgraded' | 'other'
}

const tierThresholds = {
  starter: 0,
  basic: 5000,
  premium: 15000,
  elite: 50000
}

const tierOrder = ['starter', 'basic', 'premium', 'elite'] as const

export function PointsHistory({ userId, className }: PointsHistoryProps) {
  // Get raw data from store - stable references
  const users = useMockDBStore((state) => state.users)
  const allNotifications = useMockDBStore((state) => state.notifications)

  // Memoize user and filtered notifications
  const user = useMemo(() => users.find(u => u.id === userId), [users, userId])
  const notifications = useMemo(() =>
    allNotifications
      .filter(n => n.user_id === userId && (n.type === 'points_earned' || n.type === 'check_in' || n.type === 'booking_confirmed'))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    [allNotifications, userId]
  )

  if (!user) return null

  const currentPoints = user.points || 0
  const currentTier = user.tier || 'starter'
  const currentTierIndex = tierOrder.indexOf(currentTier as typeof tierOrder[number])
  const nextTier = tierOrder[currentTierIndex + 1]
  const nextTierThreshold = nextTier ? tierThresholds[nextTier] : null
  const progressToNextTier = nextTierThreshold
    ? Math.min(100, (currentPoints / nextTierThreshold) * 100)
    : 100

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'booking_confirmed':
        return { icon: CheckCircle, color: 'bg-blue-100 text-blue-600 shadow-blue-200/50', points: 500 }
      case 'check_in':
        return { icon: MapPin, color: 'bg-purple-100 text-purple-600 shadow-purple-200/50', points: 100 }
      case 'points_earned':
        return { icon: Gift, color: 'bg-green-100 text-green-600 shadow-green-200/50', points: 0 }
      default:
        return { icon: TrendingUp, color: 'bg-gray-100 text-gray-600', points: 0 }
    }
  }

  // Simulate point transactions from notifications
  const transactions: PointsTransaction[] = notifications.map(n => {
    const config = getTransactionIcon(n.type)
    return {
      id: n.id,
      type: 'earned' as const,
      amount: config.points || parseInt(n.message.match(/(\d+) points/)?.[1] || '0'),
      source: n.type === 'booking_confirmed' ? 'Booking Confirmation' :
              n.type === 'check_in' ? 'Check-in Bonus' : 'Activity',
      description: n.message,
      created_at: n.created_at,
      sourceType: n.type as PointsTransaction['sourceType']
    }
  }).filter(t => t.amount > 0)

  return (
    <div className={cn("space-y-8", className)}>
      {/* Points Overview Card */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-[0_20px_48px_-8px_rgba(0,0,0,0.5)] group">
        {/* Northern Lights glow */}
        <div className="absolute top-0 right-0 w-60 h-60 bg-white/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#135bec]/20 rounded-full blur-[60px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-amber-500/10 rounded-full blur-[50px]" />
        
        {/* Sparkles Overlay */}
        <div className="absolute inset-0 bg-[url('/sparkles.svg')] opacity-20 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/50">
                <Crown className="w-4 h-4 text-white" />
              </div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.2em] shadow-black drop-shadow-sm">
                {currentTier} Member
              </span>
            </div>
            <div className="p-2 bg-white/5 rounded-full backdrop-blur-sm cursor-help hover:bg-white/10 transition-colors">
              <Info className="w-4 h-4 text-white/40" />
            </div>
          </div>

          <div className="text-5xl font-black tracking-tight mb-8 mt-2">
            {currentPoints.toLocaleString()}
            <span className="text-lg font-bold text-white/40 ml-2 tracking-wide uppercase">points</span>
          </div>

          {nextTier && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em]">Next Tier: {nextTier}</span>
                <span className="font-bold font-mono text-white/80">
                  {currentPoints.toLocaleString()} / {nextTierThreshold?.toLocaleString()}
                </span>
              </div>
              <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden relative">
                {/* Milestone Markers */}
                <div className="absolute left-1/4 top-0 bottom-0 w-0.5 bg-white/5 z-10" />
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/5 z-10" />
                <div className="absolute left-3/4 top-0 bottom-0 w-0.5 bg-white/5 z-10" />
                
                <div
                  className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(245,158,11,0.5)] relative overflow-hidden"
                  style={{ width: `${progressToNextTier}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite] skew-x-12" />
                </div>
              </div>
              <p className="text-xs text-white/50 font-medium">
                {nextTierThreshold && nextTierThreshold - currentPoints > 0
                  ? `${(nextTierThreshold - currentPoints).toLocaleString()} points needed for ${nextTier} status`
                  : 'Maximum tier reached!'
                }
              </p>
            </div>
          )}

          {!nextTier && (
            <div className="flex items-center gap-2 text-amber-400 bg-amber-400/10 p-3 rounded-xl border border-amber-400/20 backdrop-blur-sm">
              <Crown className="w-5 h-5" />
              <span className="text-sm font-bold">You've reached the highest tier!</span>
            </div>
          )}
        </div>
      </div>

      {/* How to Earn Points */}
      <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6 relative z-10">
          How to Earn Points
        </h4>
        <div className="grid grid-cols-2 gap-4 relative z-10">
          <div className="flex items-center gap-4 text-sm group cursor-pointer hover:bg-white/50 p-2 rounded-xl transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-black text-gray-900 text-lg">+500</p>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Per booking</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm group cursor-pointer hover:bg-white/50 p-2 rounded-xl transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="font-black text-gray-900 text-lg">+100</p>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Per check-in</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <h4 className="text-[10px] font-bold text-gray-900 uppercase tracking-[0.2em] mb-6 px-2">Points History</h4>

        {transactions.length === 0 ? (
          <div className="py-12 text-center bg-gray-50/50 backdrop-blur-sm rounded-3xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-gray-100/50">
              <TrendingUp className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600 font-bold mb-1">No points activity yet</p>
            <p className="text-xs text-gray-400">
              Book offers to start earning points!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.slice(0, 10).map((transaction, index) => {
              const config = getTransactionIcon(transaction.sourceType)
              return (
                <div
                  key={transaction.id}
                  className="flex items-center gap-4 p-4 bg-white odd:bg-white even:bg-gray-50/30 rounded-2xl border border-gray-100 hover:shadow-lg hover:border-gray-200 hover:scale-[1.01] hover:bg-gradient-to-r hover:from-[#135bec]/5 hover:to-transparent transition-all duration-300 animate-in slide-in-from-bottom-2 fade-in fill-mode-backwards"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-md transition-transform duration-300 hover:scale-110",
                    config.color
                  )}>
                    <config.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 mb-0.5">{transaction.source}</p>
                    <p className="text-xs text-gray-500 truncate font-medium">{transaction.description}</p>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <div className={cn(
                      "text-base font-black px-2 py-0.5 rounded-lg mb-1 inline-flex items-center",
                      transaction.type === 'earned' 
                        ? "text-green-600 bg-green-50 shadow-sm shadow-green-100" 
                        : "text-red-600 bg-red-50 shadow-sm shadow-red-100"
                    )}>
                      {transaction.type === 'earned' ? '+' : '-'}{transaction.amount}
                    </div>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                      {formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
