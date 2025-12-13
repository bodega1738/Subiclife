"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/user-context"
import { HomeDashboard } from "@/components/home/home-dashboard"
import { BottomNav } from "@/components/layout/bottom-nav"

export default function HomePage() {
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
      <HomeDashboard />
      <BottomNav />
    </div>
  )
}
