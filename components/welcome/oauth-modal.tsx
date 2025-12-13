"use client"

import type React from "react"
import { useState } from "react"
import { X, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface OAuthModalProps {
  provider: "google" | "facebook" | "instagram" | null
  onClose: () => void
  onSuccess: (name: string, email: string) => void
}

export function OAuthModal({ provider, onClose, onSuccess }: OAuthModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState<"email" | "password">("email")
  const [isLoading, setIsLoading] = useState(false)

  if (!provider) return null

  const handleGoogleNext = () => {
    if (email) {
      setStep("password")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    const name = email
      .split("@")[0]
      .replace(/[._]/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase())
    onSuccess(name, email)
    onClose()
  }

  if (provider === "google") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60" onClick={onClose} />
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-[400px] overflow-hidden">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 transition-colors z-10"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          <div className="p-8">
            {/* Google G Logo - using colored text as fallback */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-0.5 text-2xl font-medium">
                <span className="text-[#4285F4]">G</span>
                <span className="text-[#EA4335]">o</span>
                <span className="text-[#FBBC05]">o</span>
                <span className="text-[#4285F4]">g</span>
                <span className="text-[#34A853]">l</span>
                <span className="text-[#EA4335]">e</span>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-1">Sign in</h2>
            <p className="text-sm text-gray-600 text-center mb-6">to continue to Subic.Life</p>

            <form
              onSubmit={
                step === "email"
                  ? (e) => {
                      e.preventDefault()
                      handleGoogleNext()
                    }
                  : handleSubmit
              }
              className="space-y-4"
            >
              {step === "email" ? (
                <>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">Email or phone</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 text-base border-gray-300 rounded-lg focus:border-[#4285F4] focus:ring-[#4285F4]"
                      required
                    />
                  </div>
                  <p className="text-sm text-[#1a73e8] cursor-pointer hover:underline">Forgot email?</p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Not your computer? Use Guest mode to sign in privately.{" "}
                    <span className="text-[#1a73e8] cursor-pointer hover:underline">Learn more</span>
                  </p>
                  <div className="flex justify-between items-center pt-4">
                    <button
                      type="button"
                      className="text-sm font-medium text-[#1a73e8] hover:bg-blue-50 px-4 py-2 rounded-md transition-colors"
                    >
                      Create account
                    </button>
                    <Button
                      type="submit"
                      className="h-10 px-6 bg-[#1a73e8] hover:bg-[#1557b0] rounded-md text-white font-medium"
                    >
                      Next
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-2">
                    <div className="w-8 h-8 rounded-full bg-[#1a73e8] text-white flex items-center justify-center text-sm font-medium">
                      {email.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-700">{email}</span>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">Enter your password</label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 text-base border-gray-300 rounded-lg pr-10 focus:border-[#4285F4] focus:ring-[#4285F4]"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-[#1a73e8] cursor-pointer hover:underline">Forgot password?</p>
                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="h-10 px-6 bg-[#1a73e8] hover:bg-[#1557b0] rounded-md text-white font-medium"
                    >
                      {isLoading ? "Signing in..." : "Sign in"}
                    </Button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    )
  }

  if (provider === "facebook") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[380px] overflow-hidden">
          {/* Blue header bar */}
          <div className="bg-[#1877F2] h-[60px] flex items-center justify-center relative">
            <span className="text-white text-2xl font-bold tracking-tight">facebook</span>
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Log in to Facebook</h2>

            <div>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address or phone number"
                className="h-11 text-base border-gray-300 bg-gray-50 rounded-lg focus:border-[#1877F2] focus:ring-[#1877F2]"
                required
              />
            </div>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="h-11 text-base border-gray-300 bg-gray-50 rounded-lg pr-10 focus:border-[#1877F2] focus:ring-[#1877F2]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-lg font-bold bg-[#1877F2] hover:bg-[#166FE5] rounded-lg"
            >
              {isLoading ? "Logging in..." : "Log In"}
            </Button>

            <div className="text-center">
              <button type="button" className="text-sm text-[#1877F2] hover:underline">
                Forgotten password?
              </button>
            </div>

            <div className="flex items-center gap-4 py-2">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-sm text-gray-500">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="flex justify-center">
              <Button
                type="button"
                className="h-11 px-6 text-base font-semibold bg-[#42B72A] hover:bg-[#36a420] text-white rounded-lg"
              >
                Create new account
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  if (provider === "instagram") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60" onClick={onClose} />
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-[350px] overflow-hidden border border-gray-200">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-gray-100 transition-colors z-10"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          <div className="p-10 space-y-5">
            {/* Instagram text logo */}
            <div className="flex justify-center mb-4">
              <span
                className="text-4xl text-gray-900"
                style={{ fontFamily: "'Brush Script MT', 'Segoe Script', cursive" }}
              >
                Instagram
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Phone number, username, or email"
                className="h-9 text-sm border-gray-300 bg-gray-50 rounded focus:border-gray-400 focus:ring-0"
                required
              />

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="h-9 text-sm border-gray-300 bg-gray-50 rounded pr-10 focus:border-gray-400 focus:ring-0"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-800 hover:text-gray-600"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-8 text-sm font-semibold bg-[#0095F6] hover:bg-[#1877F2] rounded-lg mt-2"
              >
                {isLoading ? "Logging in..." : "Log in"}
              </Button>
            </form>

            <div className="flex items-center gap-4 py-1">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-xs font-semibold text-gray-500 uppercase">Or</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-[#385898] hover:text-[#1c3a6b]"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Log in with Facebook
            </button>

            <div className="text-center">
              <button type="button" className="text-xs text-[#00376b] hover:text-gray-900">
                Forgot password?
              </button>
            </div>
          </div>

          <div className="border-t border-gray-200 p-5 text-center bg-gray-50">
            <p className="text-sm text-gray-800">
              {"Don't have an account? "}
              <button type="button" className="font-semibold text-[#0095F6] hover:text-[#1877F2]">
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return null
}
