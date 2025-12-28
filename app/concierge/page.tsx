"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useUser } from "@/lib/user-context"
import { ConciergeChat } from "@/components/concierge/concierge-chat"

export default function ConciergePage() {
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  }, [user, router])

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#B8E6E1] via-[#135bec]/10 to-[#E8F4F8] relative overflow-hidden">
      {/* Decorative Blur Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[40%] bg-[#135bec]/10 blur-[100px] rounded-full" />
      <div className="absolute bottom-[10%] left-[-10%] w-[50%] h-[40%] bg-[#D97706]/5 blur-[100px] rounded-full" />
      
      <div className="relative z-10 min-h-screen pb-20">
        <Link 
          href="/home" 
          className="fixed top-6 left-6 z-50 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md border border-white/50 shadow-premium flex items-center justify-center hover:bg-white hover:shadow-xl transition-all duration-300 group"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-subic-blue transition-colors" />
        </Link>
        <ConciergeChat />
      </div>
    </div>
  )
}
