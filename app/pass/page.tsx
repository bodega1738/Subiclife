"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/user-context"
import { MembershipPass } from "@/components/pass/membership-pass"
import { BottomNav } from "@/components/layout/bottom-nav"

export default function PassPage() {
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  }, [user, router])

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <MembershipPass />
      <BottomNav />
    </div>
  )
}
