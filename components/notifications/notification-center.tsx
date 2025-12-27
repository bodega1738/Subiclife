"use client"

import { useState, useMemo } from "react"
import { Bell, X, Check, CheckCheck, RefreshCw, MessageSquare, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Notification } from "@/lib/types"
import { useMockDBStore } from "@/lib/mock-db"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

interface NotificationCenterProps {
  userId?: string
  className?: string
}

export function NotificationCenter({ userId, className }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Get raw notifications array - stable reference
  const allNotifications = useMockDBStore((state) => state.notifications)
  const markNotificationRead = useMockDBStore((state) => state.markNotificationRead)

  // Memoize filtered and sorted notifications
  const { notifications, unreadCount, sortedNotifications } = useMemo(() => {
    const filtered = allNotifications.filter(n => n.user_id === userId)
    const unread = filtered.filter(n => !n.read).length
    const sorted = [...filtered].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    return { notifications: filtered, unreadCount: unread, sortedNotifications: sorted }
  }, [allNotifications, userId])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking_confirmed':
        return { icon: Check, color: 'bg-green-100 text-green-600' }
      case 'counter_offer':
        return { icon: RefreshCw, color: 'bg-blue-100 text-blue-600' }
      case 'booking_declined':
        return { icon: X, color: 'bg-red-100 text-red-600' }
      case 'check_in':
        return { icon: CheckCheck, color: 'bg-purple-100 text-purple-600' }
      case 'points_earned':
        return { icon: AlertCircle, color: 'bg-yellow-100 text-yellow-600' }
      default:
        return { icon: MessageSquare, color: 'bg-gray-100 text-gray-600' }
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markNotificationRead(notification.id)
    }
  }

  const handleMarkAllRead = () => {
    notifications
      .filter(n => !n.read)
      .forEach(n => markNotificationRead(n.id))
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "relative p-2 rounded-full hover:bg-white/10 transition-colors",
            className
          )}
          aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold shadow-lg border-2 border-current animate-in fade-in zoom-in duration-200">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 sm:w-96 p-0 rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300"
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
              <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold mt-0.5">
                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllRead}
                className="text-xs font-bold uppercase tracking-[0.1em] text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 px-3 rounded-full hover:scale-105 transition-all duration-300"
              >
                Mark all read
              </Button>
            )}
          </div>
        </div>

        {/* Notification List */}
        <div className="max-h-[450px] overflow-y-auto">
          {sortedNotifications.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-gray-100/50">
                <Bell className="w-7 h-7 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 font-bold">No notifications yet</p>
              <p className="text-xs text-gray-400 mt-1">We'll notify you when something happens</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {sortedNotifications.slice(0, 20).map((notification) => {
                const config = getNotificationIcon(notification.type)
                return (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={cn(
                      "w-full flex items-start gap-3 p-4 text-left transition-all duration-300 hover:bg-gray-50 hover:scale-[1.01]",
                      !notification.read && "bg-blue-50/50"
                    )}
                  >
                    <div className={cn(
                      "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm",
                      config.color
                    )}>
                      <config.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn(
                          "text-sm leading-tight",
                          !notification.read ? "font-bold text-gray-900" : "font-medium text-gray-700"
                        )}>
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <span className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-blue-500 mt-1.5 shadow-lg shadow-blue-200 animate-pulse" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-wider">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {sortedNotifications.length > 0 && (
          <div className="px-5 py-4 bg-gradient-to-r from-gray-50 to-white border-t border-gray-100">
            <button className="w-full text-center text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-[0.2em] hover:scale-105 transition-all duration-300">
              View All Activity
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
