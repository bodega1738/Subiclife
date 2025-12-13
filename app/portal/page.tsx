"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Waves } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

export default function PortalLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Demo login check
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (email === "lighthouse@subic.life" && password === "demo123") {
      router.push("/portal/dashboard")
    } else {
      setError("Invalid credentials. Try: lighthouse@subic.life / demo123")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardContent className="p-6">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 bg-[#0A74DA] rounded-lg flex items-center justify-center">
              <Waves className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">SUBIC.LIFE</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">Partner Login</h1>
          <p className="text-slate-500 text-center mb-6">Access your merchant dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="lighthouse@subic.life"
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="h-11"
                required
              />
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}

            <Button type="submit" disabled={isLoading} className="w-full h-11 bg-[#0A74DA] hover:bg-[#0960b5]">
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-xs text-slate-500 text-center mt-6">Demo: lighthouse@subic.life / demo123</p>
        </CardContent>
      </Card>
    </div>
  )
}
