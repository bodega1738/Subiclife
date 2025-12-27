"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { Shield, Maximize2, X, Anchor, Hotel, CreditCard, Star, RefreshCw, AlertTriangle, ChevronRight, Calendar, History, Wallet, Clock, Activity, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUser, discountPercentages } from "@/lib/user-context"
import { useMockDBStore } from "@/lib/mock-db"
import { QRCodeSVG } from "qrcode.react"
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

  // Scroll Shadow Effect
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
      className={`relative w-full aspect-[4/5] sm:aspect-[1.586/1] max-w-sm sm:max-w-md mx-auto perspective-1500 ${className}`}
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
        <Card className={`absolute inset-0 w-full h-full backface-hidden overflow-hidden rounded-[2rem] border ${style.border} shadow-[0_8px_32px_-4px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_40px_-4px_rgba(0,0,0,0.2)] transition-shadow duration-300`}>
          {/* Background & Effects */}
          <div className="absolute inset-0" style={{ background: style.background }} />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
          
          {/* Elite Glow Effect */}
          {tier === 'elite' && (
            <>
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-amber-500/20 blur-[100px] rounded-full" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-600/10 blur-[80px] rounded-full" />
            </>
          )}
          
          <CardContent className="relative h-full flex flex-col p-7 z-10">
             {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <img src="/icon.svg" alt="Logo" className="w-5 h-5 brightness-0 invert" />
                </div>
                <span className="text-sm font-bold tracking-tight text-white">Subic.Life</span>
              </div>
              <Badge variant="outline" className={`bg-white/5 backdrop-blur-md border-white/20 text-[10px] tracking-[0.2em] font-bold ${style.color}`}>
                {style.label}
              </Badge>
            </div>

            {/* Member Info */}
            <div className="mb-auto">
               <h2 className="text-3xl font-sans font-bold text-white tracking-tight mb-1">
                {user?.name || "Guest"}
              </h2>
              <p className="text-xs font-mono text-white/60 tracking-[0.15em] mb-3">
                {user?.member_id || "SL-2025-DEMO-0000"}
              </p>
              {isExpiringSoon && (
                <div className="inline-flex items-center gap-1.5 bg-red-500/20 border border-red-500/30 text-red-200 text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-sm animate-pulse">
                   <AlertTriangle className="w-3 h-3" />
                   RENEW SOON
                </div>
              )}
            </div>

            {/* QR Code Section */}
            <div className="flex flex-col items-center justify-end mt-4">
              <div className="relative p-1 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl backdrop-blur-md border border-white/10 shadow-xl mb-4 group overflow-hidden">
                <div className="bg-white p-3 rounded-xl relative z-10">
                   <QRCodeSVG value={qrValue} size={140} level="H" />
                </div>
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer pointer-events-none" />
                {/* Scanner Line */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none z-20">
                  <div className="w-full h-1 bg-blue-400/50 blur-sm absolute top-0 animate-[scan_3s_ease-in-out_infinite]" />
                </div>
              </div>
              
              <div className="w-full max-w-[160px] flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[9px] text-white/50 font-bold tracking-widest uppercase">
                   <span>Security Code</span>
                   <span className={`font-mono transition-colors duration-300 ${validity < 10 ? 'text-red-400' : validity < 20 ? 'text-yellow-400' : 'text-white'}`}>
                     {validity}s
                   </span>
                </div>
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(255,255,255,0.5)] ${validity < 10 ? 'bg-red-400' : 'bg-white/80'}`} 
                    style={{ width: `${(validity / 30) * 100}%` }} 
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* BACK FACE */}
        <Card 
          className="absolute inset-0 w-full h-full backface-hidden overflow-hidden rounded-[2rem] border-0 bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
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
                      <div className="p-2.5 bg-blue-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <Shield className="w-5 h-5 text-blue-600" />
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
                      <div className="p-2.5 bg-green-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <CreditCard className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{discount}% Discount</p>
                        <p className="text-xs text-slate-500">At 50+ Partner Merchants</p>
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-3 group">
                      <div className="p-2.5 bg-yellow-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <Star className="w-5 h-5 text-yellow-600" />
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
        <p className="text-white/40 text-xs mt-8 animate-pulse font-medium tracking-widest uppercase">
          Tap card to flip • Press ESC to close
        </p>
      </div>
    )
  }

  const benefits = [
    {
      icon: <Shield className="w-6 h-6 text-blue-600" />,
      title: "Insurance",
      desc: `₱${pricing.insurance.toLocaleString()} Coverage`,
      bg: "bg-gradient-to-br from-blue-50 to-white"
    },
    {
      icon: <CreditCard className="w-6 h-6 text-green-600" />,
      title: "Discount",
      desc: `${discount}% at 50+ Partners`,
      bg: "bg-gradient-to-br from-green-50 to-white"
    },
    {
      icon: <Star className="w-6 h-6 text-yellow-600" />,
      title: "Points",
      desc: `${user?.points || 0} Points Balance`,
      bg: "bg-gradient-to-br from-yellow-50 to-white"
    }
  ]

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Sticky Tab List */}
      <div className="sticky top-0 z-40 px-6 pt-4 pb-2 -mx-0 transition-all duration-300 backdrop-blur-xl" id="sticky-tabs-list">
        <div className="max-w-md mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="inline-flex items-center w-full bg-slate-100/80 rounded-full p-1 h-14 border border-slate-200/50 shadow-sm overflow-hidden">
              <TabsTrigger 
                value="card" 
                className="flex-1 rounded-full h-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 data-[state=active]:bg-[#111318] data-[state=active]:text-white data-[state=active]:shadow-md hover:text-[#135bec]"
              >
                Card
              </TabsTrigger>
              <TabsTrigger 
                value="bookings" 
                className="flex-1 rounded-full h-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 data-[state=active]:bg-[#111318] data-[state=active]:text-white data-[state=active]:shadow-md hover:text-[#135bec] relative"
              >
                Bookings
                {pendingBookings.length > 0 && (
                  <span className="absolute top-3 right-3 sm:right-6 w-2 h-2 rounded-full bg-[#135bec] ring-2 ring-white animate-pulse" />
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="activity" 
                className="flex-1 rounded-full h-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 data-[state=active]:bg-[#111318] data-[state=active]:text-white data-[state=active]:shadow-md hover:text-[#135bec]"
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
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 fade-in">
            <div>
              <PassCard />
              <Button
                onClick={() => setIsFullscreen(true)}
                variant="outline"
                className="w-full mt-8 h-12 gap-2 rounded-xl border-slate-200 text-slate-600 font-medium tracking-tight hover:bg-slate-50 transition-colors shadow-sm"
              >
                <Maximize2 className="w-4 h-4" />
                Fullscreen View
              </Button>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-2 gap-4">
              {benefits.map((benefit, i) => (
                <Card
                  key={i}
                  className={`border border-gray-100/50 shadow-sm rounded-2xl p-5 transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] cursor-pointer group ${benefit.bg}`}
                >
                  <div className="mb-3 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 origin-left">
                    {benefit.icon}
                  </div>
                  <h4 className="text-[10px] font-[700] text-slate-400 uppercase tracking-[0.2em] mb-1.5">
                    {benefit.title}
                  </h4>
                  <p className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-tight">{benefit.desc}</p>
                </Card>
              ))}
              {(tier === "premium" || tier === "elite") && (
                <Card className="border border-orange-100/50 shadow-sm rounded-2xl bg-gradient-to-br from-orange-50 to-white p-5 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 group cursor-pointer">
                  <div className="mb-3 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 origin-left">
                    <Hotel className="w-6 h-6 text-orange-600" />
                  </div>
                  <h4 className="text-[10px] font-[700] text-orange-400 uppercase tracking-[0.2em] mb-1.5">
                    Bonus
                  </h4>
                  <p className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-tight">
                    1 Free Hotel Night
                  </p>
                </Card>
              )}
              {tier === "elite" && (
                <Card className="border border-cyan-100/50 shadow-sm rounded-2xl bg-gradient-to-br from-cyan-50 to-white p-5 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 group cursor-pointer">
                  <div className="mb-3 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 origin-left">
                    <Anchor className="w-6 h-6 text-cyan-600" />
                  </div>
                  <h4 className="text-[10px] font-[700] text-cyan-400 uppercase tracking-[0.2em] mb-1.5">
                    Elite Perk
                  </h4>
                  <p className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-tight">
                    Yacht Cruise
                  </p>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="animate-in slide-in-from-right-4 duration-300 fade-in">
             {/* Sub-tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: 'upcoming', label: 'Upcoming', icon: Calendar },
                { id: 'pending', label: 'Pending', icon: Clock, count: pendingBookings.length },
                { id: 'history', label: 'History', icon: History }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveBookingSubTab(tab.id)}
                  className={`
                    px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 whitespace-nowrap
                    ${activeBookingSubTab === tab.id 
                      ? 'bg-[#135bec] text-white shadow-lg shadow-blue-200 scale-105' 
                      : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'}
                  `}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={`
                      ml-1 px-1.5 py-0.5 rounded-full text-[9px] 
                      ${activeBookingSubTab === tab.id ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'}
                    `}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="space-y-4">
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
                <span className="bg-[#F9FAFB] px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
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
    <div className="py-16 flex flex-col items-center justify-center text-center bg-gradient-to-br from-white to-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-4 p-4 bg-white rounded-full shadow-sm ring-4 ring-gray-50 animate-bounce">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 mb-6 max-w-[200px]">{desc}</p>
      {action && (
        <Button className="rounded-full bg-gradient-to-r from-[#135bec] to-[#0e45b5] hover:from-[#0e45b5] hover:to-[#0a3696] shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
          {action}
        </Button>
      )}
    </div>
  )
}
