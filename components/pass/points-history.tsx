"use client"

import { useMemo } from "react"
import { Notification, User } from "@/lib/types"
import { useMockDBStore } from "@/lib/mock-db"
import { TrendingUp, TrendingDown, Award, CheckCircle, MapPin, Gift, Crown } from "lucide-react"
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
        return { icon: CheckCircle, color: 'bg-blue-100 text-blue-600', points: 500 }
      case 'check_in':
        return { icon: MapPin, color: 'bg-purple-100 text-purple-600', points: 100 }
      case 'points_earned':
        return { icon: Gift, color: 'bg-green-100 text-green-600', points: 0 }
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
      created_at: n.created_at
    }
  }).filter(t => t.amount > 0)

  return (
    <div className={cn("space-y-6", className)}>
      {/* Points Overview Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white relative overflow-hidden shadow-[0_4px_20px_-2px_rgba(0,0,0,0.3)]">
        {/* Northern Lights glow */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#135bec]/10 rounded-full blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Crown className="w-4 h-4 text-white" />
            </div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.2em]">
              {currentTier} Member
            </span>
          </div>
          <div className="text-4xl font-black tracking-tight mb-5">
            {currentPoints.toLocaleString()}
            <span className="text-lg font-medium text-white/60 ml-2">points</span>
          </div>

          {nextTier && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em]">Progress to {nextTier}</span>
                <span className="font-bold">
                  {currentPoints.toLocaleString()} / {nextTierThreshold?.toLocaleString()}
                </span>
              </div>
              <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500 shadow-lg"
                  style={{ width: `${progressToNextTier}%` }}
                />
              </div>
              <p className="text-xs text-white/50">
                {nextTierThreshold && nextTierThreshold - currentPoints > 0
                  ? `${(nextTierThreshold - currentPoints).toLocaleString()} points until ${nextTier}`
                  : 'Maximum tier reached!'
                }
              </p>
            </div>
          )}

          {!nextTier && (
            <div className="flex items-center gap-2 text-amber-400">
              <Award className="w-5 h-5" />
              <span className="text-sm font-bold">You've reached the highest tier!</span>
            </div>
          )}
        </div>
      </div>

      {/* How to Earn Points */}
      <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 border border-gray-100/50 shadow-sm">
        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">
          How to Earn Points
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shadow-sm">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-black text-gray-900">+500</p>
              <p className="text-xs text-gray-500">Per booking</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shadow-sm">
              <MapPin className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-black text-gray-900">+100</p>
              <p className="text-xs text-gray-500">Per check-in</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <h4 className="text-[10px] font-bold text-gray-900 uppercase tracking-[0.2em] mb-4">Recent Activity</h4>

        {transactions.length === 0 ? (
          <div className="py-10 text-center bg-gray-50/80 backdrop-blur-sm rounded-2xl border border-dashed border-gray-200">
            <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-gray-100/50">
              <TrendingUp className="w-7 h-7 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 font-bold">No points activity yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Book offers to start earning points!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.slice(0, 10).map((transaction) => {
              const config = getTransactionIcon(
                transaction.source === 'Booking Confirmation' ? 'booking_confirmed' :
                transaction.source === 'Check-in Bonus' ? 'check_in' : 'points_earned'
              )
              return (
                <div
                  key={transaction.id}
                  className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-lg hover:scale-[1.01] transition-all duration-300"
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm",
                    config.color
                  )}>
                    <config.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">{transaction.source}</p>
                    <p className="text-xs text-gray-500 truncate">{transaction.description}</p>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "text-base font-black",
                      transaction.type === 'earned' ? "text-green-600" : "text-red-600"
                    )}>
                      {transaction.type === 'earned' ? '+' : '-'}{transaction.amount}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
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
