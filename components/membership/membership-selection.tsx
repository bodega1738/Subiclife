"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, Shield, Gift, Percent, Headphones, Anchor, Hotel } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PaymentModal } from "@/components/payment/payment-modal"
import { useUser } from "@/lib/user-context"

interface TierInfo {
  id: "basic" | "premium" | "elite"
  name: string
  price: number
  accentColor: string
  benefits: { icon: React.ReactNode; text: string }[]
  recommended?: boolean
}

const tiers: TierInfo[] = [
  {
    id: "basic",
    name: "BASIC",
    price: 500,
    accentColor: "#16a34a",
    benefits: [
      { icon: <Shield className="w-4 h-4" />, text: "₱100,000 Insurance Coverage" },
      { icon: <Percent className="w-4 h-4" />, text: "10% Partner Discounts" },
      { icon: <Headphones className="w-4 h-4" />, text: "Priority Concierge Access" },
    ],
  },
  {
    id: "premium",
    name: "PREMIUM",
    price: 5000,
    accentColor: "#f97316",
    recommended: true,
    benefits: [
      { icon: <Shield className="w-4 h-4" />, text: "₱500,000 Insurance Coverage" },
      { icon: <Hotel className="w-4 h-4" />, text: "1 Free Hotel Night" },
      { icon: <Percent className="w-4 h-4" />, text: "20% Partner Discounts" },
      { icon: <Headphones className="w-4 h-4" />, text: "VIP Support" },
    ],
  },
  {
    id: "elite",
    name: "ELITE",
    price: 25000,
    accentColor: "#0A74DA",
    benefits: [
      { icon: <Shield className="w-4 h-4" />, text: "₱1,000,000 Insurance Coverage" },
      { icon: <Anchor className="w-4 h-4" />, text: "3-Hour Yacht Cruise" },
      { icon: <Hotel className="w-4 h-4" />, text: "1 Free Hotel Night" },
      { icon: <Percent className="w-4 h-4" />, text: "25% Partner Discounts" },
      { icon: <Gift className="w-4 h-4" />, text: "VIP Concierge Service" },
    ],
  },
]

export function MembershipSelection() {
  const router = useRouter()
  const { user } = useUser()
  const [selectedTier, setSelectedTier] = useState<TierInfo | null>(null)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)

  const currentTierIndex = user?.tier ? ["starter", "basic", "premium", "elite"].indexOf(user.tier) : -1

  const handleSelectTier = (tier: TierInfo) => {
    setSelectedTier(tier)
    setIsPaymentOpen(true)
  }

  const getTierIndex = (tierId: string) => {
    return ["starter", "basic", "premium", "elite"].indexOf(tierId)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="text-xl font-bold text-slate-900">Choose Your Plan</h1>
        </div>
      </div>

      {/* Tier Cards */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        {tiers.map((tier) => {
          const tierIndex = getTierIndex(tier.id)
          const isCurrentTier = user?.tier === tier.id
          const isBelowCurrent = tierIndex <= currentTierIndex

          return (
            <Card
              key={tier.id}
              className={`relative overflow-hidden shadow-sm border-0 ${isBelowCurrent && !isCurrentTier ? "opacity-50" : ""}`}
            >
              {/* Accent top border */}
              <div className="h-1 w-full" style={{ backgroundColor: tier.accentColor }} />

              {tier.recommended && !isBelowCurrent && (
                <Badge className="absolute top-3 right-3 bg-orange-500 hover:bg-orange-500 text-white text-xs">
                  Recommended
                </Badge>
              )}

              {isCurrentTier && (
                <Badge className="absolute top-3 right-3 bg-green-500 hover:bg-green-500 text-white text-xs">
                  Current Plan
                </Badge>
              )}

              <CardContent className="p-4">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-slate-500 tracking-wider">{tier.name}</h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-bold text-slate-900">₱{tier.price.toLocaleString()}</span>
                    <span className="text-slate-500">/year</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-4">
                  {tier.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-sm text-slate-700">{benefit.text}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSelectTier(tier)}
                  disabled={isBelowCurrent}
                  variant={tier.recommended && !isBelowCurrent ? "default" : "outline"}
                  className={`w-full h-11 font-semibold ${
                    isCurrentTier
                      ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                      : isBelowCurrent
                        ? "opacity-50"
                        : tier.recommended
                          ? "bg-orange-500 hover:bg-orange-600"
                          : tier.id === "elite"
                            ? "bg-[#0A74DA] hover:bg-[#0960b5] text-white"
                            : ""
                  }`}
                >
                  {isCurrentTier
                    ? "Current Plan"
                    : isBelowCurrent
                      ? "Already Unlocked"
                      : `Upgrade to ${tier.name.charAt(0) + tier.name.slice(1).toLowerCase()}`}
                </Button>
              </CardContent>
            </Card>
          )
        })}
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
