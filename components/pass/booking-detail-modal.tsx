"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Booking, Partner } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Phone,
  MessageSquare,
  Info,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  X,
  History,
  CalendarPlus,
  Ban,
  QrCode
} from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/lib/user-context"
import { MemberQRCode } from "@/components/pass/member-qr-code"
import { BookingStatusTimeline } from "@/components/booking/booking-status-timeline"

interface BookingDetailModalProps {
  isOpen: boolean
  onClose: () => void
  booking: (Booking & { partner?: Partner }) | null
}

export function BookingDetailModal({ isOpen, onClose, booking }: BookingDetailModalProps) {
  const { toast } = useToast()
  const { user } = useUser()
  const [showQRCode, setShowQRCode] = useState(false)

  if (!booking) return null

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Booking reference copied to clipboard.",
    })
  }

  const getStatusConfig = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return { label: 'Confirmed', className: 'bg-green-100 text-green-700' }
      case 'pending':
        return { label: 'Pending', className: 'bg-yellow-100 text-yellow-700' }
      case 'declined':
        return { label: 'Declined', className: 'bg-red-100 text-red-700' }
      case 'cancelled':
        return { label: 'Cancelled', className: 'bg-gray-100 text-gray-700' }
      case 'counter_offer_sent':
        return { label: 'Counter Offer', className: 'bg-blue-100 text-blue-700' }
      case 'completed':
        return { label: 'Completed', className: 'bg-green-100 text-green-700' }
      default:
        return { label: status, className: 'bg-gray-100 text-gray-700' }
    }
  }

  const statusConfig = getStatusConfig(booking.status)

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="relative h-48 w-full bg-slate-100">
          <Image
            src={booking.partner?.logo || '/placeholder.jpg'}
            alt={booking.partner?.name || 'Partner'}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 backdrop-blur-sm transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="absolute bottom-4 left-6 right-6">
            <h2 className="text-xl font-bold text-white mb-1">{booking.partner?.name}</h2>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-[10px] uppercase tracking-wider">
              {booking.partner?.category}
            </Badge>
          </div>
        </div>

        <div className="p-6 space-y-8 relative">
          {/* Northern Lights gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#135bec]/5 via-transparent to-[#10B981]/5 pointer-events-none" />
          <div className="relative z-10 flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Booking Status</p>
              <Badge className={`${statusConfig.className} px-3 py-1 rounded-full border-none font-bold text-xs backdrop-blur-sm`}>
                {statusConfig.label}
              </Badge>
            </div>
            <div className="text-right space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Reference</p>
              <button
                onClick={() => copyToClipboard(booking.id)}
                className="flex items-center gap-1.5 text-sm font-mono font-bold text-slate-900 hover:text-[#135bec] transition-all duration-300 hover:scale-105"
              >
                {booking.id.slice(0, 12).toUpperCase()}
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/60 backdrop-blur-md rounded-2xl border border-slate-100/50 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-[#135bec]" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Date</span>
              </div>
              <p className="text-sm font-bold text-slate-900">
                {booking.booking_details.date || booking.booking_details.check_in || 'No date set'}
              </p>
            </div>
            {booking.booking_type === 'hotel' ? (
              <div className="p-4 bg-white/60 backdrop-blur-md rounded-2xl border border-slate-100/50 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-[#135bec]" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Check-out</span>
                </div>
                <p className="text-sm font-bold text-slate-900">{booking.booking_details.check_out}</p>
              </div>
            ) : (
              <div className="p-4 bg-white/60 backdrop-blur-md rounded-2xl border border-slate-100/50 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-[#135bec]" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Time</span>
                </div>
                <p className="text-sm font-bold text-slate-900">{booking.booking_details.time || 'N/A'}</p>
              </div>
            )}
          </div>

          <div className="relative z-10 space-y-4">
            <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
              <Info className="h-4 w-4 text-[#135bec]" />
              Booking Information
            </h3>
            <div className="space-y-3 bg-white/60 backdrop-blur-md p-5 rounded-2xl border border-slate-100/50 shadow-sm">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Booking Type</span>
                <span className="font-semibold text-slate-900 capitalize">{booking.booking_type}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Capacity/Guests</span>
                <span className="font-semibold text-slate-900">
                  {booking.booking_details.party_size || 
                   booking.booking_details.guests?.adults || 
                   booking.booking_details.participants || 
                   booking.booking_details.passengers || 1}
                </span>
              </div>
              {booking.booking_details.special_requests && (
                <div className="pt-3 border-t border-slate-200 mt-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] block mb-2">Special Requests</span>
                  <p className="text-xs text-slate-600 bg-yellow-50/80 backdrop-blur-sm p-3 rounded-2xl border border-yellow-100 italic leading-relaxed">
                    "{booking.booking_details.special_requests}"
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="relative z-10 space-y-4">
            <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-[#135bec]" />
              Payment Summary
            </h3>
            <div className="space-y-3 bg-white/60 backdrop-blur-md p-5 rounded-2xl border border-slate-100/50 shadow-sm">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Standard Price</span>
                <span className="text-slate-900 font-medium">₱{booking.total_amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Member Discount</span>
                <span className="text-green-600 font-medium">-₱{booking.discount_amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Total Charged</span>
                <span className="text-lg font-black text-[#135bec]">₱{booking.final_amount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 space-y-4">
            <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
              <History className="h-4 w-4 text-[#135bec]" />
              Booking Timeline
            </h3>
            <BookingStatusTimeline booking={booking} />
          </div>

          <div className="relative z-10 space-y-4">
            <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#135bec]" />
              Utility Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-12 rounded-full gap-2 text-xs font-bold border-2 border-slate-200 hover:scale-105 active:scale-95 transition-all duration-300" onClick={() => toast({ title: "Coming Soon", description: "Add to Calendar will be available soon." })}>
                <CalendarPlus className="h-4 w-4" />
                Add to Calendar
              </Button>
              <Button variant="outline" className="h-12 rounded-full gap-2 text-xs font-bold border-2 border-slate-200 hover:scale-105 active:scale-95 transition-all duration-300" onClick={() => toast({ title: "Contact Support", description: "Connecting to support chat..." })}>
                <MessageSquare className="h-4 w-4" />
                Contact Support
              </Button>
            </div>
          </div>

          <div className="relative z-10 flex flex-col gap-3 pt-4">
            {/* Show QR Code button for confirmed bookings */}
            {booking.status === 'confirmed' && (
              <Button
                onClick={() => setShowQRCode(true)}
                className="h-12 w-full bg-gradient-to-r from-[#135bec] to-[#0e45b5] hover:from-[#0e45b5] hover:to-[#0a3696] rounded-full gap-2 text-sm font-bold shadow-lg shadow-blue-200/50 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <QrCode className="h-5 w-5" />
                Show Check-in QR Code
              </Button>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Button className="h-12 bg-gradient-to-r from-[#135bec] to-[#0e45b5] hover:from-[#0e45b5] hover:to-[#0a3696] rounded-full gap-2 text-xs font-bold shadow-lg shadow-blue-200/50 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300">
                <MapPin className="h-4 w-4" />
                Directions
              </Button>
              <Button variant="outline" className="h-12 rounded-full gap-2 text-xs font-bold border-2 border-slate-200 hover:scale-105 active:scale-95 transition-all duration-300">
                <Phone className="h-4 w-4" />
                Call Partner
              </Button>
            </div>
            <Button variant="outline" className="h-12 w-full rounded-full gap-2 text-xs font-bold border-2 border-slate-200 text-slate-600 hover:scale-105 active:scale-95 transition-all duration-300">
              <ExternalLink className="h-4 w-4" />
              Download Confirmation
            </Button>
          </div>
        </div>
      </DialogContent>

      {/* Member QR Code Modal */}
      <MemberQRCode
        isOpen={showQRCode}
        onClose={() => setShowQRCode(false)}
        user={user}
        booking={booking}
      />
    </Dialog>
  )
}
