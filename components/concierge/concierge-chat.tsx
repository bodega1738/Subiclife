"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { MoreVertical, Send, Bot, Check, Loader2, Search, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useUser, discountPercentages } from "@/lib/user-context"
import { useToast } from "@/hooks/use-toast"
import { mockSupabase } from "@/lib/mock-db"
import type { ChatMessage } from "@/lib/types"
import { TierBadge } from "@/components/ui/tier-badge"
import { cn } from "@/lib/utils"
import Link from "next/link"

const suggestions = [
  "Find dinner spot", 
  "Book yacht", 
  "Plan day trip", 
  "Best diving", 
  "Hotel deals",
  "Private Chef"
]

export function ConciergeChat() {
  const { user, addPoints } = useUser()
  const { toast } = useToast()
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Welcome to Subic.Life, ${user?.name?.split(" ")[0] || "Guest"}! I'm your personal concierge. As a ${user?.tier || "starter"} member, you enjoy ${discountPercentages[user?.tier || "starter"]}% off at all partners. How can I help you explore Subic Bay today?`,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [confirmedBookings, setConfirmedBookings] = useState<Set<string>>(new Set())
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (message: string) => {
    if (!message.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: message,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      })

      const data = await response.json()

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.content,
        timestamp: new Date(),
        bookingCard: data.bookingCard,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmBooking = async (messageId: string, bookingCard: any) => {
    const bookingRef = `SL-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    
    const newBooking = {
      id: crypto.randomUUID(),
      user_id: user?.id,
      partner_id: bookingCard.partnerId,
      booking_type: 'restaurant',
      booking_details: {
        date: new Date().toISOString().split('T')[0],
        time: bookingCard.time || '7:00 PM',
        party_size: bookingCard.guests || 2,
        special_requests: 'Booked via Concierge'
      },
      status: 'pending',
      payment_status: 'pending',
      total_amount: bookingCard.price,
      discount_amount: Math.round(bookingCard.price * (bookingCard.discount / 100)),
      final_amount: Math.round(bookingCard.price * (1 - bookingCard.discount / 100)),
      created_at: new Date().toISOString()
    }
    
    await mockSupabase.from('bookings').insert(newBooking)
    
    await mockSupabase.from('notifications').insert({
      partner_id: bookingCard.partnerId,
      type: 'new_booking',
      title: 'New Booking Request',
      message: `${user?.name} (${user?.tier}) - Concierge booking`,
      read: false
    })
    
    addPoints(500)
    setConfirmedBookings(prev => new Set(prev).add(messageId))
    
    toast({
      title: "✅ Booking Request Sent!",
      description: `Reference: ${bookingRef} • +500 Points Earned`
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSend(input)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] pt-12">
      {/* Suggestions Rail */}
      <div className="px-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-3 h-3 text-[#D97706]" />
          <p className="text-[10px] font-bold text-[#1F2937]/50 uppercase tracking-wider">Recommendations</p>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6">
          {suggestions.map((suggestion, i) => (
            <button
              key={suggestion}
              onClick={() => handleSend(suggestion)}
              style={{ animationDelay: `${i * 100}ms` }}
              className="flex-shrink-0 px-6 py-3 bg-white/70 backdrop-blur-md border border-white/50 shadow-premium rounded-full text-sm text-[#111318] font-semibold hover:shadow-[0_8px_25px_-5px_rgba(19,91,236,0.2)] hover:scale-105 active:scale-95 transition-all duration-300 animate-in fade-in slide-in-from-right-4"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-6 pb-32">
        <div className="max-w-2xl mx-auto space-y-8">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={cn(
                "flex flex-col group animate-in fade-in slide-in-from-bottom-4 duration-500",
                message.role === "user" ? "items-end" : "items-start"
              )}
            >
              <div className={cn(
                "flex items-end gap-2 max-w-[85%]",
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              )}>
                {/* Avatar for Assistant */}
                {message.role === "assistant" && (
                  <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gradient-to-br from-[#111318] to-[#1F2937] flex items-center justify-center shadow-premium mb-1">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <div className={cn(
                    "relative px-5 py-4 shadow-premium transition-all duration-300",
                    message.role === "assistant" 
                      ? "bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl rounded-bl-none text-[#111318]" 
                      : "bg-[#135bec] rounded-2xl rounded-br-none text-white shadow-[0_8px_20px_-4px_rgba(19,91,236,0.3)]"
                  )}>
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <span className={cn(
                    "text-[10px] font-medium px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                    message.role === "user" ? "text-right" : "text-left",
                    "text-[#1F2937]/40"
                  )}>
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>

              {/* Booking Card */}
              {message.bookingCard && (
                <div className="mt-4 w-full max-w-sm animate-in zoom-in-95 duration-500">
                  <div className="bg-white rounded-[32px] overflow-hidden shadow-premium border border-gray-100 group/card hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)] transition-all duration-500">
                    <div className="aspect-[4/3] w-full relative overflow-hidden">
                      <img
                        src={message.bookingCard.image || "/placeholder.svg"}
                        alt={message.bookingCard.venue}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full">
                            {message.bookingCard.category}
                          </span>
                          <span className="text-[10px] font-bold bg-[#D97706] px-2 py-0.5 rounded-full">
                            ★ {message.bookingCard.rating}
                          </span>
                        </div>
                        <h4 className="text-xl font-bold tracking-tight">{message.bookingCard.venue}</h4>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-end justify-between mb-6">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Exclusive Rate</p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-[#111318]">₱{message.bookingCard.price?.toLocaleString()}</span>
                            <span className="text-xs text-gray-400 line-through">₱{(message.bookingCard.price * 1.2).toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="inline-block bg-[#10B981]/10 text-[#10B981] px-3 py-1 rounded-full text-[11px] font-bold border border-[#10B981]/20">
                            SAVE {message.bookingCard.discount}%
                          </span>
                        </div>
                      </div>

                      {confirmedBookings.has(message.id) ? (
                        <div className="flex items-center justify-center gap-2 py-4 bg-[#10B981]/10 border border-[#10B981]/20 rounded-2xl">
                          <Check className="w-5 h-5 text-[#10B981]" />
                          <span className="text-sm font-bold text-[#10B981]">REQUEST SECURED</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleConfirmBooking(message.id, message.bookingCard)}
                          className="w-full bg-[#111318] hover:bg-[#135bec] text-white rounded-full py-4 font-bold text-sm shadow-premium transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                        >
                          Confirm VIP Booking
                          <Sparkles className="w-4 h-4 transition-transform group-hover/btn:rotate-12" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start animate-pulse">
              <div className="w-8 h-8 rounded-full bg-gray-200" />
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/50">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-[#135bec] rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-[#135bec] rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-[#135bec] rounded-full animate-bounce" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Floating Input Bar */}
      <div className="fixed bottom-6 left-0 right-0 z-50">
        <form 
          onSubmit={handleSubmit} 
          className="max-w-md mx-auto px-6"
        >
          <div className="bg-white/80 backdrop-blur-2xl rounded-[32px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-white/50 p-2 flex items-center gap-2">
            <div className="flex-1 px-4">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your concierge..."
                className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium text-[#111318] placeholder:text-[#1F2937]/30 py-3"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-premium",
                input.trim() 
                  ? "bg-[#135bec] text-white scale-100" 
                  : "bg-gray-100 text-gray-400 scale-90"
              )}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5 ml-0.5" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
