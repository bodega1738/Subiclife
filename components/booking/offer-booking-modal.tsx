"use client"

import * as React from "react"
import { useState } from "react"
import { Users, Clock, Info, CheckCircle } from "lucide-react"
import { GCashQRModal } from "@/components/payment/gcash-qr-modal"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Offer, Booking } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useUser, discountPercentages } from "@/lib/user-context"
import { useMockDBStore } from "@/lib/mock-db"
import { useToast } from "@/hooks/use-toast"

interface OfferBookingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  offer: Offer | null
}

export function OfferBookingModal({ open, onOpenChange, offer }: OfferBookingModalProps) {
  // Always render Dialog to avoid state timing issues where open=true but offer=null
  // Null offer shows loading state instead of early return

  const { user } = useUser()
  const addBooking = useMockDBStore((state) => state.addBooking)
  const addNotification = useMockDBStore((state) => state.addNotification)
  const { toast } = useToast()

  // --- GCash Modal State ---
  const [gcashModalOpen, setGcashModalOpen] = useState(false)
  const [submittedBookingDetails, setSubmittedBookingDetails] = useState<Record<string, unknown> | null>(null)
  const [createdBookingId, setCreatedBookingId] = useState<string | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // --- Form State ---

  // Hotels
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined)
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined)
  const [roomType, setRoomType] = useState<string>("standard")
  const [adults, setAdults] = useState<number>(1)
  const [children, setChildren] = useState<number>(0)

  // Activities
  const [activityDate, setActivityDate] = useState<Date | undefined>(undefined)
  const [participants, setParticipants] = useState<number>(1)

  // Water Sports
  const [duration, setDuration] = useState<string>("")
  const [passengers, setPassengers] = useState<number>(1)

  // Restaurants
  const [restaurantDate, setRestaurantDate] = useState<Date | undefined>(undefined)
  const [restaurantTime, setRestaurantTime] = useState<string>("")
  const [partySize, setPartySize] = useState<number>(2)

  // Shared
  const [specialRequests, setSpecialRequests] = useState<string>("")

  // --- Handlers ---

  const resetForm = () => {
    setCheckInDate(undefined)
    setCheckOutDate(undefined)
    setRoomType("standard")
    setAdults(1)
    setChildren(0)
    setActivityDate(undefined)
    setParticipants(1)
    setDuration("")
    setPassengers(1)
    setRestaurantDate(undefined)
    setRestaurantTime("")
    setPartySize(2)
    setSpecialRequests("")
    setShowSuccess(false)
  }

  const handleSubmit = async () => {
    if (!offer || !user) {
      toast({
        title: "Error",
        description: "Please log in to make a booking.",
        variant: "destructive"
      })
      return
    }

    // Basic Validation
    if (offer.category === 'hotels') {
      if (!checkInDate || !checkOutDate) {
        toast({
          title: "Validation Error",
          description: "Please select both check-in and check-out dates.",
          variant: "destructive"
        })
        return
      }
      if (checkOutDate <= checkInDate) {
        toast({
          title: "Validation Error",
          description: "Check-out date must be after check-in date.",
          variant: "destructive"
        })
        return
      }
    } else if (offer.category === 'activities') {
      if (!activityDate) {
        toast({
          title: "Validation Error",
          description: "Please select an activity date.",
          variant: "destructive"
        })
        return
      }
    } else if (offer.category === 'water-sports') {
      if (!duration) {
        toast({
          title: "Validation Error",
          description: "Please select a duration.",
          variant: "destructive"
        })
        return
      }
    } else if (offer.category === 'restaurants') {
      if (!restaurantDate || !restaurantTime) {
        toast({
          title: "Validation Error",
          description: "Please select a date and time.",
          variant: "destructive"
        })
        return
      }
    }

    setIsSubmitting(true)

    try {
      // Calculate pricing
      const originalPrice = offer.originalPrice || 0
      const discountPercent = discountPercentages[user.tier as keyof typeof discountPercentages] || 0
      const discountAmount = Math.round(originalPrice * (discountPercent / 100))
      const finalAmount = originalPrice - discountAmount

      // Build booking details based on category
      let bookingDetails: Record<string, unknown> = { special_requests: specialRequests }
      let bookingType: Booking['booking_type'] = 'service'

      switch (offer.category) {
        case 'hotels':
          bookingDetails = {
            check_in: checkInDate?.toISOString().split('T')[0],
            check_out: checkOutDate?.toISOString().split('T')[0],
            room_type: roomType,
            guests: { adults, children },
            special_requests: specialRequests
          }
          bookingType = 'hotel'
          break
        case 'activities':
          bookingDetails = {
            date: activityDate?.toISOString().split('T')[0],
            participants,
            special_requests: specialRequests
          }
          bookingType = 'activity'
          break
        case 'water-sports':
          bookingDetails = {
            date: new Date().toISOString().split('T')[0],
            duration,
            passengers,
            special_requests: specialRequests
          }
          bookingType = 'yacht'
          break
        case 'restaurants':
          bookingDetails = {
            date: restaurantDate?.toISOString().split('T')[0],
            time: restaurantTime,
            party_size: partySize,
            special_requests: specialRequests
          }
          bookingType = 'restaurant'
          break
        default:
          bookingDetails = { special_requests: specialRequests }
          bookingType = 'service'
      }

      // Create booking object
      const newBooking: Booking = {
        id: `booking-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        user_id: user.id,
        partner_id: offer.partnerId,
        booking_type: bookingType,
        booking_details: bookingDetails,
        status: 'pending',
        payment_status: 'pending',
        total_amount: originalPrice,
        discount_amount: discountAmount,
        final_amount: finalAmount,
        created_at: new Date().toISOString()
      }

      // Add booking to store
      addBooking(newBooking)

      // Add notification for partner (merchant)
      addNotification({
        id: `notif-${Date.now()}`,
        user_id: '', // Empty for partner notifications
        partner_id: offer.partnerId,
        type: 'new_booking',
        title: 'New Booking Request',
        message: `${user.name} has requested a booking for ${offer.title}`,
        read: false,
        created_at: new Date().toISOString()
      })

      // Store booking details and ID for GCash flow
      setSubmittedBookingDetails(bookingDetails)
      setCreatedBookingId(newBooking.id)

      // Open GCash modal for payment
      setGcashModalOpen(true)

      toast({
        title: "Booking Created!",
        description: "Please complete payment to confirm your booking.",
      })

    } catch (error) {
      console.error('Booking error:', error)
      toast({
        title: "Error",
        description: "Failed to submit booking. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
    <Dialog open={open} onOpenChange={(val) => {
      onOpenChange(val)
      if (!val) resetForm()
    }} modal={true}>
      {!offer ? (
        <DialogContent className="max-w-md rounded-3xl p-8 text-center z-[9999] fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
          <p className="text-gray-500">Loading offer details...</p>
        </DialogContent>
      ) : (
        <DialogContent
          suppressHydrationWarning
          className="max-w-2xl w-full rounded-3xl shadow-2xl border-0 bg-white p-6 sm:p-8 overflow-y-auto max-h-[90vh] z-[9999] fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#135bec]/10 via-transparent to-[#10B981]/8 rounded-3xl pointer-events-none -z-10" />

          {/* Offer Image */}
          <div className="relative w-full h-48 sm:h-64 mb-6 rounded-3xl overflow-hidden shadow-sm z-10">
            <img
              src={offer.image}
              alt={offer.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-100/50 z-10 mb-6">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className={cn(
              "text-2xl font-bold tracking-tight text-gray-900",
              offer.isEliteExclusive && "text-gradient-gold"
            )}>
              {offer.title}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 leading-relaxed font-medium">
              Booking at {offer.partnerName || "Our Premium Partner"}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-6 relative z-10">
          {/* --- Category Specific Forms --- */}

          {offer.category === 'hotels' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 rounded-3xl bg-gray-50/50 p-6 border border-gray-100 shadow-sm border-l-4 border-[#135bec]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Check-in Date</Label>
                  <div className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center">
                    <Calendar
                      mode="single"
                      selected={checkInDate}
                      onSelect={setCheckInDate}
                      className="rounded-lg"
                      disabled={(date) => date < new Date()}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Check-out Date</Label>
                  <div className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center">
                    <Calendar
                      mode="single"
                      selected={checkOutDate}
                      onSelect={setCheckOutDate}
                      className="rounded-lg"
                      disabled={(date) => (checkInDate ? date <= checkInDate : date < new Date())}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label id="room-type-label" htmlFor="room-type-select" className="text-sm font-medium text-gray-700">Room Type</Label>
                <Select value={roomType} onValueChange={setRoomType}>
                  <SelectTrigger id="room-type-select" aria-labelledby="room-type-label" className="w-full rounded-2xl border-gray-200 focus:ring-2 focus:ring-[#135bec]/30 focus:border-[#135bec] h-12 bg-white">
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-gray-100 shadow-xl">
                    <SelectItem value="standard">Standard Room</SelectItem>
                    <SelectItem value="deluxe">Deluxe Suite</SelectItem>
                    <SelectItem value="suite">Premium Suite</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adults-input" className="text-sm font-medium text-gray-700">Adults</Label>
                  <Input 
                    id="adults-input"
                    name="adults"
                    type="number" 
                    min={1} 
                    value={adults} 
                    onChange={(e) => setAdults(parseInt(e.target.value))}
                    className="rounded-2xl border-gray-200 focus:ring-2 focus:ring-[#135bec]/30 focus:border-[#135bec] h-12 bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="children-input" className="text-sm font-medium text-gray-700">Children</Label>
                  <Input 
                    id="children-input"
                    name="children"
                    type="number" 
                    min={0} 
                    value={children} 
                    onChange={(e) => setChildren(parseInt(e.target.value))}
                    className="rounded-2xl border-gray-200 focus:ring-2 focus:ring-[#135bec]/30 focus:border-[#135bec] h-12 bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {offer.category === 'activities' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 rounded-3xl bg-gray-50/50 p-6 border border-gray-100 shadow-sm border-l-4 border-[#135bec]">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Select Date</Label>
                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center max-w-sm mx-auto">
                  <Calendar
                    mode="single"
                    selected={activityDate}
                    onSelect={setActivityDate}
                    className="rounded-lg"
                    disabled={(date) => date < new Date()}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="participants-input" className="text-sm font-medium text-gray-700">Number of Participants</Label>
                <div className="relative group">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#135bec]/60 transition-all duration-300 group-hover:scale-110 group-hover:text-[#135bec]" />
                  <Input 
                    id="participants-input"
                    name="participants"
                    type="number" 
                    min={1} 
                    max={20}
                    value={participants} 
                    onChange={(e) => setParticipants(parseInt(e.target.value))}
                    className="pl-10 rounded-2xl border-gray-200 focus:ring-2 focus:ring-[#135bec]/30 focus:border-[#135bec] h-12 bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {offer.category === 'water-sports' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 rounded-3xl bg-gray-50/50 p-6 border border-gray-100 shadow-sm border-l-4 border-[#135bec]">
              <div className="space-y-2">
                <Label id="duration-label" htmlFor="duration-select" className="text-sm font-medium text-gray-700">Duration</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger id="duration-select" aria-labelledby="duration-label" className="w-full rounded-2xl border-gray-200 focus:ring-2 focus:ring-[#135bec]/30 focus:border-[#135bec] h-12 bg-white group">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#135bec]/60 transition-all duration-300 group-hover:scale-110 group-hover:text-[#135bec]" />
                      <SelectValue placeholder="Choose duration" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-gray-100 shadow-xl">
                    <SelectItem value="1h">1 Hour</SelectItem>
                    <SelectItem value="2h">2 Hours</SelectItem>
                    <SelectItem value="3h">3 Hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="passengers-input" className="text-sm font-medium text-gray-700">Number of Passengers</Label>
                <div className="relative group">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#135bec]/60 transition-all duration-300 group-hover:scale-110 group-hover:text-[#135bec]" />
                  <Input 
                    id="passengers-input"
                    name="passengers"
                    type="number" 
                    min={1} 
                    max={10}
                    value={passengers} 
                    onChange={(e) => setPassengers(parseInt(e.target.value))}
                    className="pl-10 rounded-2xl border-gray-200 focus:ring-2 focus:ring-[#135bec]/30 focus:border-[#135bec] h-12 bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {(offer.category !== 'hotels' && offer.category !== 'activities' && offer.category !== 'water-sports') && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500 rounded-3xl bg-gray-50/50 p-6 border border-gray-100 shadow-sm border-l-4 border-[#135bec]">
              <div className="p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-blue-100 flex gap-3 mb-2">
                <Info className="w-5 h-5 text-[#135bec]/60 shrink-0 mt-0.5 transition-all duration-300 group-hover:scale-110 group-hover:text-[#135bec]" />
                <p className="text-sm text-[#135bec]/80 leading-snug">
                  Tell us more about your preferred schedule or any specific requirements for this service.
                </p>
              </div>
            </div>
          )}

          {/* Shared: Special Requests */}
          <div className="space-y-2 rounded-3xl bg-gray-50/50 p-6 border border-gray-100 shadow-sm">
            <Label htmlFor="special-requests" className="text-sm font-medium text-gray-700 uppercase tracking-widest text-[11px]">
              {offer.category !== 'hotels' && offer.category !== 'activities' && offer.category !== 'water-sports'
                ? "Booking Details / Special Requests"
                : "Special Requests (Optional)"}
            </Label>
            <Textarea 
              id="special-requests"
              name="specialRequests"
              placeholder="Any specific needs or preferences?"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className={cn(
                "rounded-3xl border-gray-200 focus:ring-2 focus:ring-[#135bec]/30 focus:border-[#135bec] transition-all bg-white",
                offer.category !== 'hotels' && offer.category !== 'activities' && offer.category !== 'water-sports' 
                  ? "min-h-[150px]" 
                  : "min-h-[100px]"
              )}
            />
          </div>
        </div>

        {/* Success Overlay */}
        {showSuccess && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center z-50 rounded-3xl animate-in fade-in duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-in zoom-in duration-500">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Request Sent!</h3>
            <p className="text-sm text-gray-500 text-center max-w-[250px]">
              The partner will review your booking and respond soon.
            </p>
          </div>
        )}

        <DialogFooter className="mt-8 p-6 bg-gray-50/80 backdrop-blur-md border-t border-gray-100 rounded-b-3xl flex flex-col sm:flex-row gap-4 relative z-10">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="w-full sm:w-auto rounded-full border-gray-300 text-gray-700 px-8 h-12 hover:bg-gray-50 font-medium hover:scale-105 active:scale-95 transition-all duration-200"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || showSuccess}
            className="w-full sm:w-auto rounded-full bg-[#135bec] text-white px-10 h-12 font-semibold hover:bg-[#0e45b5] shadow-lg shadow-blue-200/50 hover:scale-105 hover:shadow-2xl hover:shadow-blue-300/50 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </span>
            ) : (
              'Send Request'
            )}
          </Button>
        </DialogFooter>
        </DialogContent>
      )}
    </Dialog>

    {/* GCash QR Modal */}
    <GCashQRModal
      open={gcashModalOpen}
      onOpenChange={(val) => {
        setGcashModalOpen(val)
        if (!val) {
          // Close booking modal and reset form when GCash modal closes
          onOpenChange(false)
          resetForm()
          setSubmittedBookingDetails(null)
          setCreatedBookingId(undefined)
        }
      }}
      offer={offer}
      bookingDetails={submittedBookingDetails || undefined}
      bookingId={createdBookingId}
    />
  </>
  )
}
