"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Star, ArrowRight, Heart, MapPin, SlidersHorizontal, Crown } from "lucide-react"
import { partners, allOffers } from "@/lib/partners-data"
import { useUser, discountPercentages } from "@/lib/user-context"
import { TierBadge } from "@/components/ui/tier-badge"
import { Offer } from "@/lib/types"
import { OfferBookingModal } from "@/components/booking/offer-booking-modal"
import { NotificationCenter } from "@/components/notifications/notification-center"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function Typewriter({ text, speed = 50 }: { text: string; speed?: number }) {
  const [displayText, setDisplayText] = React.useState('')
  
  React.useEffect(() => {
    let i = 0
    setDisplayText('')
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.substring(0, i + 1))
        i++
      } else {
        clearInterval(timer)
      }
    }, speed)

    return () => clearInterval(timer)
  }, [text, speed])

  return <span>{displayText}</span>
}

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

function isEligible(offer: Offer, tier: string): boolean {
  // Non-elite users cannot see elite-exclusive offers
  if (offer.isEliteExclusive && tier !== 'elite') {
    return false
  }
  return true
}

export function HomeDashboard() {
  const { user, toggleWishlist } = useUser()
  const router = useRouter()
  const [bookingOpen, setBookingOpen] = React.useState(false)
  const [bookingOffer, setBookingOffer] = React.useState<Offer | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")

  // Filter States
  const [filterCategories, setFilterCategories] = React.useState<string[]>([])
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 20000])
  const [sortBy, setSortBy] = React.useState<string>('discount-desc')
  const [filterDialogOpen, setFilterDialogOpen] = React.useState(false)

  const maxPrice = React.useMemo(() => {
    return Math.max(...allOffers.map(o => o.originalPrice || 0), 20000)
  }, [])

  const activeFilterCount = filterCategories.length + (sortBy !== 'discount-desc' ? 1 : 0) + (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0)

  function getFirstOfferForPartner(partnerId: string): Offer | null {
    return allOffers.find(o => o.partnerId === partnerId) || null
  }

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

  const eligibleOffers = React.useMemo(() => {
    return allOffers.filter(offer => isEligible(offer, user?.tier || 'starter'))
  }, [user?.tier])

  const categories = React.useMemo(() => {
    const uniqueCategories = new Set(eligibleOffers.map(offer => offer.category).filter((c): c is string => !!c))
    return ['all', ...Array.from(uniqueCategories)]
  }, [eligibleOffers])

  const filteredOffers = React.useMemo(() => {
    let result = eligibleOffers;
    
    // Multi-category filter (OR logic)
    if (filterCategories.length > 0) {
      result = result.filter(offer => 
        filterCategories.includes(offer.category || '')
      );
    }
    
    // Price range filter
    result = result.filter(offer => {
      const price = offer.originalPrice || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    
    // Sorting
    if (sortBy === 'discount-desc') {
      result = [...result].sort((a, b) => (b.discount || 0) - (a.discount || 0));
    } else if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => (a.originalPrice || 0) - (b.originalPrice || 0));
    } else if (sortBy === 'name-asc') {
      result = [...result].sort((a, b) => a.partnerName.localeCompare(b.partnerName));
    }
    
    console.log('Filtered Offers count:', result.length, 'Sample:', result[0]?.id)
    return result;
  }, [eligibleOffers, filterCategories, priceRange, sortBy]);

  return (
    <div className="relative min-h-screen w-full mx-auto overflow-hidden bg-white dark:bg-background-dark font-sans selection:bg-subic-blue selection:text-white">
      {/* Premium Gradient Background - Significantly more colorful/vibrant as requested */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#135bec]/25 via-white to-[#D97706]/25 z-0 pointer-events-none mix-blend-multiply"></div>
      <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-[#135bec]/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-20%] w-[400px] h-[400px] bg-[#06b6d4]/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[30%] w-[350px] h-[350px] bg-[#10B981]/15 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="relative z-10 h-full overflow-y-auto pb-28 no-scrollbar">
        <div className="px-8 pt-8 pb-2">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-xl font-sans font-bold text-gray-900 dark:text-white min-h-[1.75rem]">
                <Typewriter text={`${getTimeBasedGreeting()}, ${getFirstName(user?.name)}.`} />
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <NotificationCenter userId={user?.id} className="text-gray-600 hover:text-gray-900" />
            </div>
          </div>
          
          <div className="mb-12">
            <Link href="/pass" className="block group">
                    <div className="relative w-full max-w-[520px] mx-auto scale-[1.26] transition-all duration-500 group-hover:scale-[1.29] group-active:scale-[1.23] rounded-3xl overflow-hidden border-none">
                <img
                  src={
                    user?.tier === 'elite' ? '/elite-card-large.png' :
                    user?.tier === 'prestige' ? '/prestige-card-large.png' :
                    user?.tier === 'premium' ? '/premium-card-large.png' :
                    '/basic-card-large.png'
                  }
                  alt={`${user?.tier || 'Basic'} Membership Card`}
                  className="w-full h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.12)] filter"
                />
              </div>
            </Link>
          </div>

          <div className="relative mb-8 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400 group-focus-within:text-subic-blue transition-colors" />
            </div>
            <input 
              id="home-search"
              name="search"
              aria-label="Search for offers"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  e.preventDefault()
                  router.push(`/concierge?query=${encodeURIComponent(searchQuery.trim())}`)
                }
              }}
              className="block w-full pl-12 pr-4 py-4 bg-white dark:bg-input-dark rounded-3xl text-sm text-gray-900 dark:text-white placeholder-gray-400 shadow-premium border-none focus:outline-none focus:ring-0 focus-within:shadow-xl transition-all" 
              placeholder="Find me a yacht for Saturday..." 
              type="text" 
            />
          </div>
        </div>
        <div className="mb-10">
          <div className="px-8 mb-5 flex justify-between items-end">
            <h2 className="text-xl font-sans font-bold tracking-tight text-gray-900 dark:text-white">Deals for You</h2>
            <Link className="text-xs font-semibold tracking-wide text-subic-blue hover:text-blue-700 transition-colors" href="#">VIEW ALL</Link>
          </div>
          <div className="flex overflow-x-auto px-8 space-x-5 pb-8 no-scrollbar snap-x snap-mandatory">
            {curatedPartners.map((partner, index) => (
              <div key={`${partner.id}-${index}`} className="snap-center flex-shrink-0 relative w-[280px] h-[380px] rounded-3xl overflow-hidden shadow-xl shadow-gray-900/20 group cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
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
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 hover:bg-white/30 hover:shadow-lg hover:shadow-red-500/30 hover:scale-110 active:scale-95 transition-all group/heart"
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
                      <span className="text-xl font-bold text-white">
                        {getFirstOfferForPartner(partner.id)?.discount || `${discountPercentages[user?.tier || 'starter']}% OFF`}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        const firstOffer = getFirstOfferForPartner(partner.id)
                        if (!firstOffer) {
                          console.error('No offer found for partner:', partner.id)
                          return
                        }
                        console.log('Opening modal (Carousel):', { partnerId: partner.id, offerId: firstOffer.id, offerTitle: firstOffer.title })
                        setBookingOffer(firstOffer)
                        // Use setTimeout to ensure state update completes
                        setTimeout(() => setBookingOpen(true), 0)
                      }}
                      className="bg-white text-black text-sm font-bold py-3 px-6 rounded-full shadow-premium hover:shadow-xl hover:shadow-subic-blue/20 hover:-translate-y-1 hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="px-8">
          <div className="mb-5 flex justify-between items-end">
            <h2 className="text-xl font-sans font-bold tracking-tight text-gray-900 dark:text-white">Available Offers</h2>
            <button 
              onClick={() => setFilterDialogOpen(true)}
              className="relative p-2 bg-white dark:bg-card-dark rounded-full shadow-premium border border-gray-100 dark:border-white/10 hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              {activeFilterCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-subic-blue text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                  {activeFilterCount}
                </div>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredOffers.length === 0 ? (
              <div className="col-span-full py-20 text-center">
                <p className="text-gray-500 font-sans">No offers match your filters. Try adjusting your criteria.</p>
                <button 
                  onClick={() => {
                    setFilterCategories([])
                    setPriceRange([0, maxPrice])
                    setSortBy('discount-desc')
                  }}
                  className="mt-4 text-subic-blue font-bold text-sm uppercase tracking-wider"
                >
                  Reset all filters
                </button>
              </div>
            ) : filteredOffers.map((item, index) => (
              <div key={`${item.id}-${index}`} className="relative h-[450px] rounded-3xl overflow-hidden shadow-premium hover:shadow-2xl hover:shadow-subic-blue/10 group cursor-pointer transition-all duration-300 hover:scale-[1.02]">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    alt={item.partnerName} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    src={item.image || "/placeholder.jpg"} 
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

                  {/* Heart Icon */}
                  <button 
                    onClick={(e) => handleToggleWishlist(e, item.id)}
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 hover:bg-white/30 hover:shadow-lg hover:shadow-red-500/30 hover:scale-110 active:scale-95 transition-all duration-300 group/heart"
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
                    
                    <button
                      onClick={() => {
                        console.log('Opening modal (Grid):', { offerId: item.id, offerTitle: item.title, category: item.category })
                        setBookingOffer(item)
                        // Use setTimeout to ensure state update completes
                        setTimeout(() => setBookingOpen(true), 0)
                      }}
                      className="bg-white text-black text-sm font-bold py-3 px-6 rounded-full shadow-premium hover:shadow-xl hover:shadow-subic-blue/20 hover:-translate-y-1 hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <OfferBookingModal 
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        offer={bookingOffer}
      />

      {/* Filter Dialog */}
      <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
        <DialogContent className="max-w-md rounded-3xl shadow-2xl border-none bg-white/90 backdrop-blur-xl p-0 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#135bec]/8 via-white to-[#D97706]/8 rounded-3xl pointer-events-none -z-10" />
          
          <div className="relative z-10 p-6 space-y-8">
            <DialogHeader className="mb-2">
              <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900">Filter Offers</DialogTitle>
            </DialogHeader>

            {/* Categories Section */}
            <section className="rounded-3xl bg-gray-50/50 p-6 border border-gray-100">
              <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-4">Categories</h3>
              <div className="grid grid-cols-2 gap-3">
                {categories.filter(c => c !== 'all').map((category) => (
                  <div key={category} className="flex items-center space-x-3 p-3 rounded-2xl bg-white hover:bg-gray-50 transition-colors cursor-pointer group shadow-sm border border-gray-50">
                    <Checkbox 
                      id={`cat-${category}`}
                      checked={filterCategories.includes(category)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilterCategories(prev => [...prev, category]);
                        } else {
                          setFilterCategories(prev => prev.filter(c => c !== category));
                        }
                      }}
                      className="rounded-md border-gray-300 data-[state=checked]:bg-subic-blue data-[state=checked]:border-subic-blue"
                    />
                    <Label 
                      htmlFor={`cat-${category}`}
                      className="text-sm font-medium capitalize cursor-pointer flex-grow"
                    >
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </section>

            {/* Price Range Section */}
            <section className="rounded-3xl bg-gray-50/50 p-6 border border-gray-100">
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-500">Price Range</h3>
                <span className="text-sm font-bold text-subic-blue">
                  ₱{priceRange[0].toLocaleString()} - ₱{priceRange[1].toLocaleString()}
                </span>
              </div>
              <div className="px-2">
                <Slider
                  min={0}
                  max={maxPrice}
                  step={500}
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  className="mt-6"
                />
              </div>
            </section>

            {/* Sort By Section */}
            <section className="rounded-3xl bg-gray-50/50 p-6 border border-gray-100">
              <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-4">Sort By</h3>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full h-12 rounded-2xl border-gray-100 bg-white text-sm font-medium focus:ring-subic-blue/20 shadow-sm">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-gray-100 shadow-premium">
                  <SelectItem value="discount-desc" className="rounded-xl focus:bg-subic-blue/5">Highest Discount</SelectItem>
                  <SelectItem value="price-asc" className="rounded-xl focus:bg-subic-blue/5">Lowest Price</SelectItem>
                  <SelectItem value="name-asc" className="rounded-xl focus:bg-subic-blue/5">Name (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </section>
          </div>

          <DialogFooter className="p-6 bg-white/80 backdrop-blur-md border-t border-gray-100 flex flex-row gap-4 sm:justify-between items-center relative z-10">
            <button 
              onClick={() => {
                setFilterCategories([])
                setPriceRange([0, maxPrice])
                setSortBy('discount-desc')
              }}
              className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-all uppercase tracking-wider hover:bg-gray-100 px-4 py-2 rounded-full"
            >
              Reset
            </button>
            <button 
              onClick={() => setFilterDialogOpen(false)}
              className="bg-subic-blue text-white text-sm font-bold py-3 px-8 rounded-full shadow-xl shadow-subic-blue/30 hover:shadow-2xl hover:shadow-subic-blue/40 hover:-translate-y-0.5 transition-all hover:scale-105 active:scale-95"
            >
              Show {filteredOffers.length} {filteredOffers.length === 1 ? 'Offer' : 'Offers'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
