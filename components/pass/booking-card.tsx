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
    <Card className="group relative overflow-hidden bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] mb-6">
      {/* Status Strip */}
      <div className={`absolute top-0 left-0 w-1.5 h-full ${statusConfig.className.replace('bg-', 'bg-').split(' ')[0]}`} />
      
      <div className="p-6">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-4">
            <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-gray-50 shadow-sm ring-1 ring-black/5">
              <Image
                src={booking.partner?.logo || '/placeholder.jpg'}
                alt={booking.partner?.name || 'Partner'}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className={`h-5 px-2 rounded-full text-[9px] font-bold uppercase tracking-widest border-0 ${statusConfig.className}`}>
                  {statusConfig.label}
                </Badge>
                <span className="text-[10px] font-mono font-medium text-gray-300">
                  #{booking.id.slice(0, 8).toUpperCase()}
                </span>
              </div>
              <h3 className="font-bold text-lg text-gray-900 leading-tight tracking-tight">
                {booking.partner?.name || 'Partner'}
              </h3>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mt-0.5">
                {booking.partner?.category}
              </p>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Date & Time</p>
            <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className="truncate">{getBookingDetailString()}</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Amount</p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-gray-900">₱{booking.final_amount.toLocaleString()}</span>
              {booking.discount_amount > 0 && (
                <Badge variant="secondary" className="bg-green-50 text-green-600 hover:bg-green-100 text-[10px] px-1.5 h-4">
                  -₱{booking.discount_amount.toLocaleString()}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {isCounterOffer && (
          <div className="mb-6 p-5 bg-blue-50/50 rounded-2xl border border-blue-100 relative overflow-hidden group/offer">
            <div className="absolute -right-4 -top-4 opacity-[0.05] group-hover/offer:opacity-10 transition-opacity">
              <RefreshCw className="w-24 h-24 text-blue-600" />
            </div>
            
            <div className="flex items-start gap-3 mb-4 relative z-10">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 shadow-sm text-blue-600">
                <AlertCircle className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600 mb-1">Action Required</p>
                <p className="text-sm text-gray-700 italic font-medium leading-relaxed">"{booking.counter_offer?.merchant_note}"</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 relative z-10">
              <Button
                size="sm"
                className="h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold shadow-lg shadow-blue-200 transition-all hover:scale-[1.02]"
                onClick={() => {
                  if (booking.counter_offer?.id) {
                    onAcceptCounterOffer?.(booking.id, booking.counter_offer.id)
                  }
                }}
              >
                Accept Offer
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-10 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-full text-xs font-bold transition-all hover:scale-[1.02]"
                onClick={() => {
                  if (booking.counter_offer?.id) {
                    onDeclineCounterOffer?.(booking.id, booking.counter_offer.id)
                  }
                }}
              >
                Decline
              </Button>
            </div>
          </div>
        )}

        {/* Action Footer */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            className="flex-1 h-12 rounded-full bg-gray-900 text-white hover:bg-gray-800 shadow-lg shadow-gray-200 font-semibold text-sm tracking-tight transition-all hover:scale-[1.02] active:scale-95"
            onClick={() => onViewDetails(booking.id)}
          >
            View Details
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full border-gray-100 text-gray-500 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50 transition-all hover:rotate-6"
              title="Get Directions"
            >
              <MapPin className="h-5 w-5" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full border-gray-100 text-gray-500 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50 transition-all hover:rotate-6"
              title="Contact"
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Secondary Actions */}
        {(booking.status === 'pending' || booking.status === 'confirmed') && (
          <div className="mt-4 pt-4 border-t border-gray-50 flex justify-center">
            <Button
              variant="ghost"
              className="h-auto py-1 px-4 text-[10px] text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full font-bold uppercase tracking-widest transition-colors"
              onClick={() => onCancel(booking.id)}
            >
              Cancel Booking
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
