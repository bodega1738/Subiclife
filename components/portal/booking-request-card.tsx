'use strict'

import React from 'react'
import { Booking } from '@/lib/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, Edit, X, Calendar, Users, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BookingRequestCardProps {
  booking: Booking
  onAccept: (id: string) => void
  onCounter: (id: string) => void
  onDecline: (id: string) => void
}

export function BookingRequestCard({
  booking,
  onAccept,
  onCounter,
  onDecline
}: BookingRequestCardProps) {
  const { user, booking_details, created_at, total_amount, discount_amount, final_amount, partner } = booking
  const commissionRate = partner?.commission_rate || 0.1
  const commissionAmount = final_amount * commissionRate
  const netAmount = final_amount - commissionAmount

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMins = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMins < 60) return `${diffInMins} mins ago`
    const diffInHours = Math.floor(diffInMins / 60)
    if (diffInHours < 24) return `${diffInHours} hours ago`
    return date.toLocaleDateString()
  }

  const getTierColor = (tier: string | null | undefined) => {
    switch (tier?.toLowerCase()) {
      case 'elite':
        return 'bg-gradient-to-r from-blue-600 to-blue-700 text-white border-transparent'
      case 'premium':
        return 'bg-gradient-to-r from-green-600 to-green-700 text-white border-transparent'
      default:
        return 'bg-gray-600 text-white border-transparent'
    }
  }

  return (
    <div className="relative rounded-3xl border-l-4 border-[#135bec] p-5 sm:p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1)] bg-white overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
      <div className="absolute top-3 right-3">
        <span className="bg-gradient-to-r from-[#135bec] to-[#0e45b5] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-[0.15em] shadow-lg shadow-blue-200/50 animate-in zoom-in duration-200">
          NEW
        </span>
      </div>

      <div className="flex items-start gap-4 mb-6">
        <Avatar className="h-12 w-12 border-2 border-white shadow-lg">
          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} />
          <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900 truncate">{user?.name}</h3>
            <Badge variant="outline" className={cn("text-[9px] uppercase font-bold px-2 py-0.5 rounded-full tracking-[0.1em] shadow-sm", getTierColor(user?.tier))}>
              {user?.tier || 'Basic'}
            </Badge>
          </div>
          <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-1">
            <Clock className="w-3.5 h-3.5" />
            {formatTime(created_at)}
          </p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">Package</p>
          <h4 className="text-base font-bold text-gray-900">{booking_details.package_name}</h4>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {booking_details.check_in && (
            <div className="flex items-center gap-2.5 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-[#135bec]" />
              <span>{booking_details.check_in} - {booking_details.check_out}</span>
            </div>
          )}
          {booking_details.date && (
            <div className="flex items-center gap-2.5 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-[#135bec]" />
              <span>{booking_details.date} at {booking_details.time}</span>
            </div>
          )}
          {booking_details.guests && (
            <div className="flex items-center gap-2.5 text-sm text-gray-600">
              <Users className="w-4 h-4 text-[#135bec]" />
              <span>{booking_details.guests.adults} Adults, {booking_details.guests.children} Children</span>
            </div>
          )}
          {booking_details.party_size && (
            <div className="flex items-center gap-2.5 text-sm text-gray-600">
              <Users className="w-4 h-4 text-[#135bec]" />
              <span>Party of {booking_details.party_size}</span>
            </div>
          )}
          {booking_details.special_requests && (
            <p className="text-xs text-gray-600 italic mt-2 bg-yellow-50/80 backdrop-blur-sm p-3 rounded-2xl border border-yellow-100">
              "{booking_details.special_requests}"
            </p>
          )}
        </div>
      </div>

      <div className="border-t pt-4 mt-4 space-y-2 bg-gray-50/80 backdrop-blur-sm -mx-5 sm:-mx-6 px-5 sm:px-6 pb-4 rounded-b-2xl">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Package Rate</span>
          <span className="font-medium">₱{total_amount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Discount</span>
          <span className="text-red-600 font-medium">-₱{discount_amount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-100">
          <span className="font-semibold text-gray-700">Subtotal</span>
          <span className="text-green-600 font-bold">₱{final_amount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center text-[11px] text-gray-400">
          <span>Commission ({Math.round(commissionRate * 100)}%)</span>
          <span>-₱{commissionAmount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Your Net</span>
          <span className="text-xl font-black text-gray-900 leading-none">₱{netAmount.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <Button
          onClick={() => onAccept(booking.id)}
          className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white h-12 rounded-full font-bold gap-2 shadow-lg shadow-green-200/50 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
        >
          <CheckCircle className="w-4 h-4" />
          Accept
        </Button>
        <Button
          variant="outline"
          onClick={() => onCounter(booking.id)}
          className="flex-1 border-2 border-gray-200 hover:bg-gray-50 h-12 rounded-full font-bold gap-2 text-gray-700 hover:scale-105 active:scale-95 transition-all duration-300"
        >
          <Edit className="w-4 h-4" />
          Counter
        </Button>
        <Button
          variant="outline"
          onClick={() => onDecline(booking.id)}
          className="w-12 h-12 p-0 border-2 border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 rounded-full shrink-0 hover:scale-105 active:scale-95 transition-all duration-300"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
