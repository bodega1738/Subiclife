"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/user-context"
import { WishlistDashboard } from "@/components/wishlist/wishlist-dashboard"

export default function WishlistPage() {
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <WishlistDashboard />
    </main>
  )
}
