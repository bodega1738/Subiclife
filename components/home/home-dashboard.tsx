"use client"

import React from "react"
import Link from "next/link"
import { Search, Star, ArrowRight, Heart, MapPin, SlidersHorizontal, Crown } from "lucide-react"
import { partners } from "@/lib/partners-data"
import { useUser } from "@/lib/user-context"

export function HomeDashboard() {
  const { user } = useUser()
  
  // Flatten all offers from all partners into a single list
  const allOffers = partners.flatMap(partner => 
    (partner.offers || []).map(offer => ({
      ...partner,
      currentOffer: offer
    }))
  )

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
                Good morning,<br /><span className="font-bold">Alfred.</span>
              </h1>
            </div>
            <div className="mt-1">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-black shadow-premium border border-gray-800">
                <Crown className="w-3.5 h-3.5 text-subic-gold mr-1.5" />
                <span className="text-[10px] font-bold text-white tracking-widest uppercase">Elite Member</span>
              </div>
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
                <div className="absolute top-5 right-5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                  <span className="text-[10px] font-bold text-white tracking-wider uppercase">{partner.category}</span>
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
                      <span className="text-xl font-bold text-white">{partner.discount}% OFF</span>
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
            <button className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors">
              <SlidersHorizontal className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <div className="space-y-4">
            {allOffers.map((item, index) => (
              <div key={`${item.id}-${index}`} className="bg-white/80 backdrop-blur-md dark:bg-card-dark rounded-[1.5rem] p-3 shadow-sm hover:shadow-md transition-all border border-gray-100/50 flex gap-4 h-36 items-center group cursor-pointer">
                <div className="w-32 h-full flex-shrink-0 rounded-[1.2rem] overflow-hidden relative shadow-inner">
                  <img 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    src={item.image || item.logo || "/placeholder.jpg"} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>
                  <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-bold text-gray-900 tracking-wide border border-white/50 uppercase shadow-sm">
                    {item.category}
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-between h-full py-1.5">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight font-sans line-clamp-1">{item.name}</h3>
                      <Heart className="w-5 h-5 text-gray-300 hover:text-red-500 hover:fill-red-500 transition-colors cursor-pointer" />
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mt-1.5">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-subic-blue" />
                      <span className="truncate">Subic Bay</span>
                    </div>
                  </div>
                  
                  {/* Offer Display */}
                  <div className="mt-auto">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="px-2 py-0.5 bg-blue-50 rounded-md border border-blue-100">
                        <span className="text-[10px] font-bold text-subic-blue line-clamp-1">
                          {item.currentOffer}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-end justify-between mt-1">
                      <div>
                         <p className="text-[10px] text-gray-400 mt-1 font-medium uppercase tracking-wide">
                           {item.discount}% MEMBER DISCOUNT
                         </p>
                      </div>
                      <button className="bg-black text-white text-xs font-bold py-2.5 px-5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95">
                        Book
                      </button>
                    </div>
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
