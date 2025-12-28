"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Heart, MapPin, Crown, Star } from "lucide-react"
import { partners, allOffers } from "@/lib/partners-data"
import { useUser, discountPercentages } from "@/lib/user-context"
import { Offer } from "@/lib/types"
import { OfferBookingModal } from "@/components/booking/offer-booking-modal"

export function WishlistDashboard() {
  const { user, toggleWishlist } = useUser()
  const router = useRouter()
  const [bookingOpen, setBookingOpen] = React.useState(false)
  const [bookingOffer, setBookingOffer] = React.useState<Offer | null>(null)

  function calculateUserDiscount(originalPrice: number, userTier: string): number {
    const discountPercent = discountPercentages[userTier as keyof typeof discountPercentages] || 0
    return originalPrice * (1 - discountPercent / 100)
  }

  const handleToggleWishlist = (e: React.MouseEvent, offerId: string) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(offerId)
  }

  const filteredOffers = allOffers
    .filter(offer => user?.wishlist?.includes(offer.id))
    .map((offer) => {
      const partner = partners.find((p) => p.id === offer.partnerId)
      return {
        ...offer,
        logo: partner?.logo,
        image: offer.image || partner?.image || "/placeholder.jpg",
        category: partner?.category || "General",
      }
    })

  return (
    <div className="relative min-h-screen w-full mx-auto overflow-hidden bg-white dark:bg-background-dark font-sans selection:bg-subic-blue selection:text-white">
      {/* Premium Gradient Background - Matching home-dashboard */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#135bec]/25 via-white to-[#D97706]/25 z-0 pointer-events-none mix-blend-multiply"></div>
      <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-[#135bec]/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-20%] w-[400px] h-[400px] bg-[#06b6d4]/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[30%] w-[350px] h-[350px] bg-[#10B981]/15 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 h-full overflow-y-auto pb-28 no-scrollbar">
        {/* Header Section */}
        <div className="px-6 pt-14 pb-8">
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => router.push("/home")}
              className="w-12 h-12 rounded-full bg-white dark:bg-input-dark shadow-premium border border-gray-100 flex items-center justify-center hover:bg-gray-50 hover:shadow-xl hover:scale-105 transition-all active:scale-95"
            >
              <ArrowLeft className="w-6 h-6 text-gray-900 dark:text-white" />
            </button>
            <div className="flex-1 ml-4">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white font-sans">
                My Wishlist
              </h1>
              <p className="text-sm text-gray-500 font-medium">
                {filteredOffers.length} {filteredOffers.length === 1 ? 'Saved Offer' : 'Saved Offers'}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6">
          {filteredOffers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredOffers.map((item, index) => (
                <div key={`${item.id}-${index}`} className="relative h-[450px] rounded-3xl overflow-hidden shadow-premium hover:shadow-2xl hover:shadow-subic-blue/10 group cursor-pointer transition-all duration-300 hover:scale-[1.02]">
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img 
                      alt={item.partnerName} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      src={item.image || item.logo || "/placeholder.jpg"} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent/20"></div>
                  </div>

                  {/* Top Overlay Elements */}
                  <div className="absolute top-5 left-5 z-20">
                    <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-bold text-gray-900 tracking-wide border border-white/50 uppercase shadow-sm">
                      {item.category}
                    </div>
                  </div>

                  <div className="absolute top-5 right-5 z-20 flex flex-col items-end gap-3">
                    {/* Elite Exclusive Badge */}
                    {item.isEliteExclusive && (
                      <div className="bg-gradient-to-r from-[#D97706] to-[#F59E0B] px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg shadow-[#D97706]/40">
                        <Crown className="w-3.5 h-3.5 text-white" />
                        <span className="text-[10px] font-bold text-white tracking-wider uppercase">Elite Only</span>
                      </div>
                    )}

                    {/* Heart Icon - interactive and filled by default since it's in wishlist */}
                    <button 
                      onClick={(e) => handleToggleWishlist(e, item.id)}
                      className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 hover:bg-white/30 hover:shadow-lg hover:shadow-red-500/30 hover:scale-110 active:scale-95 transition-all group/heart"
                      aria-label="Remove from wishlist"
                    >
                      <Heart 
                        className="w-5 h-5 fill-red-500 text-red-500 scale-110 transition-all duration-300" 
                      />
                    </button>
                  </div>

                  {/* Bottom Content Area */}
                  <div className="absolute bottom-0 left-0 right-0 p-7 z-10">
                    <div className="flex items-center text-white/80 mb-2">
                      <MapPin className="w-4 h-4 mr-1.5 text-subic-blue" />
                      <span className="text-xs font-medium tracking-tight">Subic Bay</span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-3 tracking-tight font-sans line-clamp-1">{item.partnerName}</h3>
                    
                    {/* Offer Title Badge */}
                    <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full mb-5">
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                        {item.title}
                      </span>
                    </div>
                    
                    <div className="flex items-end justify-between">
                      <div>
                        {item.originalPrice && (
                          <div className="flex flex-col mb-1">
                            <span className="text-xs text-white/60 line-through mb-0.5">₱{item.originalPrice.toLocaleString()}</span>
                            <span className="text-3xl font-bold text-white tracking-tight">
                              ₱{calculateUserDiscount(item.originalPrice, user?.tier || 'starter').toLocaleString()}
                            </span>
                          </div>
                        )}
                        <p className="text-[10px] text-white/70 font-bold uppercase tracking-[0.15em] leading-none">
                          {discountPercentages[user?.tier || 'starter']}% MEMBER DISCOUNT
                        </p>
                      </div>
                      
                      <button
                        onClick={() => {
                          console.log('Opening modal (Wishlist):', { offerId: item.id, offerTitle: item.title, category: item.category })
                          setBookingOffer(item)
                          // Use setTimeout to ensure state update completes
                          setTimeout(() => setBookingOpen(true), 0)
                        }}
                        className="bg-white text-black text-sm font-bold py-3.5 px-7 rounded-full shadow-premium hover:shadow-xl hover:shadow-subic-blue/20 hover:-translate-y-1 hover:scale-105 active:scale-95 transition-all duration-300"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center rounded-3xl bg-white/50 backdrop-blur-sm p-12 shadow-premium">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mb-6 shadow-premium">
                <Heart className="w-12 h-12 text-gray-300" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 font-sans tracking-tight">No Saved Offers Yet</h2>
              <p className="text-gray-500 mb-10 max-w-xs leading-relaxed">
                Explore our curated partners and save your favorite deals for later.
              </p>
              <Link 
                href="/home" 
                className="bg-white text-subic-blue shadow-xl border border-gray-200 hover:shadow-2xl hover:bg-subic-blue hover:text-white transition-all font-bold py-4 px-10 rounded-full active:scale-95"
              >
                Explore Offers
              </Link>
            </div>
          )}
        </div>
      </div>
      <OfferBookingModal 
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        offer={bookingOffer}
      />
    </div>
  )
}
