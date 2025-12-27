"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
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
        <ConciergeChat />
      </div>
    </div>
  )
}
