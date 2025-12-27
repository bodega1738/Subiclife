"use client"

import * as React from "react"
import { useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Smartphone, CheckCircle2, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Offer, PaymentQRData } from "@/lib/types"
import { useMockDBStore } from "@/lib/mock-db"

interface GCashQRModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  offer: Offer | null
  bookingDetails?: Record<string, unknown>
  bookingId?: string
}

export function GCashQRModal({
  open,
  onOpenChange,
  offer,
  bookingDetails,
  bookingId
}: GCashQRModalProps) {
  const { toast } = useToast()
  const updateBooking = useMockDBStore((state) => state.updateBooking)
  const [isProcessing, setIsProcessing] = useState(false)

  // Generate booking reference
  const bookingReference = React.useMemo(() => {
    return bookingId || `SL-${Date.now()}`
  }, [open, bookingId])

  // Generate QR code data
  const qrData = React.useMemo((): PaymentQRData => {
    const amount = offer?.discountedPrice || offer?.originalPrice || 0
    return {
      booking_reference: bookingReference,
      merchant_name: offer?.partnerName || "Subic.Life Partner",
      amount: amount,
      timestamp: new Date().toISOString(),
      payment_method: "gcash",
      status: "pending"
    }
  }, [offer, bookingReference])

  const handleSimulatePayment = async () => {
    if (!bookingId) {
      toast({
        title: "Error",
        description: "Booking ID not found. Please try again.",
        variant: "destructive"
      })
      return
    }

    setIsProcessing(true)

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Update booking payment status to 'paid'
      updateBooking(bookingId, { 
        payment_status: 'paid',
        status: 'confirmed',
        confirmed_at: new Date().toISOString()
      })

      toast({
        title: "Payment Successful!",
        description: "Your booking has been confirmed. The merchant will be notified.",
      })

      // Close modal after successful payment
      setTimeout(() => {
        onOpenChange(false)
      }, 500)

    } catch (error) {
      console.error('Payment error:', error)
      toast({
        title: "Payment Failed",
        description: "An error occurred while processing payment. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (!offer) return null

  const formattedAmount = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2
  }).format(qrData.amount)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[95vw] sm:max-w-md rounded-3xl shadow-2xl border-0 bg-white p-6 sm:p-8 z-[10000] fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
        aria-label="GCash payment QR code modal"
      >
        {/* Hidden title for accessibility */}
        <DialogTitle className="sr-only">GCash Payment QR Code</DialogTitle>

        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#135bec]/10 via-transparent to-[#10B981]/8 rounded-3xl pointer-events-none -z-10" />

        <div className="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Smartphone className="w-6 h-6 text-[#007DFE]" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
                Scan to Pay with GCash
              </h2>
            </div>
            <p className="text-sm text-gray-500">
              Present this QR code as proof of booking
            </p>
          </div>

          {/* QR Code Container */}
          <div
            className="bg-white rounded-3xl shadow-premium p-6 border border-gray-100"
            aria-label="GCash payment QR code"
          >
            <QRCodeSVG
              value={JSON.stringify(qrData)}
              size={200}
              level="H"
              className="w-48 h-48 sm:w-56 sm:h-56"
              includeMargin={true}
            />
          </div>

          {/* Payment Details Card */}
          <div className="w-full bg-gray-50/50 rounded-2xl p-4 border border-gray-100 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Merchant</span>
              <span className="text-sm font-semibold text-gray-900">
                {offer.partnerName || "Subic.Life Partner"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Amount</span>
              <span className="text-lg font-bold text-[#135bec]">
                {formattedAmount}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Reference</span>
              <span className="text-sm font-mono text-gray-700">
                {bookingReference}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Status</span>
              <span className="text-sm font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                Pending
              </span>
            </div>
          </div>

          {/* Instructions */}
          <div className="w-full bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
              How to Pay
            </p>
            <ol className="space-y-2">
              {[
                "Open your GCash app",
                "Scan this QR code",
                "Confirm payment details",
                "Complete transaction"
              ].map((step, index) => (
                <li key={index} className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#007DFE]/10 text-[#007DFE] text-xs font-bold">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Action Button */}
          <Button
            onClick={handleSimulatePayment}
            disabled={isProcessing}
            className="w-full rounded-full bg-[#10B981] text-white px-8 h-12 font-semibold hover:bg-[#059669] shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:scale-100"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Simulate Payment Success
              </>
            )}
          </Button>

          {/* Note */}
          <p className="text-xs text-gray-400 text-center">
            This QR is proof of your booking intent. Payment will be collected after merchant confirms.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
