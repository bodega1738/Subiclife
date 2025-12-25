"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Shield, Gift, Percent, Headphones, Anchor, Hotel, Star, Crown, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PaymentModal } from "@/components/payment/payment-modal"
import { useUser } from "@/lib/user-context"
import { cn } from "@/lib/utils"

interface TierInfo {
  id: "basic" | "premium" | "elite"
  name: string
  price: number
  accentColor: string
  benefits: { icon: React.ReactNode; text: string }[]
  recommended?: boolean
  description: string
}

const tiers: TierInfo[] = [
  {
    id: "basic",
    name: "BASIC",
    price: 500,
    accentColor: "#16a34a",
    description: "Essential perks for the casual explorer.",
    benefits: [
      { icon: <Shield className="w-4 h-4" />, text: "₱100k Travel Insurance" },
      { icon: <Percent className="w-4 h-4" />, text: "10% Partner Discounts" },
      { icon: <Headphones className="w-4 h-4" />, text: "Standard Concierge" },
    ],
  },
  {
    id: "premium",
    name: "PREMIUM",
    price: 5000,
    accentColor: "#D97706", // Gold
    recommended: true,
    description: "The most popular choice for frequent visitors.",
    benefits: [
      { icon: <Shield className="w-4 h-4" />, text: "₱500k Premium Insurance" },
      { icon: <Hotel className="w-4 h-4" />, text: "1 Free Hotel Night Stay" },
      { icon: <Percent className="w-4 h-4" />, text: "20% VIP Discounts" },
      { icon: <Headphones className="w-4 h-4" />, text: "24/7 Priority Support" },
    ],
  },
  {
    id: "elite",
    name: "ELITE",
    price: 25000,
    accentColor: "#0A74DA",
    description: "Ultimate luxury and exclusive privileges.",
    benefits: [
      { icon: <Shield className="w-4 h-4" />, text: "₱1M Elite Insurance" },
      { icon: <Anchor className="w-4 h-4" />, text: "Private Yacht Experience (3hrs)" },
      { icon: <Hotel className="w-4 h-4" />, text: "Luxury Hotel Night Stay" },
      { icon: <Gift className="w-4 h-4" />, text: "Dedicated Personal Concierge" },
    ],
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
    <div className="min-h-[100dvh] flex flex-col relative overflow-hidden bg-slate-50">
       {/* Background Glows (Matching Onboarding) */}
       <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[60%] bg-[#135bec]/20 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />
      <div className="absolute top-[10%] right-[-15%] w-[70%] h-[50%] bg-teal-300/30 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[80%] h-[60%] bg-orange-300/30 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />
      
      {/* Content */}
      <div className="flex-1 flex flex-col relative z-10 p-6 overflow-y-auto no-scrollbar">
        <div className="max-w-md mx-auto w-full space-y-8 pt-4 pb-24">
          
          <div className="text-center space-y-3">
            <Badge variant="outline" className="bg-white/50 backdrop-blur-sm border-slate-200 text-slate-600 mb-2">
              Membership Tiers
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">Experience Subic<br/>Like a <span className="text-[#135bec]">VIP</span></h1>
            <p className="text-slate-500 text-base leading-relaxed max-w-[300px] mx-auto">
              Unlock exclusive privileges, priority access, and peace of mind for your travels.
            </p>
          </div>

          <div className="space-y-6">
            {tiers.map((tier) => (
              <Card
                key={tier.id}
                className={cn(
                  "relative overflow-hidden transition-all duration-300 border-0",
                  tier.recommended 
                    ? "bg-gradient-to-br from-[#1f2937] to-[#111827] text-white shadow-xl shadow-slate-900/10 scale-[1.02]" 
                    : "bg-white/80 backdrop-blur-md shadow-sm hover:shadow-md text-slate-900"
                )}
              >
                {tier.recommended && (
                  <div className="absolute top-0 right-0 p-3">
                    <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 font-bold tracking-wide shadow-lg">
                      BEST VALUE
                    </Badge>
                  </div>
                )}

                <CardContent className="p-6">
                  {/* Header */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      {tier.id === 'elite' && <Crown className="w-5 h-5 text-[#0A74DA]" />}
                      {tier.id === 'premium' && <Star className="w-5 h-5 text-amber-400 fill-amber-400" />}
                      <h3 className={cn(
                        "text-sm font-bold uppercase tracking-[0.2em]",
                        tier.recommended ? "text-slate-400" : "text-slate-500"
                      )}>{tier.name}</h3>
                    </div>
                    
                    <div className="flex items-baseline gap-1">
                      <span className={cn(
                        "text-3xl font-bold tracking-tight",
                        tier.recommended 
                          ? "bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400" 
                          : "text-slate-900"
                      )}>
                        ₱{tier.price.toLocaleString()}
                      </span>
                      <span className={cn(
                        "text-sm font-medium",
                        tier.recommended ? "text-slate-400" : "text-slate-500"
                      )}>/year</span>
                    </div>
                    
                    <p className={cn(
                      "text-sm mt-3 leading-relaxed",
                      tier.recommended ? "text-slate-300" : "text-slate-500"
                    )}>
                      {tier.description}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className={cn(
                    "h-px w-full mb-6",
                    tier.recommended ? "bg-white/10" : "bg-slate-100"
                  )} />

                  {/* Benefits */}
                  <ul className="space-y-4 mb-8">
                    {tier.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3.5">
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                          tier.recommended ? "bg-white/10" : "bg-blue-50"
                        )}>
                          <Check className={cn(
                            "w-3.5 h-3.5",
                            tier.recommended ? "text-amber-400" : "text-[#135bec]"
                          )} />
                        </div>
                        <span className={cn(
                          "text-sm font-medium leading-tight pt-1",
                          tier.recommended ? "text-slate-200" : "text-slate-700"
                        )}>{benefit.text}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handleSelectTier(tier)}
                    className={cn(
                      "w-full rounded-full font-bold h-12 text-sm tracking-wide transition-all active:scale-[0.98]",
                      tier.recommended 
                        ? "bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white shadow-lg shadow-orange-500/20 border-0" 
                        : "bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-200"
                    )}
                  >
                    {tier.recommended ? "Claim VIP Access" : `Select ${tier.name}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

        </div>
      </div>

      {/* Fixed Bottom Action */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white/95 to-transparent z-20">
        <div className="max-w-md mx-auto text-center">
          <button 
            onClick={handleSkip}
            className="text-slate-400 hover:text-slate-600 font-medium text-xs transition-colors py-2 px-4"
          >
            Maybe later, I'll stick to the free plan for now
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
