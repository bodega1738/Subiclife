"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Shield, Gift, Percent, Headphones, Anchor, Star, Sparkles, ArrowRight, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PaymentModal } from "@/components/payment/payment-modal"
import { useUser } from "@/lib/user-context"
import { cn } from "@/lib/utils"

interface TierInfo {
  id: "basic" | "premium" | "elite"
  name: string
  price: number
  copy: string
  tagline: string
  accentColor: string
  recommended?: boolean
  image?: string
  mainBenefits: string[]
}

const tiers: TierInfo[] = [
  {
    id: "basic",
    name: "Basic",
    price: 550,
    copy: "Elevate Your Weekend",
    tagline: "The essential Subic experience",
    accentColor: "#135bec",
    image: "/subic-bay-aerial-view-blue-ocean-tropical.jpg",
    mainBenefits: [
      "₱100k Accident Insurance",
      "10% Partner Discounts",
      "Digital Membership Card"
    ]
  },
  {
    id: "premium",
    name: "Premium",
    price: 5500,
    copy: "The Full Experience",
    tagline: "Our most popular choice",
    accentColor: "#D97706",
    recommended: true,
    image: "/luxury-resort-suite-ocean-view-sunset.jpg",
    mainBenefits: [
      "₱500k Accident Insurance",
      "15% Partner Discounts",
      "24/7 AI Concierge & Booking",
      "Exclusive Event Access"
    ]
  },
  {
    id: "elite",
    name: "Elite",
    price: 25500,
    copy: "Limitless Luxury",
    tagline: "For the discerning explorer",
    accentColor: "#111318",
    image: "/luxury-yacht-cruise-sunset-subic-bay.jpg",
    mainBenefits: [
      "₱1M Accident Insurance",
      "Private Yacht Cruise (20pax)",
      "20% Partner Discounts",
      "Dedicated Personal Concierge"
    ]
  },
]

export function MembershipOffer() {
  const router = useRouter()
  const { user } = useUser()
  const [selectedTier, setSelectedTier] = useState<TierInfo | null>(null)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)

  const handleSelectTier = (tier: TierInfo) => {
    setSelectedTier(tier)
    setIsPaymentOpen(true)
  }

  const handleSkip = () => {
    router.push("/home")
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col relative overflow-hidden font-sans">
      {/* "Northern Lights" Background Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#135bec]/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] bg-[#D97706]/5 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-teal-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col p-6 pb-32 max-w-lg mx-auto w-full">
        
        {/* Header Section */}
        <header className="pt-8 pb-10 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 backdrop-blur-md border border-white/20 shadow-sm mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Membership Tiers</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#111318] leading-[1.1]">
            Experience Subic <br/>
            <span className="text-[#135bec]">Without Limits.</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium max-w-[280px] mx-auto leading-relaxed">
            Select a plan to unlock premium benefits and exclusive local access.
          </p>
        </header>

        {/* Tiers Scrollable Rail */}
        <div className="space-y-8">
          {tiers.map((tier) => (
            <div 
              key={tier.id}
              onClick={() => handleSelectTier(tier)}
              className={cn(
                "group relative overflow-hidden rounded-[2rem] transition-all duration-500 cursor-pointer active:scale-[0.98]",
                "bg-white border border-white shadow-premium",
                tier.recommended && "ring-2 ring-[#D97706]/20 border-[#D97706]/10"
              )}
            >
              {/* Card Image Wrapper */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={tier.image} 
                  alt={tier.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
                
                {/* Floating Price Tag */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm border border-white/50">
                  <span className="text-lg font-bold text-[#111318]">₱{tier.price.toLocaleString()}</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider ml-1">/yr</span>
                </div>

                {/* Recommended Badge */}
                {tier.recommended && (
                  <div className="absolute top-4 left-4 bg-[#D97706] text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg shadow-orange-500/20 tracking-widest uppercase flex items-center gap-1.5">
                    <Star className="w-3 h-3 fill-white" />
                    Most Popular
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div className="p-8 pt-2">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-[#111318] mb-1">{tier.name}</h3>
                    <p className="text-sm font-medium text-gray-400">{tier.tagline}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#135bec] group-hover:text-white transition-colors duration-300">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-3">
                  {tier.mainBenefits.slice(0, 3).map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#135bec]/5 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-[#135bec] stroke-[3]" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Accent Line */}
              <div 
                className="h-1.5 w-full" 
                style={{ backgroundColor: tier.accentColor }} 
              />
            </div>
          ))}
        </div>

        {/* Rewards Preview (Aesthetic Placeholder based on screenshot) */}
        <div className="mt-12 p-8 rounded-[2rem] bg-white/40 backdrop-blur-xl border border-white/50 shadow-sm text-center space-y-4">
          <div className="flex flex-col items-center">
             <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Gift className="w-6 h-6 text-gray-400" />
             </div>
             <p className="text-sm font-semibold text-gray-500">Hmm, no available rewards at the moment. Stay tuned!</p>
          </div>
          <Button 
            variant="ghost" 
            className="w-full rounded-full bg-white/60 hover:bg-white text-gray-900 font-bold border border-white/80 shadow-sm"
          >
            Go to Rewards
          </Button>
        </div>

      </div>

      {/* Sticky Bottom Navigation (Skip Action) */}
      <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#F9FAFB] via-[#F9FAFB]/80 to-transparent z-20">
        <div className="max-w-md mx-auto">
          <button 
            onClick={handleSkip}
            className="w-full py-4 px-6 rounded-full bg-[#111318] text-white font-bold text-sm tracking-wide shadow-xl shadow-gray-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
          >
            I'll stick to the Registration Plan
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {selectedTier && (
        <PaymentModal
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          tier={selectedTier.id}
          amount={selectedTier.price}
        />
      )}
    </div>
  )
}
