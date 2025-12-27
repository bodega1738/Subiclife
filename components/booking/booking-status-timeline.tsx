"use client"

import { Booking } from "@/lib/types"
import {
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  MapPin,
  CreditCard,
  Send
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

interface BookingStatusTimelineProps {
  booking: Booking
  className?: string
}

interface TimelineStep {
  id: string
  label: string
  description: string
  icon: typeof Clock
  status: 'completed' | 'current' | 'upcoming' | 'failed'
  timestamp?: string
}

export function BookingStatusTimeline({ booking, className }: BookingStatusTimelineProps) {
  const getTimelineSteps = (): TimelineStep[] => {
    const steps: TimelineStep[] = []
    const now = new Date()

    // Step 1: Request Submitted (always completed)
    steps.push({
      id: 'submitted',
      label: 'Request Submitted',
      description: formatDistanceToNow(new Date(booking.created_at), { addSuffix: true }),
      icon: Send,
      status: 'completed',
      timestamp: booking.created_at
    })

    // Determine current state
    if (booking.status === 'pending') {
      steps.push({
        id: 'pending',
        label: 'Awaiting Response',
        description: 'Partner is reviewing your request',
        icon: Clock,
        status: 'current'
      })
      steps.push({
        id: 'confirmed',
        label: 'Confirmed',
        description: 'Awaiting confirmation',
        icon: CheckCircle,
        status: 'upcoming'
      })
      steps.push({
        id: 'checkin',
        label: 'Check-in',
        description: 'Show QR at venue',
        icon: MapPin,
        status: 'upcoming'
      })
    } else if (booking.status === 'counter_offer_sent') {
      steps.push({
        id: 'counter_offer',
        label: 'Counter-Offer Received',
        description: 'Review and respond to the offer',
        icon: RefreshCw,
        status: 'current'
      })
      steps.push({
        id: 'confirmed',
        label: 'Confirmed',
        description: 'Awaiting your decision',
        icon: CheckCircle,
        status: 'upcoming'
      })
      steps.push({
        id: 'checkin',
        label: 'Check-in',
        description: 'Show QR at venue',
        icon: MapPin,
        status: 'upcoming'
      })
    } else if (booking.status === 'confirmed') {
      steps.push({
        id: 'confirmed',
        label: 'Booking Confirmed',
        description: booking.confirmed_at
          ? formatDistanceToNow(new Date(booking.confirmed_at), { addSuffix: true })
          : 'Your booking is confirmed',
        icon: CheckCircle,
        status: 'completed',
        timestamp: booking.confirmed_at
      })

      // Payment status
      if (booking.payment_status === 'pending') {
        steps.push({
          id: 'payment',
          label: 'Payment Pending',
          description: 'Pay now or at venue',
          icon: CreditCard,
          status: 'current'
        })
      } else if (booking.payment_status === 'paid') {
        steps.push({
          id: 'payment',
          label: 'Payment Complete',
          description: 'Payment received',
          icon: CreditCard,
          status: 'completed'
        })
      }

      steps.push({
        id: 'checkin',
        label: 'Ready for Check-in',
        description: 'Show QR at venue',
        icon: MapPin,
        status: booking.payment_status === 'paid' ? 'current' : 'upcoming'
      })
    } else if (booking.status === 'completed') {
      steps.push({
        id: 'confirmed',
        label: 'Booking Confirmed',
        description: 'Confirmed by partner',
        icon: CheckCircle,
        status: 'completed',
        timestamp: booking.confirmed_at
      })
      steps.push({
        id: 'payment',
        label: 'Payment Complete',
        description: 'Payment processed',
        icon: CreditCard,
        status: 'completed'
      })
      steps.push({
        id: 'checkin',
        label: 'Checked In',
        description: 'Service completed - You earned 100 points!',
        icon: MapPin,
        status: 'completed'
      })
    } else if (booking.status === 'declined') {
      steps.push({
        id: 'declined',
        label: 'Request Declined',
        description: 'Partner was unable to accommodate',
        icon: XCircle,
        status: 'failed'
      })
    } else if (booking.status === 'cancelled') {
      steps.push({
        id: 'cancelled',
        label: 'Booking Cancelled',
        description: 'This booking was cancelled',
        icon: XCircle,
        status: 'failed'
      })
    }

    return steps
  }

  const steps = getTimelineSteps()

  const getStatusStyles = (status: TimelineStep['status']) => {
    switch (status) {
      case 'completed':
        return {
          dot: 'bg-gradient-to-br from-green-500 to-green-600 shadow-lg border-4 border-white',
          line: 'bg-green-500',
          icon: 'text-white',
          label: 'text-slate-900 font-bold',
          description: 'text-green-600'
        }
      case 'current':
        return {
          dot: 'bg-gradient-to-br from-blue-500 to-blue-600 ring-4 ring-blue-100 shadow-xl animate-pulse',
          line: 'bg-slate-200',
          icon: 'text-white',
          label: 'text-[#135bec] font-bold',
          description: 'text-blue-600'
        }
      case 'upcoming':
        return {
          dot: 'bg-slate-200 border-4 border-white shadow-sm',
          line: 'bg-slate-200',
          icon: 'text-slate-400',
          label: 'text-slate-400',
          description: 'text-slate-400'
        }
      case 'failed':
        return {
          dot: 'bg-gradient-to-br from-red-500 to-red-600 shadow-lg border-4 border-white',
          line: 'bg-red-200',
          icon: 'text-white',
          label: 'text-red-700 font-bold',
          description: 'text-red-600'
        }
    }
  }

  return (
    <div className={cn("relative", className)}>
      <div className="space-y-0">
        {steps.map((step, index) => {
          const styles = getStatusStyles(step.status)
          const isLast = index === steps.length - 1

          return (
            <div key={step.id} className="relative flex gap-4">
              {/* Vertical Line */}
              {!isLast && (
                <div
                  className={cn(
                    "absolute left-[19px] top-[40px] w-0.5 h-[calc(100%-16px)]",
                    styles.line
                  )}
                />
              )}

              {/* Icon Circle */}
              <div
                className={cn(
                  "relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                  styles.dot
                )}
              >
                <step.icon className={cn("w-5 h-5", styles.icon)} />
              </div>

              {/* Content */}
              <div className="flex-1 pb-8">
                <p className={cn("text-sm leading-tight", styles.label)}>
                  {step.label}
                </p>
                <p className={cn("text-xs mt-1 leading-relaxed", styles.description)}>
                  {step.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
