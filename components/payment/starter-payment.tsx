"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Shield, Percent, Headphones, CreditCard, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUser } from "@/lib/user-context"

export function StarterPayment() {
  const router = useRouter()
  const { user, upgradeTier } = useUser()
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const [name, setName] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    return parts.length ? parts.join(" ") : value
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
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsProcessing(false)
    setIsComplete(true)
    upgradeTier("starter")
    await new Promise((resolve) => setTimeout(resolve, 1500))
    router.push("/home")
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome to Subic.Life!</h2>
          <p className="text-slate-600">Your Starter membership is now active.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-slate-900">Get Started</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Package Card */}
        <Card className="overflow-hidden border-0 shadow-sm">
          <div className="h-1 bg-[#0A74DA]" />
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Starter Package</h2>
              <div className="text-right">
                <span className="text-2xl font-bold text-[#0A74DA]">₱100</span>
                <span className="text-slate-500 text-sm">/year</span>
              </div>
            </div>

            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-[#0A74DA]" />
                </div>
                <span className="text-sm text-slate-700">₱25,000 Travel Insurance Coverage</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Percent className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm text-slate-700">5% Discounts at Partner Establishments</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <Headphones className="w-4 h-4 text-orange-600" />
                </div>
                <span className="text-sm text-slate-700">AI Concierge Access</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <h3 className="text-base font-semibold text-slate-900 mb-4">Payment Method</h3>

            <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="card">Card</TabsTrigger>
                <TabsTrigger value="gcash">GCash</TabsTrigger>
                <TabsTrigger value="paymaya">PayMaya</TabsTrigger>
              </TabsList>

              <TabsContent value="card">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-700">Card Number</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        placeholder="4242 4242 4242 4242"
                        maxLength={19}
                        className="h-12 pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-700">Expiry</Label>
                      <Input
                        type="text"
                        value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="h-12"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700">CVV</Label>
                      <Input
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="123"
                        maxLength={4}
                        className="h-12"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-700">Cardholder Name</Label>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="JUAN DELA CRUZ"
                      className="h-12 uppercase"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full h-12 text-base font-semibold bg-[#0A74DA] hover:bg-[#0960b5]"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Pay ₱100 & Unlock Access"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="gcash">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <img src="/logos/gcash.png" alt="GCash" className="h-10 mx-auto mb-2" />
                    <p className="text-sm text-slate-600">You will be redirected to GCash to complete payment</p>
                  </div>
                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full h-12 text-base font-semibold bg-[#007DFE] hover:bg-[#0066CC]"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Pay with GCash"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="paymaya">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <img src="/paymaya-maya-logo-green.jpg" alt="PayMaya" className="h-10 mx-auto mb-2" />
                    <p className="text-sm text-slate-600">You will be redirected to Maya to complete payment</p>
                  </div>
                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full h-12 text-base font-semibold bg-[#00B14F] hover:bg-[#009940]"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Pay with Maya"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
