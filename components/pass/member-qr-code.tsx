"use client"

import { useState, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"
import { X, RefreshCw, Shield, Clock } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { User, Booking } from "@/lib/types"
import { cn } from "@/lib/utils"
import { BFFButton } from "./bff-button"

interface MemberQRCodeProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
  booking?: Booking | null
}

const tierStyles = {
  starter: {
    gradient: "from-slate-800 to-slate-950",
    accent: "text-blue-400",
    badge: "bg-blue-500/20 text-blue-400 border-blue-500/30"
  },
  basic: {
    gradient: "from-green-900 to-green-950",
    accent: "text-green-400",
    badge: "bg-green-500/20 text-green-400 border-green-500/30"
  },
  premium: {
    gradient: "from-orange-900 to-orange-950",
    accent: "text-orange-400",
    badge: "bg-orange-500/20 text-orange-400 border-orange-500/30"
  },
  elite: {
    gradient: "from-amber-900 via-black to-amber-950",
    accent: "text-amber-400",
    badge: "bg-amber-500/20 text-amber-400 border-amber-500/30"
  }
}

export function MemberQRCode({ isOpen, onClose, user, booking }: MemberQRCodeProps) {
  const [qrValue, setQrValue] = useState("")
  const [validity, setValidity] = useState(30)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const tier = user?.tier || "starter"
  const style = tierStyles[tier as keyof typeof tierStyles] || tierStyles.starter

  useEffect(() => {
    if (!isOpen || !user) return

    const generateQR = () => {
      setIsRefreshing(true)
      const timestamp = Date.now()
      // Format: SL:member_id:timestamp[:booking_id]
      let code = `SL:${user.member_id || "DEMO"}:${timestamp}`
      if (booking) {
        code += `:${booking.id}`
      }
      setQrValue(code)
      setValidity(30)
      setTimeout(() => setIsRefreshing(false), 200)
    }

    generateQR()

    const interval = setInterval(() => {
      setValidity((prev) => {
        if (prev <= 1) {
          generateQR()
          return 30
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isOpen, user?.member_id, booking?.id])

  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-none rounded-3xl">
        <div className={cn(
          "relative min-h-[600px] bg-gradient-to-b",
          style.gradient
        )}>
          {/* Background Effects */}
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
          {tier === 'elite' && (
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/20 blur-[80px] rounded-full" />
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center px-8 py-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <img src="/icon.svg" alt="Logo" className="w-6 h-6 brightness-0 invert" />
                <span className="text-white font-bold tracking-tight">Subic.Life</span>
              </div>
              <Badge className={cn("text-[10px] tracking-[0.2em] border", style.badge)}>
                {tier.toUpperCase()} MEMBER
              </Badge>
            </div>

            {/* Member Info */}
            <h2 className="text-2xl font-bold text-white mb-1 text-center">
              {user.name || "Guest"}
            </h2>
            <p className="text-sm font-mono text-white/60 tracking-[0.15em] mb-6">
              {user.member_id || "SL-2025-DEMO-0000"}
            </p>

            {/* QR Code Container */}
            <div className="relative">
              <div className={cn(
                "p-1 rounded-3xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md border border-white/10 shadow-2xl transition-transform duration-200",
                isRefreshing && "scale-95"
              )}>
                <div className="bg-white p-5 rounded-2xl">
                  <QRCodeSVG
                    value={qrValue}
                    size={220}
                    level="H"
                    includeMargin={false}
                  />
                </div>
              </div>

              {/* Scanner Animation removed */}
            </div>

            {/* Validity Timer */}
            <div className="w-full max-w-[240px] mt-6 flex flex-col gap-2">
              <div className="flex items-center justify-between text-[10px] text-white/50 font-bold tracking-widest uppercase">
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span>Security Code</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{validity}s</span>
                </div>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(255,255,255,0.5)]",
                    validity <= 5 ? "bg-red-400" : validity <= 10 ? "bg-yellow-400" : "bg-white/80"
                  )}
                  style={{ width: `${(validity / 30) * 100}%` }}
                />
              </div>
            </div>

            {/* Booking Reference (if applicable) */}
            {booking && (
              <div className="mt-6 w-full max-w-[240px] bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                <p className="text-[10px] text-white/50 uppercase tracking-wider font-bold mb-1">
                  Booking Reference
                </p>
                <p className="text-sm font-mono text-white">
                  {booking.id.slice(0, 12).toUpperCase()}
                </p>
                <p className="text-xs text-white/60 mt-1">
                  {booking.partner?.name || "Partner Venue"}
                </p>
              </div>
            )}

            {/* Instructions */}
            <div className="mt-8 text-center">
              <p className="text-sm text-white/70 font-medium">
                Show this QR code to the merchant
              </p>
              <p className="text-xs text-white/40 mt-1">
                Code refreshes every 30 seconds for security
              </p>
            </div>

            {/* Manual Refresh Button */}
            <BFFButton
              decorativeText="QR"
              onClick={() => {
                setIsRefreshing(true)
                const timestamp = Date.now()
                let code = `SL:${user.member_id || "DEMO"}:${timestamp}`
                if (booking) code += `:${booking.id}`
                setQrValue(code)
                setValidity(30)
                setTimeout(() => setIsRefreshing(false), 200)
              }}
              className="mt-4 px-6 py-3 text-xs font-medium"
            >
              <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
              Refresh Code
            </BFFButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
