"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Shield, Gift, Percent, Headphones, Anchor, Star, Sparkles, ArrowRight, ChevronRight, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PaymentModal } from "@/components/payment/payment-modal"
import { useUser } from "@/lib/user-context"
import { cn } from "@/lib/utils"

interface TierInfo {
  id: "basic" | "premium" | "elite"
  name: string
  displayName: string
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
    displayName: "Essential",
    price: 550,
    copy: "Foundation of Luxury",
    tagline: "The curated Subic entry",
    accentColor: "#135bec",
    image: "/subic-bay-aerial-view-blue-ocean-tropical.jpg",
    mainBenefits: [
      "₱100k Accident Insurance",
      "10% Partner Discounts",
      "Digital Membership Card",
      "Event Access"
    ]
  },
  {
    id: "premium",
    name: "Premium",
    displayName: "Signature",
    price: 5500,
    copy: "The Distinguished Choice",
    tagline: "Refined access for the elite guest",
    accentColor: "#D97706",
    recommended: true,
    image: "/luxury-resort-suite-ocean-view-sunset.jpg",
    mainBenefits: [
      "₱500k Accident Insurance",
      "15% Partner Discounts",
      "24/7 AI Concierge",
      "Priority Event Access"
    ]
  },
  {
    id: "elite",
    name: "Elite",
    displayName: "The Sovereign",
    price: 25500,
    copy: "Ultimate Lifestyle Mastery",
    tagline: "Uncompromising Subic excellence",
    accentColor: "#D97706",
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
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col relative overflow-hidden font-sans text-gray-900 selection:bg-[#135bec]/10">
      
      {/* Soft Blending Premium Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#F9FAFB]">
        {/* Large, soft color bleeds */}
        <div className="absolute top-[-15%] left-[-10%] w-[70%] h-[60%] bg-[#135bec]/10 blur-[120px] rounded-full" />
        <div className="absolute top-[10%] right-[-5%] w-[60%] h-[50%] bg-[#10B981]/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[60%] bg-[#D97706]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] left-[-15%] w-[50%] h-[50%] bg-[#135bec]/5 blur-[100px] rounded-full" />
      </div>
      
      {/* Main Scrollable Content */}
      <div className="relative z-10 flex-1 flex flex-col p-6 pb-48 max-w-lg mx-auto w-full">
        
        {/* BFF Style Header */}
        <header className="pt-12 pb-12 text-center space-y-2 animate-in fade-in slide-in-from-top-4 duration-1000">
          <p className="text-lg font-bold text-gray-500 tracking-tight">Hello, Subic!</p>
          <h1 className="text-5xl font-black tracking-tight text-gray-900 leading-tight">
            Welcome to<br/>
            <span className="text-[#135bec]">The Life.</span>
          </h1>
          <p className="text-gray-500 text-base font-medium max-w-[280px] mx-auto leading-relaxed pt-4">
            You are one step closer to unlocking premium island perks.
          </p>
        </header>

        {/* BFF-Inspired Membership Cards */}
        <div className="space-y-10">
          {tiers.map((tier) => (
            <div 
              key={tier.id}
              onClick={() => handleSelectTier(tier)}
              className={cn(
                "group relative flex flex-col p-7 rounded-[3rem] transition-all duration-700 cursor-pointer active:scale-[0.98]",
                "bg-white border border-gray-100/50 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.06)] hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] hover:-translate-y-2",
                tier.recommended && "ring-2 ring-[#D97706]/10 border-[#D97706]/5"
              )}
            >
              {/* Inner BFF Member Card Visual */}
              <div className="relative aspect-square w-full rounded-[2.5rem] overflow-hidden mb-8 shadow-inner border border-gray-50">
                <img 
                  src={tier.image} 
                  alt={tier.name}
                  className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
                
                {/* Overlay Text on Image Card */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <h3 className="text-4xl font-black tracking-tighter text-white drop-shadow-2xl">
                    {tier.displayName}
                  </h3>
                  <div className="mt-2 px-4 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30">
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Member Card</p>
                  </div>
                </div>

                {/* Price Tag Floating on Image Card */}
                <div className="absolute bottom-6 right-6">
                   <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-white/50 flex flex-col items-end">
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-xs font-black text-gray-500">₱</span>
                        <span className="text-xl font-black text-gray-900">{tier.price.toLocaleString()}</span>
                      </div>
                    </div>
                </div>

                {/* Recommended Badge */}
                {tier.recommended && (
                  <div className="absolute top-6 left-6 bg-[#D97706] text-white text-[9px] font-black px-4 py-2 rounded-full shadow-lg tracking-widest uppercase flex items-center gap-1.5 ring-1 ring-white/20">
                    <Crown className="w-3 h-3 fill-white" />
                    Preferred
                  </div>
                )}
              </div>

              {/* Content Area */}
              <div className="px-2 flex flex-col items-center text-center">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">{tier.tagline}</p>
                
                <div className="space-y-3 mb-8 w-full">
                  {tier.mainBenefits.slice(0, 3).map((benefit, i) => (
                    <div key={i} className="flex items-center justify-center gap-2">
                      <Check className="w-4 h-4 text-[#10B981]" />
                      <span className="text-sm font-semibold text-gray-600">{benefit}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  className="w-full h-14 rounded-full bg-black text-white hover:bg-gray-800 font-bold transition-all flex items-center justify-center gap-2 group/btn"
                >
                  Get {tier.displayName}
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* BFF Rewards Section */}
        <div className="mt-16 p-10 rounded-[3rem] bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.06)] relative overflow-hidden group transition-all duration-700 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center shadow-inner border border-gray-100 mb-2">
              <Gift className="w-8 h-8 text-[#D97706]" />
            </div>
            <div className="space-y-2">
              <h4 className="text-2xl font-black tracking-tight text-gray-900">Privilege Rewards</h4>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">Your activity is your currency. Unlock the curated catalog of exclusive rewards.</p>
            </div>
            
            <Button 
              onClick={() => router.push('/rewards')}
              variant="outline"
              className="rounded-full h-12 px-8 border-gray-200 text-gray-900 font-bold hover:bg-gray-50 transition-all"
            >
              Enter Catalog
            </Button>
          </div>
        </div>

        {/* Ultimate Breathing Room */}
        <div className="h-40" />

      </div>

      {/* BFF Style Fixed Action Area */}
      <div className="fixed bottom-0 left-0 right-0 p-8 pb-10 bg-gradient-to-t from-white via-white/95 to-transparent z-40 backdrop-blur-sm">
        <div className="max-w-lg mx-auto flex flex-col items-center space-y-4">
          <button 
            onClick={handleSkip}
            className="w-full py-5 px-8 rounded-full bg-gray-50 text-gray-900 font-bold text-sm shadow-sm hover:bg-gray-100 active:scale-[0.98] transition-all flex items-center justify-center gap-3 border border-gray-200 group"
          >
            <span>Maintain Basic Registration</span>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <div className="flex items-center gap-2 opacity-40">
            <Shield className="w-3 h-3 text-gray-400" />
            <p className="text-[9px] text-gray-500 font-bold tracking-widest uppercase">Secured Premium Membership</p>
          </div>
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
