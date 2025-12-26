"use client"

import React from "react"
import Link from "next/link"
import { Search, Star, ArrowRight, Heart, MapPin, SlidersHorizontal, Crown } from "lucide-react"
import { partners, featuredOffers, allOffers } from "@/lib/partners-data"
import { useUser, discountPercentages } from "@/lib/user-context"
import { TierBadge } from "@/components/ui/tier-badge"

function getTimeBasedGreeting(): string {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return "Good morning"
  if (hour >= 12 && hour < 18) return "Good afternoon"
  return "Good evening"
}

function getFirstName(fullName: string | undefined): string {
  if (!fullName || fullName.trim() === "") return "Member"
  const firstName = fullName.trim().split(' ')[0]
  return firstName || "Member"
}

function isEligible(offer: any, tier: string): boolean {
  // Non-elite users cannot see elite-exclusive offers
  if (offer.isEliteExclusive && tier !== 'elite') {
    return false
  }
  return true
}

export function HomeDashboard() {
  const { user, toggleWishlist } = useUser()

  const handleToggleWishlist = (e: React.MouseEvent, offerId: string) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(offerId)
  }

  function calculateUserDiscount(originalPrice: number, userTier: string): number {
    const discountPercent = discountPercentages[userTier as keyof typeof discountPercentages] || 0
    return originalPrice * (1 - discountPercent / 100)
  }

  // Curate deals based on user interests
  const curatedPartners = React.useMemo(() => {
    const interests = user?.preferences?.interests || []
    if (interests.length === 0) {
      return partners.filter(p => p.featured)
    }
    const matched = partners.filter(p => interests.includes(p.category))
    return matched.length > 0 ? matched : partners.filter(p => p.featured)
  }, [user?.preferences?.interests])

  return (
    <div className="relative min-h-screen w-full mx-auto overflow-hidden bg-white dark:bg-background-dark font-sans selection:bg-subic-blue selection:text-white">
      {/* Premium Gradient Background - Significantly more colorful/vibrant as requested */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#135bec]/25 via-white to-[#D97706]/25 z-0 pointer-events-none mix-blend-multiply"></div>
      <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-[#135bec]/20 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-20%] w-[400px] h-[400px] bg-[#06b6d4]/20 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="relative z-10 h-full overflow-y-auto pb-28 no-scrollbar">
        <div className="px-6 pt-14 pb-2">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-sans text-gray-900 dark:text-white tracking-tight leading-tight">
                {getTimeBasedGreeting()},<br />
                <span className="font-bold">{getFirstName(user?.name)}.</span>
              </h1>
            </div>
            <div className="mt-1">
              <TierBadge tier={user?.tier} />
            </div>
          </div>
          
          <div className="relative mb-8 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400 group-focus-within:text-subic-blue transition-colors" />
            </div>
            <input 
              className="block w-full pl-12 pr-4 py-4 bg-white dark:bg-input-dark rounded-2xl text-sm text-gray-900 dark:text-white placeholder-gray-400 shadow-premium border border-gray-100 focus:outline-none focus:ring-2 focus:ring-subic-blue/20 transition-all" 
              placeholder="Find me a yacht for Saturday..." 
              type="text" 
            />
          </div>
        </div>
        <div className="mb-10">
          <div className="px-6 mb-5 flex justify-between items-end">
            <h2 className="text-xl font-sans font-bold tracking-tight text-gray-900 dark:text-white">Deals for You</h2>
            <Link className="text-xs font-semibold tracking-wide text-subic-blue hover:text-blue-700 transition-colors" href="#">VIEW ALL</Link>
          </div>
          <div className="flex overflow-x-auto px-6 space-x-5 pb-8 no-scrollbar snap-x snap-mandatory">
            {curatedPartners.map((partner, index) => (
              <div key={`${partner.id}-${index}`} className="snap-center flex-shrink-0 relative w-[280px] h-[380px] rounded-[2rem] overflow-hidden shadow-premium group cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                <img 
                  alt={partner.name} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  src={partner.image || partner.logo || "/placeholder.jpg"} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent/10"></div>
                
                {/* Category Badge */}
                <div className="absolute top-5 left-5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 z-20">
                  <span className="text-[10px] font-bold text-white tracking-wider uppercase">{partner.category}</span>
                </div>

                {/* Heart Icon for Carousel */}
                <div className="absolute top-5 right-5 z-20">
                  <button 
                    onClick={(e) => handleToggleWishlist(e, partner.id)}
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 hover:bg-white/30 hover:scale-110 active:scale-95 transition-all group/heart"
                    aria-label={user?.wishlist?.includes(partner.id) ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart 
                      className={`w-5 h-5 transition-all duration-300 ${
                        user?.wishlist?.includes(partner.id) 
                          ? "fill-red-500 text-red-500 scale-110" 
                          : "text-white group-hover/heart:text-red-500"
                      }`} 
                    />
                  </button>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center gap-1.5 mb-3">
                    <Star className="w-3.5 h-3.5 text-subic-gold fill-current" />
                    <span className="text-xs font-medium text-white/90">4.9 (120 reviews)</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 font-sans leading-tight line-clamp-1">{partner.name}</h3>
                  <p className="text-sm text-gray-300 mb-4 line-clamp-1">
                    {partner.offers && partner.offers[0] ? partner.offers[0] : "Exclusive Member Deals"}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase tracking-widest mb-0.5">DISCOUNT</span>
                      <span className="text-xl font-bold text-white">{discountPercentages[user?.tier || 'starter']}% OFF</span>
                    </div>
                    <button className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-100 transition-colors shadow-lg">
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="px-6">
          <div className="mb-5 flex justify-between items-end">
            <h2 className="text-xl font-sans font-bold tracking-tight text-gray-900 dark:text-white">Available Offers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allOffers.filter(offer => isEligible(offer, user?.tier || 'starter')).map((item, index) => (
              <div key={`${item.id}-${index}`} className="relative h-[450px] rounded-3xl overflow-hidden shadow-premium group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
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
                    <div className="bg-gradient-to-r from-[#D97706] to-[#F59E0B] px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                      <Crown className="w-3.5 h-3.5 text-white" />
                      <span className="text-[10px] font-bold text-white tracking-wider uppercase">Elite Only</span>
                    </div>
                  )}

                  {/* Heart Icon */}
                  <button 
                    onClick={(e) => handleToggleWishlist(e, item.id)}
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 hover:bg-white/30 hover:scale-110 active:scale-95 transition-all group/heart"
                    aria-label={user?.wishlist?.includes(item.id) ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart 
                      className={`w-5 h-5 transition-all duration-300 ${
                        user?.wishlist?.includes(item.id) 
                          ? "fill-red-500 text-red-500 scale-110" 
                          : "text-white group-hover/heart:text-red-500"
                      }`} 
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
                    
                    <button className="bg-white text-black text-sm font-bold py-3.5 px-7 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-105 active:scale-95 transition-all duration-300">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
