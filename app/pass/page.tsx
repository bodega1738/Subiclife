"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/user-context"
import { MembershipPass } from "@/components/pass/membership-pass"

export default function PassPage() {
  const { user } = useUser()
  const router = useRouter()
  
  useEffect(() => {
    if (!user) {
      router.push("/")
      return
    }
  }, [user, router])

  if (!user) return null

  return (
    <div className="min-h-screen">
      <MembershipPass />
    </div>
  )
}
