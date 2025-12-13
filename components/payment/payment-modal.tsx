"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { X, CreditCard, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUser } from "@/lib/user-context"
import type { MembershipTier } from "@/lib/types"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  tier: MembershipTier
  amount: number
}

export function PaymentModal({ isOpen, onClose, tier, amount }: PaymentModalProps) {
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const [cardName, setCardName] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { upgradeTier } = useUser()
  const router = useRouter()

  if (!isOpen) return null

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    return parts.length ? parts.join(" ") : v
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setIsProcessing(false)
    setIsSuccess(true)

    // Upgrade user tier
    if (tier) {
      upgradeTier(tier)
    }

    // Redirect after success
    await new Promise((resolve) => setTimeout(resolve, 1500))
    onClose()
    router.push("/home")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-slate-900">Complete Payment</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Payment Successful</h3>
            <p className="text-slate-600 text-center">Welcome to {tier?.toUpperCase()} membership!</p>
          </div>
        ) : (
          <div className="p-4">
            {/* Amount Display */}
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-slate-900">₱{amount.toLocaleString()}</div>
              <p className="text-sm text-slate-500 mt-1">{tier?.toUpperCase()} Membership - Monthly</p>
            </div>

            {/* Payment Method Tabs */}
            <Tabs defaultValue="card" className="mb-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="card">Card</TabsTrigger>
                <TabsTrigger value="gcash">GCash</TabsTrigger>
                <TabsTrigger value="paymaya">PayMaya</TabsTrigger>
              </TabsList>

              <TabsContent value="card" className="mt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <div className="relative">
                      <Input
                        id="cardNumber"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="h-11 pl-10"
                        required
                      />
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="h-11"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                        placeholder="123"
                        maxLength={3}
                        className="h-11"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Juan Dela Cruz"
                      className="h-11"
                      required
                    />
                  </div>

                  {/* Security badges */}
                  <div className="flex items-center justify-center gap-4 py-2">
                    <img src="/visa-logo-generic.png" alt="Visa" className="h-6" />
                    <img src="/mastercard-logo.png" alt="Mastercard" className="h-6" />
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      SSL Secured
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full h-12 text-base font-semibold bg-[#0A74DA] hover:bg-[#0960b5]"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Pay ₱${amount.toLocaleString()}`
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="gcash" className="mt-4">
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">G</span>
                  </div>
                  <p className="text-slate-600 mb-4">You will be redirected to GCash to complete payment</p>
                  <Button className="w-full h-12 bg-blue-500 hover:bg-blue-600">Continue with GCash</Button>
                </div>
              </TabsContent>

              <TabsContent value="paymaya" className="mt-4">
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">P</span>
                  </div>
                  <p className="text-slate-600 mb-4">You will be redirected to PayMaya to complete payment</p>
                  <Button className="w-full h-12 bg-green-500 hover:bg-green-600">Continue with PayMaya</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}
