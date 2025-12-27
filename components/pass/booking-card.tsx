'use client'

import { Booking, Partner, CounterOffer } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  RefreshCw, 
  MapPin, 
  Calendar,
  AlertCircle,
  MessageSquare,
  ChevronRight
} from 'lucide-react'
import Image from 'next/image'

interface BookingCardProps {
  booking: Booking & { partner?: Partner; counter_offer?: CounterOffer }
  onViewDetails: (id: string) => void
  onCancel: (id: string) => void
  onAcceptCounterOffer?: (bookingId: string, offerId: string) => void
  onDeclineCounterOffer?: (bookingId: string, offerId: string) => void
}

export function BookingCard({
  booking,
  onViewDetails,
  onCancel,
  onAcceptCounterOffer,
  onDeclineCounterOffer
}: BookingCardProps) {
  const getStatusConfig = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return { label: 'Confirmed', icon: CheckCircle, className: 'bg-green-100 text-green-700 border-green-200 shadow-green-200/50' }
      case 'pending':
        return { label: 'Pending', icon: Clock, className: 'bg-yellow-100 text-yellow-700 border-yellow-200 shadow-yellow-200/50' }
      case 'declined':
        return { label: 'Declined', icon: XCircle, className: 'bg-red-100 text-red-700 border-red-200 shadow-red-200/50' }
      case 'cancelled':
        return { label: 'Cancelled', icon: XCircle, className: 'bg-gray-100 text-gray-700 border-gray-200 shadow-gray-200/50' }
      case 'counter_offer_sent':
        return { label: 'Counter Offer', icon: RefreshCw, className: 'bg-blue-100 text-blue-700 border-blue-200 shadow-blue-200/50 animate-pulse' }
      case 'completed':
        return { label: 'Completed', icon: CheckCircle, className: 'bg-green-100 text-green-700 border-green-200 shadow-green-200/50' }
      default:
        return { label: status, icon: Clock, className: 'bg-gray-100 text-gray-700 border-gray-200' }
    }
  }

  const statusConfig = getStatusConfig(booking.status)
  const isCounterOffer = booking.status === 'counter_offer_sent'

  const getBookingDetailString = () => {
    const details = booking.booking_details
    switch (booking.booking_type) {
      case 'hotel':
        return `${details.check_in} - ${details.check_out} • ${details.room_type}`
      case 'restaurant':
        return `${details.date} at ${details.time} • ${details.party_size} guests`
      case 'yacht':
        return `${details.date} • ${details.duration} • ${details.passengers} pax`
      case 'activity':
        return `${details.date} • ${details.participants} participants`
      default:
        return `${details.date}`
    }
  }

  return (
    <Card className="overflow-hidden bg-white rounded-[2rem] border border-gray-100 shadow-[0_6px_24px_-2px_rgba(0,0,0,0.12)] transition-all duration-300 hover:shadow-[0_12px_32px_-4px_rgba(0,0,0,0.18)] hover:scale-[1.02] mb-6">
      <div className="p-5 sm:p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-4">
            <div className="relative h-20 w-20 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 shadow-inner after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/10 after:to-transparent">
              <Image
                src={booking.partner?.logo || '/placeholder.jpg'}
                alt={booking.partner?.name || 'Partner'}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 leading-tight mb-1">
                {booking.partner?.name || 'Partner'}
              </h3>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1.5">
                {booking.partner?.category}
              </p>
              <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-50 border border-gray-100">
                <p className="text-[10px] font-mono font-medium text-gray-400">
                  REF: {booking.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
            </div>
          </div>
          <Badge className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em] border backdrop-blur-sm bg-white/90 shadow-lg ${statusConfig.className}`}>
            <statusConfig.icon className="h-3.5 w-3.5" />
            {statusConfig.label}
          </Badge>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3 text-sm font-medium text-gray-600 bg-gray-50/50 p-3 rounded-2xl border border-gray-100/50">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <Calendar className="h-4 w-4 text-[#135bec]" />
            </div>
            <span>{getBookingDetailString()}</span>
          </div>

          <div className="flex justify-between items-center py-4 px-5 bg-gray-50/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-inner">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Final Amount</span>
            <div className="text-right">
              <span className="text-xl font-black text-gray-900 block tracking-tight">₱{booking.final_amount.toLocaleString()}</span>
              {booking.discount_amount > 0 && (
                <span className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                  Saved ₱{booking.discount_amount.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {isCounterOffer && (
          <div className="mb-6 p-5 bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl border-l-4 border-l-blue-500 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <RefreshCw className="w-24 h-24 text-blue-500" />
            </div>
            <div className="relative z-10">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 mb-1">Counter-Offer Received</p>
                  <p className="text-sm text-blue-900 italic font-medium leading-relaxed">"{booking.counter_offer?.merchant_note}"</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  size="sm"
                  className="h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-full text-xs font-bold shadow-lg shadow-green-200/50 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
                  onClick={() => {
                    if (booking.counter_offer?.id) {
                      onAcceptCounterOffer?.(booking.id, booking.counter_offer.id)
                    }
                  }}
                  disabled={!booking.counter_offer?.id}
                >
                  Accept Offer
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-12 border-2 border-red-200 text-red-600 hover:bg-red-50 rounded-full text-xs font-bold hover:scale-105 active:scale-95 transition-all duration-300"
                  onClick={() => {
                    if (booking.counter_offer?.id) {
                      onDeclineCounterOffer?.(booking.id, booking.counter_offer.id)
                    }
                  }}
                  disabled={!booking.counter_offer?.id}
                >
                  Decline
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-4 gap-3 pt-2">
          <Button
            variant="outline"
            className="col-span-2 h-12 rounded-full text-xs font-bold border-2 border-gray-100 text-gray-700 hover:bg-gray-50 hover:border-gray-200 hover:scale-[1.02] active:scale-95 transition-all duration-300 group"
            onClick={() => onViewDetails(booking.id)}
          >
            View Details
            <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </Button>
          <Button
            variant="outline"
            className="h-12 rounded-full border-2 border-gray-100 text-gray-500 hover:text-[#135bec] hover:border-blue-100 hover:bg-blue-50 hover:rotate-6 active:scale-95 transition-all duration-300"
            title="Get Directions"
          >
            <MapPin className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            className="h-12 rounded-full border-2 border-gray-100 text-gray-500 hover:text-[#135bec] hover:border-blue-100 hover:bg-blue-50 hover:rotate-6 active:scale-95 transition-all duration-300"
            title="Contact"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
          {(booking.status === 'pending' || booking.status === 'confirmed') && (
            <Button
              variant="ghost"
              className="col-span-4 h-10 mt-1 text-[10px] text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full font-bold uppercase tracking-widest hover:scale-[1.01] active:scale-95 transition-all duration-300"
              onClick={() => onCancel(booking.id)}
            >
              Cancel Booking
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
