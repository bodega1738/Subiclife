"use client"

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { Shield, Maximize2, X, Anchor, Hotel, CreditCard, Star, RefreshCw, AlertTriangle, ChevronRight, Calendar, History, Wallet, Clock, Activity, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUser, discountPercentages } from "@/lib/user-context"
import { useMockDBStore } from "@/lib/mock-db"
import { QRCodeSVG } from "qrcode.react"
import { BFFButton } from "./bff-button"
import { BookingCard } from "@/components/pass/booking-card"
import { BookingDetailModal } from "@/components/pass/booking-detail-modal"
import { CancelBookingModal } from "@/components/pass/cancel-booking-modal"
import { CounterOfferResponseModal } from "@/components/booking/counter-offer-response-modal"
import { PointsHistory } from "@/components/pass/points-history"
import { ActivityTimeline } from "@/components/pass/activity-timeline"
import { acceptCounterOffer, declineCounterOffer, cancelBooking } from "@/lib/supabase-actions"
import { useToast } from "@/hooks/use-toast"
import { Booking, Partner, CounterOffer } from "@/lib/types"

const tierStyles = {
  starter: {
    background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", 
    accent: "bg-blue-500",
    label: "STARTER MEMBER",
    color: "text-blue-400",
    border: "border-blue-500/30"
  },
  basic: {
    background: "linear-gradient(135deg, #14532d 0%, #052e16 100%)",
    accent: "bg-green-500",
    label: "BASIC MEMBER",
    color: "text-green-400",
    border: "border-green-500/30"
  },
  premium: {
    background: "linear-gradient(135deg, #431407 0%, #2a0a04 100%)",
    accent: "bg-orange-500",
    label: "PREMIUM MEMBER",
    color: "text-orange-400",
    border: "border-orange-500/30"
  },
  elite: {
    background: "linear-gradient(135deg, #020617 0%, #000000 100%)",
    accent: "bg-amber-400",
    label: "ELITE MEMBER",
    color: "text-amber-400",
    border: "border-amber-500/50"
  },
}

const tierPricing = {
  starter: { price: "₱0", discount: 5, insurance: 25000 },
  basic: { price: "₱550", discount: 10, insurance: 100000 },
  premium: { price: "₱5,500", discount: 15, insurance: 500000 },
  elite: { price: "₱25,500", discount: 20, insurance: 1000000 },
}

export function MembershipPass() {
  const { user } = useUser()
  const { toast } = useToast()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [validity, setValidity] = useState(30)
  const [qrValue, setQrValue] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)
  const [activeTab, setActiveTab] = useState("card")
  
  // Bookings Sub-Tabs
  const [activeBookingSubTab, setActiveBookingSubTab] = useState("upcoming")

  // Booking state
  const [selectedBooking, setSelectedBooking] = useState<(Booking & { partner?: Partner; counter_offer?: CounterOffer }) | null>(null)
  const [showBookingDetail, setShowBookingDetail] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showCounterOfferModal, setShowCounterOfferModal] = useState(false)

  // Get raw data from store - stable references
  const allBookings = useMockDBStore((state) => state.bookings)
  const partners = useMockDBStore((state) => state.partners)
  const counterOffers = useMockDBStore((state) => state.counter_offers)
  const allNotifications = useMockDBStore((state) => state.notifications)
  
  const updateBooking = useMockDBStore((state) => state.updateBooking)
  const addNotification = useMockDBStore((state) => state.addNotification)

  // Memoize filtered and enriched bookings
  const enrichedBookings = useMemo(() => {
    const filtered = allBookings.filter(b => b.user_id === user?.id)
    return filtered.map(booking => ({
      ...booking,
      partner: partners.find(p => p.id === booking.partner_id),
      counter_offer: counterOffers.find(o => o.booking_id === booking.id && o.status === 'pending')
    })).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }, [allBookings, partners, counterOffers, user?.id])

  // Filter Bookings for Sub-Tabs
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcomingBookings = useMemo(() => enrichedBookings.filter(b => {
    const bookingDateStr = b.booking_details.date || b.booking_details.check_in
    if (!bookingDateStr) return false
    const bookingDate = new Date(bookingDateStr)
    bookingDate.setHours(0, 0, 0, 0)
    return b.status === 'confirmed' && bookingDate >= today
  }), [enrichedBookings])

  const pendingBookings = useMemo(() => enrichedBookings.filter(b => 
    ['pending', 'counter_offer_sent'].includes(b.status)
  ), [enrichedBookings])

  const historyBookings = useMemo(() => enrichedBookings.filter(b => {
    const bookingEndDateStr = b.booking_details.date || b.booking_details.check_out
    if (!bookingEndDateStr) return ['completed', 'cancelled', 'declined'].includes(b.status)
    const bookingEndDate = new Date(bookingEndDateStr)
    bookingEndDate.setHours(0, 0, 0, 0)
    const isPastDate = bookingEndDate < today
    return isPastDate || ['completed', 'cancelled', 'declined'].includes(b.status)
  }), [enrichedBookings])

  // Memoize Activities
  const activities = useMemo(() => {
    return allNotifications
      .filter(n => n.user_id === user?.id && ['booking_confirmed', 'check_in', 'points_earned', 'tier_upgraded'].includes(n.type))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10)
  }, [allNotifications, user?.id])

  const cardRef = useRef<HTMLDivElement>(null)

  // Handlers
  const handleAcceptCounterOffer = async (bookingId: string, offerId: string) => {
    if (!selectedBooking) return
    try {
      await acceptCounterOffer(bookingId, offerId, user?.id || '', selectedBooking.partner_id)
      toast({ title: "Offer Accepted!", description: "Your booking is now confirmed." })
      setShowCounterOfferModal(false)
    } catch (error) {
      toast({ title: "Error", description: "Failed to accept offer.", variant: "destructive" })
    }
  }

  const handleDeclineCounterOffer = async (bookingId: string, offerId: string) => {
    if (!selectedBooking) return
    try {
      await declineCounterOffer(bookingId, offerId, user?.id || '', selectedBooking.partner_id)
      toast({ title: "Offer Declined", description: "The partner will be notified." })
      setShowCounterOfferModal(false)
    } catch (error) {
      toast({ title: "Error", description: "Failed to decline offer.", variant: "destructive" })
    }
  }

  const handleCancelBooking = async (reason: string, note?: string) => {
    if (!selectedBooking) return
    try {
      updateBooking(selectedBooking.id, { status: 'cancelled' })
      addNotification({
        id: `notif-${Date.now()}`,
        user_id: user?.id || '',
        partner_id: selectedBooking.partner_id,
        type: 'booking_cancelled',
        title: 'Booking Cancelled',
        message: `${user?.name} has cancelled their booking. Reason: ${reason}`,
        read: false,
        created_at: new Date().toISOString()
      })
      toast({ title: "Booking Cancelled", description: "The partner has been notified." })
      setShowCancelModal(false)
      setShowBookingDetail(false)
    } catch (error) {
      toast({ title: "Error", description: "Failed to cancel booking.", variant: "destructive" })
    }
  }

  // QR Code Logic
  useEffect(() => {
    const generateQR = () => {
      setIsRefreshing(true)
      const timestamp = Date.now()
      const code = `SL:${user?.member_id || "DEMO"}:${timestamp}`
      setQrValue(code)
      setValidity(30)
      setTimeout(() => setIsRefreshing(false), 200)
    }

    generateQR()
    const interval = setInterval(() => {
      setValidity((prev) => {
        if (prev <= 1) {
          generateQR()
          return 30
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [user?.member_id])

  // Mouse tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    card.style.setProperty("--tilt-x", `${x * 0.01}deg`)
    card.style.setProperty("--tilt-y", `${-y * 0.01}deg`)
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.setProperty("--tilt-x", "0deg")
    cardRef.current.style.setProperty("--tilt-y", "0deg")
  }

  // Scroll Shadow Effect - Disabled to allow gradient to show through
  /*
  useEffect(() => {
    const handleScroll = () => {
      const tabsList = document.getElementById('sticky-tabs-list')
      if (tabsList) {
        if (window.scrollY > 20) {
          tabsList.classList.add('shadow-md', 'bg-white/95')
          tabsList.classList.remove('bg-[#F9FAFB]', 'shadow-none')
        } else {
          tabsList.classList.remove('shadow-md', 'bg-white/95')
          tabsList.classList.add('bg-[#F9FAFB]', 'shadow-none')
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  */


  const tier = user?.tier || "starter"
  const style = tierStyles[tier as keyof typeof tierStyles] || tierStyles.starter
  const pricing = tierPricing[tier as keyof typeof tierPricing] || tierPricing.starter
  const discount = discountPercentages[tier] || 5
  
  const validUntilDate = user?.validUntil ? new Date(user.validUntil) : new Date()
  const validUntilStr = validUntilDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
  
  const daysUntilExpiry = Math.ceil((validity > 0 ? validUntilDate.getTime() - Date.now() : 0) / (1000 * 60 * 60 * 24))
  const isExpiringSoon = daysUntilExpiry < 30

  // Pass Card Component
  const PassCard = ({ className = "" }: { className?: string }) => (
    <div
      className={`relative w-full aspect-[3/4] sm:aspect-[1.4/1] max-w-sm mx-auto perspective-1500 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div 
        ref={cardRef}
        className="w-full h-full relative transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] preserve-3d cursor-pointer active:scale-[0.98]"
        style={{ 
          transform: `perspective(1000px) rotateX(var(--tilt-y, 0deg)) rotateY(calc(${isFlipped ? 180 : 0}deg + var(--tilt-x, 0deg)))` 
        }}
      >
        {/* FRONT FACE */}
        <Card className={`absolute inset-0 w-full h-full backface-hidden overflow-hidden rounded-[2.5rem] border border-white/20 bg-gray-900/40 backdrop-blur-2xl shadow-premium transition-shadow duration-300`}>
          {/* Gray Glassmorphic Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-500/10 via-gray-700/5 to-transparent" />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.05] mix-blend-overlay" />
          
          {/* Reflective light effect */}
          <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-white/10 via-transparent to-transparent rotate-12 pointer-events-none" />

          <CardContent className="relative h-full flex flex-col p-8 z-10">
             {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <Shield className="w-4 h-4 text-white/80" />
                </div>
                <span className="text-[10px] font-bold text-white/40 tracking-[0.3em] uppercase">Subic.Life</span>
              </div>
              <Badge className="bg-white/10 hover:bg-white/20 text-white border-white/10 text-[9px] px-3 py-1 rounded-full backdrop-blur-md tracking-wider">
                {tier.toUpperCase()}
              </Badge>
            </div>

            {/* Member Info */}
            <div>
              <h2 className="text-3xl font-sans font-bold text-white tracking-tight leading-tight">
                {user?.name || "Guest"}
              </h2>
              <div className="flex items-center gap-3 mt-2">
                <p className="text-[10px] font-mono text-white/40 tracking-[0.2em]">
                  {user?.member_id || "SL-2025-DEMO-0000"}
                </p>
                <div className="h-px w-8 bg-white/10" />
                <p className="text-[9px] font-bold text-white/60 tracking-wider">
                  MEMBER SINCE 2025
                </p>
              </div>
              {isExpiringSoon && (
                <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-200 text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-sm mt-4 border border-amber-500/20">
                  <AlertTriangle className="w-3 h-3" />
                  RENEW SOON
                </div>
              )}
            </div>

            {/* QR Code Section */}
            <div className="flex flex-col items-center mt-auto">
              <div className="relative group">
                <div className="absolute -inset-4 bg-white/5 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="bg-white/95 rounded-2xl p-4 shadow-2xl relative">
                  <QRCodeSVG value={qrValue} size={160} level="H" bgColor="#FFFFFF" fgColor="#111318" />
                </div>
              </div>

              {/* Minimal Timer */}
              <div className="w-[160px] mt-6">
                <div className="h-[1.5px] w-full bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                  <div
                    className={`h-full transition-all duration-[800ms] ease-out ${
                      validity < 10 ? 'bg-red-400' :
                      validity < 20 ? 'bg-amber-400' :
                      'bg-white/40'
                    }`}
                    style={{ width: `${(validity / 30) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between items-center mt-2 px-1">
                  <p className={`text-[9px] font-mono transition-all duration-500 ${
                    validity < 10 ? 'text-red-300' : 'text-white/20'
                  }`}>
                    SECURE_KEY
                  </p>
                  <p className={`text-[9px] font-mono transition-all duration-500 ${
                    validity < 10 ? 'text-red-300' : 'text-white/40'
                  }`}>
                    {validity}s
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* BACK FACE */}
        <Card
          className="absolute inset-0 w-full h-full backface-hidden overflow-hidden rounded-[1.5rem] border-0 bg-white/90 backdrop-blur-xl shadow-[0_8px_40px_-8px_rgba(0,0,0,0.15)]"
          style={{ transform: "rotateY(180deg)" }}
        >
           {/* Subtle gradient overlay */}
           <div className="absolute inset-0 bg-gradient-to-br from-[#135bec]/5 to-transparent pointer-events-none" />
           
          <CardContent className="h-full flex flex-col p-6 overflow-y-auto relative z-10">
             <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Pass Details</h3>
                <Badge variant="outline" className="text-[10px] tracking-[0.2em] uppercase font-medium bg-green-50 text-green-700 border-green-200">
                  Active
                </Badge>
             </div>

             <div className="space-y-6">
                <div className="space-y-3">
                   <h4 className="text-[10px] text-slate-400 font-[600] tracking-[0.2em] uppercase">Coverage</h4>
                   <div className="flex items-center gap-3 group">
                      <div className="transition-transform duration-300 group-hover:scale-110">
                        <Shield className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">₱{pricing.insurance.toLocaleString()}</p>
                        <p className="text-xs text-slate-500">Accidental Insurance</p>
                      </div>
                   </div>
                </div>

                <div className="space-y-3">
                   <h4 className="text-[10px] text-slate-400 font-[600] tracking-[0.2em] uppercase">Benefits</h4>
                   <div className="flex items-center gap-3 group">
                      <div className="transition-transform duration-300 group-hover:scale-110">
                        <CreditCard className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{discount}% Discount</p>
                        <p className="text-xs text-slate-500">At 50+ Partner Merchants</p>
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-3 group">
                      <div className="transition-transform duration-300 group-hover:scale-110">
                        <Star className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{user?.points || 0} Points</p>
                        <p className="text-xs text-slate-500">Earn 1pt per ₱100 spend</p>
                      </div>
                   </div>
                </div>

                {isExpiringSoon && (
                  <div className="p-3 bg-red-50 rounded-xl border border-red-100 flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-red-700">Membership Expiring</p>
                      <p className="text-xs text-red-600 mt-1">
                        Your pass expires in {daysUntilExpiry} days. Renew now to keep your benefits.
                      </p>
                      <Button size="sm" variant="link" className="px-0 text-red-700 h-auto mt-2 text-xs font-bold flex items-center hover:translate-x-1 transition-transform">
                        Renew Membership <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
             </div>

             <div className="mt-auto pt-6 text-center">
               <p className="text-[10px] text-slate-400">
                 Valid until {validUntilStr}
               </p>
               <p className="text-[9px] text-slate-300 mt-1">
                 Terms and conditions apply. Not transferable.
               </p>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
        <button
          onClick={() => setIsFullscreen(false)}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/20 text-white hover:rotate-90 transition-all duration-300"
        >
          <X className="w-8 h-8" />
        </button>
        <PassCard className="scale-[1.15] sm:scale-[1.3]" />
        <p className="text-white/40 text-xs mt-8 font-medium tracking-widest uppercase">
          Tap card to flip • Press ESC to close
        </p>
      </div>
    )
  }


  return (
    <div className="min-h-screen pb-24 relative overflow-hidden">
      {/* Liquid Gold Flag Animated Background */}
      <div className="fixed inset-0 -z-10 bg-liquid-gold" />

      {/* Sticky Tab List - Fully Integrated */}
      <div className="sticky top-0 z-40 px-6 pt-6 pb-3 -mx-0 transition-all duration-300" id="sticky-tabs-list">
        <div className="max-w-md mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="inline-flex items-center w-full bg-transparent rounded-full p-1.5 h-12 border-0 shadow-none overflow-hidden gap-2">
              <TabsTrigger
                value="card"
                className="flex-1 rounded-full h-full text-xs font-bold uppercase tracking-wide transition-all duration-200 data-[state=active]:bg-[#1a1a1c] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:text-slate-700 data-[state=inactive]:hover:text-slate-900"
              >
                Card
              </TabsTrigger>
              <TabsTrigger
                value="bookings"
                className="flex-1 rounded-full h-full text-xs font-bold uppercase tracking-wide transition-all duration-200 data-[state=active]:bg-[#1a1a1c] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:text-slate-700 data-[state=inactive]:hover:text-slate-900 relative"
              >
                Bookings
                {pendingBookings.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-white" />
                )}
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="flex-1 rounded-full h-full text-xs font-bold uppercase tracking-wide transition-all duration-200 data-[state=active]:bg-[#1a1a1c] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:text-slate-700 data-[state=inactive]:hover:text-slate-900"
              >
                Points
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 pt-4">
        {/* My Card Tab */}
        {activeTab === "card" && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 fade-in">
            {/* Membership Card */}
            <div>
              <PassCard />
            </div>

            {/* Quick Stats - Glassmorphic */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-3.5 text-center border border-white/40 shadow-premium">
                <p className="text-[10px] text-gray-500 font-bold mb-1 uppercase tracking-[0.2em]">Tier</p>
                <p className="text-sm font-bold text-gray-900 capitalize">{tier}</p>
              </div>
              <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-3.5 text-center border border-white/40 shadow-premium">
                <p className="text-[10px] text-gray-500 font-bold mb-1 uppercase tracking-[0.2em]">Points</p>
                <p className="text-sm font-bold text-gray-900">{user?.points || 0}</p>
              </div>
              <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-3.5 text-center border border-white/40 shadow-premium">
                <p className="text-[10px] text-gray-500 font-bold mb-1 uppercase tracking-[0.2em]">Discount</p>
                <p className="text-sm font-bold text-gray-900">{discount}%</p>
              </div>
            </div>

            {/* Action Buttons - Glassmorphic */}
            <div className="space-y-2.5">
              <BFFButton
                decorativeText="01"
                onClick={() => setIsFullscreen(true)}
                className="w-full h-14 gap-4 justify-start px-5"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center flex-shrink-0 shadow-lg border border-white/10">
                  <Maximize2 className="w-5 h-5 text-white" />
                </div>
                Fullscreen View
              </BFFButton>

              {tier !== "elite" && (
                <BFFButton
                  decorativeText="BFF"
                  onClick={() => {/* Navigate to upgrade/purchase screen */}}
                  className="w-full h-14 gap-4 justify-start px-5"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#135bec] flex items-center justify-center flex-shrink-0 shadow-lg border border-white/10">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  Upgrade Membership
                </BFFButton>
              )}

              <BFFButton
                decorativeText="02"
                onClick={() => {/* Navigate to transaction history */}}
                className="w-full h-14 gap-4 justify-start px-5"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center flex-shrink-0 shadow-lg border border-white/10">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                Recent Activity
              </BFFButton>
            </div>

            {/* Valid Until Card - Glassmorphic */}
            <div className="bg-gray-900 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-premium relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-[10px] text-white/40 font-bold mb-1 uppercase tracking-[0.2em]">Valid Until</p>
                  <p className="text-sm font-bold text-white tracking-tight">{validUntilStr}</p>
                </div>
                {isExpiringSoon ? (
                  <Badge className="bg-red-500/20 border border-red-500/30 text-red-200 text-[10px] px-3 py-1 rounded-full backdrop-blur-md">
                    Expiring Soon
                  </Badge>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                    <Shield className="w-4 h-4 text-white/40" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="animate-in slide-in-from-right-4 duration-300 fade-in">
             {/* Sub-tabs - Glassmorphic */}
            <div className="flex gap-2.5 mb-8 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: 'upcoming', label: 'Upcoming', icon: Calendar },
                { id: 'pending', label: 'Pending', icon: Clock, count: pendingBookings.length },
                { id: 'history', label: 'History', icon: History }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveBookingSubTab(tab.id)}
                  className={`
                    px-6 py-3 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2.5 whitespace-nowrap border
                    ${activeBookingSubTab === tab.id 
                      ? 'bg-gray-900 text-white border-gray-900 shadow-lg scale-105' 
                      : 'bg-white/40 text-gray-500 backdrop-blur-md border-white/40 hover:bg-white/60'}
                  `}
                >
                  <tab.icon className={`w-4 h-4 ${activeBookingSubTab === tab.id ? 'text-white' : 'text-gray-400'}`} />
                  {tab.label}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={`
                      ml-1 px-2 py-0.5 rounded-full text-[10px] 
                      ${activeBookingSubTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-900/10 text-gray-900'}
                    `}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="space-y-6">
              {activeBookingSubTab === 'upcoming' && (
                upcomingBookings.length > 0 ? (
                  upcomingBookings.map(booking => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onViewDetails={() => {
                        setSelectedBooking(booking)
                        setShowBookingDetail(true)
                      }}
                      onCancel={() => {
                        setSelectedBooking(booking)
                        setShowCancelModal(true)
                      }}
                    />
                  ))
                ) : (
                  <EmptyState 
                    icon={<Calendar className="w-16 h-16 text-gray-300" />} 
                    title="No upcoming bookings" 
                    desc="Ready to plan your next adventure?" 
                    action="Explore Partners"
                  />
                )
              )}

              {activeBookingSubTab === 'pending' && (
                pendingBookings.length > 0 ? (
                  pendingBookings.map(booking => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onViewDetails={() => {
                        setSelectedBooking(booking)
                        if (booking.status === 'counter_offer_sent' && booking.counter_offer) {
                          setShowCounterOfferModal(true)
                        } else {
                          setShowBookingDetail(true)
                        }
                      }}
                      onCancel={() => {
                        setSelectedBooking(booking)
                        setShowCancelModal(true)
                      }}
                      onAcceptCounterOffer={handleAcceptCounterOffer}
                      onDeclineCounterOffer={handleDeclineCounterOffer}
                    />
                  ))
                ) : (
                  <EmptyState 
                    icon={<Clock className="w-16 h-16 text-gray-300" />} 
                    title="No pending requests" 
                    desc="All your bookings have been processed."
                  />
                )
              )}

              {activeBookingSubTab === 'history' && (
                historyBookings.length > 0 ? (
                  historyBookings.map(booking => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onViewDetails={() => {
                        setSelectedBooking(booking)
                        setShowBookingDetail(true)
                      }}
                      onCancel={() => {}} 
                    />
                  ))
                ) : (
                  <EmptyState 
                    icon={<History className="w-16 h-16 text-gray-300" />} 
                    title="No booking history" 
                    desc="Your past adventures will appear here."
                  />
                )
              )}
            </div>
          </div>
        )}

        {/* Points Tab */}
        {activeTab === "activity" && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300 fade-in">
            <PointsHistory userId={user?.id || ''} />
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-gradient-to-b from-[#f5d6c6] via-[#d4e4ec] to-[#c8b8a8] px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Recent Activity
                </span>
              </div>
            </div>

            <ActivityTimeline activities={activities} />
          </div>
        )}
      </div>

      {/* Modals */}
      <BookingDetailModal
        isOpen={showBookingDetail}
        onClose={() => setShowBookingDetail(false)}
        booking={selectedBooking}
      />

      <CancelBookingModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        bookingId={selectedBooking?.id || ''}
        onConfirm={handleCancelBooking}
      />

      <CounterOfferResponseModal
        isOpen={showCounterOfferModal}
        onClose={() => setShowCounterOfferModal(false)}
        booking={selectedBooking}
        onAccept={handleAcceptCounterOffer}
        onDecline={handleDeclineCounterOffer}
      />
    </div>
  )
}

function EmptyState({ icon, title, desc, action }: { icon: React.ReactNode, title: string, desc: string, action?: string }) {
  return (
    <div className="py-20 flex flex-col items-center justify-center text-center bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white/40 shadow-premium animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-6 p-5 bg-gray-900 rounded-full shadow-2xl ring-8 ring-white/10">
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { className: "w-8 h-8 text-white" }) : icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">{title}</h3>
      <p className="text-sm text-gray-500 mb-8 max-w-[240px] leading-relaxed">{desc}</p>
      {action && (
        <Button className="rounded-full px-8 bg-gray-900 text-white hover:bg-black shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-bold text-xs uppercase tracking-widest h-12">
          {action}
        </Button>
      )}
    </div>
  )
}
