"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Shield, Maximize2, X, Anchor, Hotel, CreditCard, Star, RefreshCw, AlertTriangle, ChevronRight, Calendar, History, Wallet } from "lucide-react"
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

  // Booking state
  const [selectedBooking, setSelectedBooking] = useState<(Booking & { partner?: Partner; counter_offer?: CounterOffer }) | null>(null)
  const [showBookingDetail, setShowBookingDetail] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showCounterOfferModal, setShowCounterOfferModal] = useState(false)

  // Get raw data from store - stable references
  const allBookings = useMockDBStore((state) => state.bookings)
  const partners = useMockDBStore((state) => state.partners)
  const counterOffers = useMockDBStore((state) => state.counter_offers)
  const updateBooking = useMockDBStore((state) => state.updateBooking)
  const updateCounterOffer = useMockDBStore((state) => state.updateCounterOffer)
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

  const cardRef = useRef<HTMLDivElement>(null)

  // Handler for accepting counter-offers
  const handleAcceptCounterOffer = async (bookingId: string, offerId: string) => {
    if (!selectedBooking) return
    try {
      await acceptCounterOffer(bookingId, offerId, user?.id || '', selectedBooking.partner_id)
      // Refresh booking from store
      const updatedBookings = allBookings.filter(b => b.id === bookingId)
      if (updatedBookings.length > 0) {
        const enriched = updatedBookings.map(b => ({
          ...b,
          partner: partners.find(p => p.id === b.partner_id),
          counter_offer: counterOffers.find(o => o.booking_id === b.id && o.status === 'pending')
        }))
        if (enriched[0]) setSelectedBooking(enriched[0])
      }
      toast({ title: "Offer Accepted!", description: "Your booking is now confirmed." })
      setShowCounterOfferModal(false)
    } catch (error) {
      toast({ title: "Error", description: "Failed to accept offer.", variant: "destructive" })
    }
  }

  // Handler for declining counter-offers
  const handleDeclineCounterOffer = async (bookingId: string, offerId: string) => {
    if (!selectedBooking) return
    try {
      await declineCounterOffer(bookingId, offerId, user?.id || '', selectedBooking.partner_id)
      // Refresh booking from store
      const updatedBookings = allBookings.filter(b => b.id === bookingId)
      if (updatedBookings.length > 0) {
        const enriched = updatedBookings.map(b => ({
          ...b,
          partner: partners.find(p => p.id === b.partner_id),
          counter_offer: counterOffers.find(o => o.booking_id === b.id && o.status === 'pending')
        }))
        if (enriched[0]) setSelectedBooking(enriched[0])
      }
      toast({ title: "Offer Declined", description: "The partner will be notified." })
      setShowCounterOfferModal(false)
    } catch (error) {
      toast({ title: "Error", description: "Failed to decline offer.", variant: "destructive" })
    }
  }

  // Handler for canceling bookings
  const handleCancelBooking = async (reason: string, note?: string) => {
    if (!selectedBooking) return
    try {
      updateBooking(selectedBooking.id, { status: 'cancelled' })
      addNotification({
        id: `notif-${Date.now()}`,
        user_id: '',
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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    
    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    
    // x * 0.01 deg as requested
    card.style.setProperty("--tilt-x", `${x * 0.01}deg`)
    card.style.setProperty("--tilt-y", `${-y * 0.01}deg`)
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.setProperty("--tilt-x", "0deg")
    cardRef.current.style.setProperty("--tilt-y", "0deg")
  }

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
  
  // Check if expiring in < 30 days
  const daysUntilExpiry = Math.ceil((validity > 0 ? validUntilDate.getTime() - Date.now() : 0) / (1000 * 60 * 60 * 24))
  const isExpiringSoon = daysUntilExpiry < 30

  const PassCard = ({ className = "" }: { className?: string }) => (
    <div 
      className={`relative w-full aspect-[4/5] sm:aspect-[1.586/1] max-w-sm sm:max-w-md mx-auto perspective-1000 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div 
        ref={cardRef}
        className="w-full h-full relative transition-all duration-400 ease-in-out preserve-3d cursor-pointer"
        style={{ 
          transform: `perspective(1000px) rotateX(var(--tilt-y, 0deg)) rotateY(calc(${isFlipped ? 180 : 0}deg + var(--tilt-x, 0deg)))` 
        }}
      >
        {/* FRONT FACE */}
        <Card className={`absolute inset-0 w-full h-full backface-hidden overflow-hidden rounded-[2rem] border ${style.border} shadow-2xl`}>
          {/* Background & Effects */}
          <div className="absolute inset-0" style={{ background: style.background }} />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
          
          {/* Elite Glow Effect */}
          {tier === 'elite' && (
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/20 blur-[80px] rounded-full" />
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
                <div className="inline-flex items-center gap-1.5 bg-red-500/20 border border-red-500/30 text-red-200 text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                   <AlertTriangle className="w-3 h-3" />
                   RENEW SOON
                </div>
              )}
            </div>

            {/* QR Code Section - Premium Glass Container */}
            <div className="flex flex-col items-center justify-end mt-4">
              <div className="relative p-1 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl backdrop-blur-md border border-white/10 shadow-xl mb-4">
                <div className="bg-white p-3 rounded-xl">
                   <QRCodeSVG value={qrValue} size={140} level="H" />
                </div>
                {/* Scanner Line Animation */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                  <div className="w-full h-1 bg-blue-400/50 blur-sm absolute top-0 animate-[scan_3s_ease-in-out_infinite]" />
                </div>
              </div>
              
              <div className="w-full max-w-[160px] flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[9px] text-white/50 font-bold tracking-widest uppercase">
                   <span>Security Code</span>
                   <span className="text-white">{validity}s</span>
                </div>
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white/80 transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(255,255,255,0.5)]" 
                    style={{ width: `${(validity / 30) * 100}%` }} 
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* BACK FACE */}
        <Card 
          className="absolute inset-0 w-full h-full backface-hidden overflow-hidden rounded-2xl border-0 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
          style={{ transform: "rotateY(180deg)" }}
        >
          <CardContent className="h-full flex flex-col p-6 overflow-y-auto">
             <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Pass Details</h3>
                <Badge variant="outline" className="text-[10px] tracking-[0.2em] uppercase font-medium">
                  Active
                </Badge>
             </div>

             <div className="space-y-6">
                <div className="space-y-3">
                   <h4 className="text-[10px] text-slate-400 font-[600] tracking-[0.2em] uppercase">Coverage</h4>
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
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
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-50 rounded-lg">
                        <CreditCard className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{discount}% Discount</p>
                        <p className="text-xs text-slate-500">At 50+ Partner Merchants</p>
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-50 rounded-lg">
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
                      <Button size="sm" variant="link" className="px-0 text-red-700 h-auto mt-2 text-xs font-bold flex items-center">
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
      <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-6">
        <button
          onClick={() => setIsFullscreen(false)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white"
        >
          <X className="w-6 h-6" />
        </button>
        <PassCard className="scale-110 sm:scale-125" />
        <p className="text-white/50 text-sm mt-8 animate-pulse font-medium tracking-widest uppercase text-[10px]">
          Tap card to flip
        </p>
      </div>
    )
  }

  const benefits = [
    {
      icon: <Shield className="w-5 h-5 text-blue-600" />,
      title: "Insurance",
      desc: `₱${pricing.insurance.toLocaleString()} Coverage`
    },
    {
      icon: <CreditCard className="w-5 h-5 text-green-600" />,
      title: "Discount",
      desc: `${discount}% at 50+ Partners`
    },
    {
      icon: <Star className="w-5 h-5 text-yellow-500" />,
      title: "Points",
      desc: `${user?.points || 0} Points Balance`
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-100">
        <div className="max-w-md mx-auto px-6 py-4">
          <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-0.5">Welcome Back</p>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{user?.name || "Guest"}</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-slate-100 rounded-xl p-1">
            <TabsTrigger value="card" className="rounded-lg text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Wallet className="w-4 h-4 mr-1.5" />
              My Card
            </TabsTrigger>
            <TabsTrigger value="bookings" className="rounded-lg text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Calendar className="w-4 h-4 mr-1.5" />
              Bookings
              {enrichedBookings.filter(b => b.status === 'pending' || b.status === 'counter_offer_sent').length > 0 && (
                <span className="ml-1.5 w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] flex items-center justify-center">
                  {enrichedBookings.filter(b => b.status === 'pending' || b.status === 'counter_offer_sent').length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="activity" className="rounded-lg text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <History className="w-4 h-4 mr-1.5" />
              Points
            </TabsTrigger>
          </TabsList>

          {/* My Card Tab */}
          <TabsContent value="card" className="space-y-8">
            <div>
              <PassCard />
              <Button
                onClick={() => setIsFullscreen(true)}
                variant="outline"
                className="w-full mt-6 h-12 gap-2 rounded-xl border-slate-200 text-slate-600 font-medium tracking-tight hover:bg-slate-50 transition-colors"
              >
                <Maximize2 className="w-4 h-4" />
                Fullscreen View
              </Button>
            </div>

            {/* Benefits Summary Section */}
            <div className="grid grid-cols-2 gap-3">
              {benefits.map((benefit, i) => (
                <Card
                  key={i}
                  className="border-none shadow-sm rounded-2xl bg-white p-4 transition-all duration-200 ease-out hover:shadow-md hover:-translate-y-[1px]"
                >
                  <div className="mb-2">{benefit.icon}</div>
                  <h4 className="text-[10px] font-[600] text-slate-400 uppercase tracking-[0.2em] mb-1">
                    {benefit.title}
                  </h4>
                  <p className="text-base font-bold text-slate-900 tracking-tight leading-tight">{benefit.desc}</p>
                </Card>
              ))}
              {(tier === "premium" || tier === "elite") && (
                <Card className="border-none shadow-sm rounded-2xl bg-gradient-to-br from-orange-50 to-white p-4">
                  <div className="mb-2"><Hotel className="w-5 h-5 text-orange-600" /></div>
                  <h4 className="text-[10px] font-[600] text-orange-400 uppercase tracking-[0.2em] mb-1">
                    Bonus
                  </h4>
                  <p className="text-base font-bold text-slate-900 tracking-tight leading-tight">
                    1 Free Hotel Night
                  </p>
                </Card>
              )}
              {tier === "elite" && (
                <Card className="border-none shadow-sm rounded-2xl bg-gradient-to-br from-cyan-50 to-white p-4">
                  <div className="mb-2"><Anchor className="w-5 h-5 text-cyan-600" /></div>
                  <h4 className="text-[10px] font-[600] text-cyan-400 uppercase tracking-[0.2em] mb-1">
                    Elite Perk
                  </h4>
                  <p className="text-base font-bold text-slate-900 tracking-tight leading-tight">
                    Yacht Cruise
                  </p>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-4">
            {enrichedBookings.length === 0 ? (
              <div className="py-16 text-center">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-1">No Bookings Yet</h3>
                <p className="text-sm text-slate-500 mb-4">Browse offers and make your first booking!</p>
                <Button className="rounded-xl">Browse Offers</Button>
              </div>
            ) : (
              <div className="space-y-3">
                {enrichedBookings.map((booking) => (
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
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Activity/Points Tab */}
          <TabsContent value="activity">
            <PointsHistory userId={user?.id || ''} />
          </TabsContent>
        </Tabs>
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
