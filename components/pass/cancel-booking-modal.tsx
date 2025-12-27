"use client"

import { useState } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, Info } from "lucide-react"

interface CancelBookingModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string, note: string) => void
  bookingId: string
}

const cancellationReasons = [
  "Change of plans",
  "Found a better option",
  "Health or personal reasons",
  "Travel restrictions",
  "Weather conditions",
  "Incorrect booking details",
  "Other"
]

export function CancelBookingModal({ isOpen, onClose, onConfirm, bookingId }: CancelBookingModalProps) {
  const [reason, setReason] = useState("")
  const [note, setNote] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    if (!reason) return
    setIsLoading(true)
    await onConfirm(reason, note)
    setIsLoading(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[400px] p-6 rounded-3xl shadow-2xl border-0 animate-in fade-in slide-in-from-bottom-4 duration-500 relative overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 via-transparent to-orange-50/30 pointer-events-none rounded-3xl" />
        <DialogHeader className="relative z-10">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center mb-4 shadow-lg shadow-red-100/50 mx-auto">
            <AlertTriangle className="h-7 w-7 text-red-600" />
          </div>
          <DialogTitle className="text-xl font-bold text-slate-900 text-center">Cancel Booking?</DialogTitle>
          <DialogDescription className="text-slate-500 text-sm pt-2 text-center">
            Are you sure you want to cancel this booking? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="relative z-10 space-y-5 py-4">
          <div className="p-4 bg-white/60 backdrop-blur-md border border-blue-100 rounded-2xl flex items-start gap-3 border-l-4 border-l-blue-500">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[10px] font-bold text-blue-700 uppercase tracking-[0.2em] mb-1">Cancellation Policy</p>
              <p className="text-xs text-blue-800 leading-relaxed">
                Free cancellation is available until 24 hours before the scheduled time. Points will be refunded within 3-5 business days.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Reason for Cancellation</label>
            <Select onValueChange={setReason} value={reason}>
              <SelectTrigger className="h-12 rounded-2xl border-slate-200 focus:ring-2 focus:ring-[#135bec]/30 focus:border-[#135bec]">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                {cancellationReasons.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Additional Notes (Optional)</label>
            <Textarea
              placeholder="Tell us more about why you're cancelling..."
              className="min-h-[100px] rounded-2xl border-slate-200 resize-none focus-visible:ring-2 focus-visible:ring-[#135bec]/30 focus-visible:border-[#135bec]"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="relative z-10 flex flex-col sm:flex-row gap-3 mt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 h-12 rounded-full text-slate-600 font-bold border-2 border-slate-200 hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all duration-300"
            disabled={isLoading}
          >
            Go Back
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1 h-12 rounded-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold shadow-lg shadow-red-200/50 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
            disabled={!reason || isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Cancelling...
              </span>
            ) : "Confirm Cancellation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
