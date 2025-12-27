"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Booking, Partner, CounterOffer } from "@/lib/types"
import {
  ArrowRight,
  Check,
  X,
  Calendar,
  Clock,
  Users,
  MapPin,
  MessageSquare,
  AlertCircle,
  Gift,
  RefreshCw,
  Phone
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface CounterOfferResponseModalProps {
  isOpen: boolean
  onClose: () => void
  booking: (Booking & { partner?: Partner; counter_offer?: CounterOffer }) | null
  onAccept: (bookingId: string, offerId: string) => Promise<void>
  onDecline: (bookingId: string, offerId: string) => Promise<void>
}

export function CounterOfferResponseModal({
  isOpen,
  onClose,
  booking,
  onAccept,
  onDecline
}: CounterOfferResponseModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [action, setAction] = useState<'accept' | 'decline' | null>(null)

  if (!booking || !booking.counter_offer) return null

  const offer = booking.counter_offer
  const offerDetails = offer.offer_details

  const handleAccept = async () => {
    setIsLoading(true)
    setAction('accept')
    try {
      await onAccept(booking.id, offer.id)
      onClose()
    } catch (error) {
      console.error('Failed to accept counter-offer:', error)
    } finally {
      setIsLoading(false)
      setAction(null)
    }
  }

  const handleDecline = async () => {
    setIsLoading(true)
    setAction('decline')
    try {
      await onDecline(booking.id, offer.id)
      onClose()
    } catch (error) {
      console.error('Failed to decline counter-offer:', error)
    } finally {
      setIsLoading(false)
      setAction(null)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount)
  }

  const getOriginalDetails = () => {
    const details = booking.booking_details
    switch (booking.booking_type) {
      case 'hotel':
        return {
          line1: `${details.check_in} - ${details.check_out}`,
          line2: details.room_type,
          line3: formatCurrency(booking.total_amount)
        }
      case 'restaurant':
        return {
          line1: details.date,
          line2: details.time,
          line3: `${details.party_size} guests`
        }
      case 'yacht':
        return {
          line1: details.date,
          line2: details.duration,
          line3: `${details.passengers} passengers`
        }
      case 'activity':
        return {
          line1: details.date,
          line2: `${details.participants} participants`,
          line3: formatCurrency(booking.total_amount)
        }
      default:
        return {
          line1: details.date,
          line2: '',
          line3: formatCurrency(booking.total_amount)
        }
    }
  }

  const getOfferDetails = () => {
    switch (booking.booking_type) {
      case 'hotel':
        return {
          line1: offerDetails.check_in && offerDetails.check_out
            ? `${offerDetails.check_in} - ${offerDetails.check_out}`
            : `${booking.booking_details.check_in} - ${booking.booking_details.check_out}`,
          line2: offerDetails.room_type || booking.booking_details.room_type,
          line3: offerDetails.price ? formatCurrency(offerDetails.price) : formatCurrency(booking.total_amount),
          sweeteners: offerDetails.sweeteners || []
        }
      case 'restaurant':
        return {
          line1: offerDetails.date || booking.booking_details.date,
          line2: offerDetails.time_slot || booking.booking_details.time,
          line3: offerDetails.table_type || 'Indoor',
          sweeteners: offerDetails.complimentary || []
        }
      case 'yacht':
        return {
          line1: offerDetails.date || booking.booking_details.date,
          line2: offerDetails.duration || booking.booking_details.duration,
          line3: offerDetails.vessel || '',
          sweeteners: offerDetails.add_ons || []
        }
      case 'activity':
        return {
          line1: offerDetails.date || booking.booking_details.date,
          line2: offerDetails.time_slot_label || '',
          line3: offerDetails.price_per_person
            ? `${formatCurrency(offerDetails.price_per_person)}/person`
            : '',
          sweeteners: offerDetails.activity_add_ons || []
        }
      default:
        return {
          line1: '',
          line2: '',
          line3: '',
          sweeteners: []
        }
    }
  }

  const original = getOriginalDetails()
  const offered = getOfferDetails()

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none rounded-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header with Partner Image */}
        <div className="relative h-32 w-full bg-slate-100">
          <Image
            src={booking.partner?.logo || '/placeholder.jpg'}
            alt={booking.partner?.name || 'Partner'}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 backdrop-blur-sm transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute bottom-3 left-4">
            <Badge className="bg-blue-500 text-white border-none text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 mb-1">
              <RefreshCw className="h-3 w-3" />
              Counter-Offer
            </Badge>
            <h2 className="text-lg font-bold text-white">{booking.partner?.name}</h2>
          </div>
        </div>

        <div className="p-6 space-y-6 relative">
          {/* Northern Lights gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#135bec]/5 via-transparent to-[#10B981]/5 rounded-b-3xl pointer-events-none" />
          {/* Merchant's Note */}
          <div className="relative z-10 bg-white/60 backdrop-blur-md border border-yellow-200 rounded-2xl p-4 border-l-4 border-l-yellow-500">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                <MessageSquare className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-yellow-800 uppercase tracking-[0.2em] mb-1.5 flex items-center gap-2">
                  <span>Message from {booking.partner?.name || 'Merchant'}</span>
                </p>
                <p className="text-sm text-yellow-900 italic leading-relaxed">
                  "{offer.merchant_note || 'We have a suggestion for your booking.'}"
                </p>
              </div>
            </div>
          </div>

          {/* Comparison Section */}
          <div className="relative z-10 grid grid-cols-5 gap-3">
            {/* Original Request */}
            <div className="col-span-2 bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-gray-100/50">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">
                Your Request
              </h4>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">{original.line1}</p>
                {original.line2 && <p className="text-gray-600">{original.line2}</p>}
                {original.line3 && <p className="font-bold text-gray-900">{original.line3}</p>}
              </div>
            </div>

            {/* Arrow */}
            <div className="col-span-1 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center shadow-lg shadow-blue-100/50">
                <ArrowRight className="h-5 w-5 text-[#135bec]" />
              </div>
            </div>

            {/* Counter Offer */}
            <div className="col-span-2 bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-blue-100/50 border-l-4 border-l-[#135bec]">
              <h4 className="text-[10px] font-bold text-[#135bec] uppercase tracking-[0.2em] mb-3">
                Their Offer
              </h4>
              <div className="space-y-2 text-sm">
                <p className={cn(
                  offered.line1 !== original.line1 ? "text-[#135bec] font-medium" : "text-gray-600"
                )}>
                  {offered.line1}
                  {offered.line1 !== original.line1 && (
                    <Check className="inline h-3 w-3 ml-1" />
                  )}
                </p>
                {offered.line2 && (
                  <p className={cn(
                    offered.line2 !== original.line2 ? "text-[#135bec] font-medium" : "text-gray-600"
                  )}>
                    {offered.line2}
                    {offered.line2 !== original.line2 && (
                      <Check className="inline h-3 w-3 ml-1" />
                    )}
                  </p>
                )}
                {offered.line3 && (
                  <p className={cn(
                    "font-bold",
                    offered.line3 !== original.line3 ? "text-[#135bec]" : "text-gray-900"
                  )}>
                    {offered.line3}
                    {offered.line3 !== original.line3 && (
                      <Check className="inline h-3 w-3 ml-1" />
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sweeteners / Add-ons */}
          {offered.sweeteners && offered.sweeteners.length > 0 && (
            <div className="relative z-10 bg-white/60 backdrop-blur-md border border-green-200 rounded-2xl p-4 border-l-4 border-l-green-500">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Gift className="h-4 w-4 text-green-600" />
                </div>
                <h4 className="text-[10px] font-bold text-green-700 uppercase tracking-[0.2em]">
                  Included Extras
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {offered.sweeteners.map((item, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-green-100 text-green-700 border-green-200 text-xs px-3 py-1 rounded-full"
                  >
                    <Check className="h-3 w-3 mr-1.5" />
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Weather Backup (for yacht) */}
          {booking.booking_type === 'yacht' && offerDetails.weather_backup_date && (
            <div className="relative z-10 bg-white/60 backdrop-blur-md border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-slate-500" />
              <p className="text-sm text-slate-600">
                Weather backup date: <strong>{offerDetails.weather_backup_date}</strong>
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="relative z-10 space-y-3 pt-2">
            <Button
              onClick={handleAccept}
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-full font-bold text-sm shadow-lg shadow-green-200/50 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
            >
              {isLoading && action === 'accept' ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Accepting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Accept Offer
                </span>
              )}
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleDecline}
                disabled={isLoading}
                variant="outline"
                className="h-12 border-2 border-red-200 text-red-600 hover:bg-red-50 rounded-full font-bold text-sm hover:scale-105 active:scale-95 transition-all duration-300"
              >
                {isLoading && action === 'decline' ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                    Declining...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <X className="h-4 w-4" />
                    Decline
                  </span>
                )}
              </Button>

              <Button
                variant="outline"
                className="h-12 border-2 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-full font-bold text-sm hover:scale-105 active:scale-95 transition-all duration-300"
                onClick={() => {
                  // TODO: Open contact modal or WhatsApp
                  window.open(`tel:+639123456789`, '_blank')
                }}
              >
                <Phone className="h-4 w-4 mr-2" />
                Contact
              </Button>
            </div>
          </div>

          {/* Tip */}
          <p className="relative z-10 text-center text-[11px] text-gray-400 pt-2">
            Accepting will confirm your booking. Declining returns it to pending for further negotiation.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
