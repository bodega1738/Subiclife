"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { User, MembershipTier } from "./types"

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  login: (name: string, email: string, phone?: string, birthday?: string, address?: string) => void
  loginAsDemo: () => void
  upgradeTier: (tier: MembershipTier) => void
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

function generateMemberId(tier: MembershipTier): string {
  const random = Math.floor(Math.random() * 9000) + 1000
  const tierCode = tier?.toUpperCase() || "STARTER"
  return `SL-2025-${tierCode}-${random}`
}

const insuranceAmounts: Record<string, number> = {
  starter: 25000,
  basic: 100000,
  premium: 500000,
  elite: 1000000,
}

export const discountPercentages: Record<string, number> = {
  starter: 5,
  basic: 10,
  premium: 20,
  elite: 25,
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = (name: string, email: string, phone?: string, birthday?: string, address?: string) => {
    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      phone,
      birthday,
      address,
      tier: null,
      insuranceAmount: 0,
      ecoContribution: 0,
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
    }
    setUser(newUser)
  }

  const loginAsDemo = () => {
    const demoUser: User = {
      id: crypto.randomUUID(),
      name: "Juan Dela Cruz",
      email: "juan@demo.subic.life",
      phone: "+63 917 123 4567",
      tier: "elite",
      memberId: generateMemberId("elite"),
      insuranceAmount: insuranceAmounts.elite,
      ecoContribution: 12450,
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
    }
    setUser(demoUser)
  }

  const upgradeTier = (tier: MembershipTier) => {
    if (user && tier) {
      setUser({
        ...user,
        tier,
        memberId: generateMemberId(tier),
        insuranceAmount: insuranceAmounts[tier],
        ecoContribution: tier === "elite" ? 12450 : tier === "premium" ? 5000 : tier === "basic" ? 2000 : 1000,
      })
    }
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <UserContext.Provider value={{ user, setUser, login, loginAsDemo, upgradeTier, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
