"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useUser } from "@/lib/user-context"
import { SignupModal } from "./signup-modal"
import { OAuthModal } from "./oauth-modal"

type OAuthProvider = "google" | "facebook" | "instagram" | null

export function HeroSection() {
  const [isSignupOpen, setIsSignupOpen] = useState(false)
  const [oauthProvider, setOauthProvider] = useState<OAuthProvider>(null)
  const { loginAsDemo } = useUser()
  const router = useRouter()

  const handleDemoLogin = () => {
    loginAsDemo()
    router.push("/home")
  }

  const handleOAuthSuccess = (name: string, email: string) => {
    setOauthProvider(null)
    setIsSignupOpen(true)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      <div
        className="absolute inset-x-0 top-0 h-1/2 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
        }}
      />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
        <div className="flex flex-col items-center text-center max-w-md w-full">
          {/* Logo - white logo needs dark backdrop which we have above */}
          <div className="mb-8">
            <img
              src="/images/screenshot-2025-12-14-021635-removebg-preview.png"
              alt="Subic.LIFE"
              className="h-24 w-auto"
            />
          </div>

          {/* Hero text - adjusted for white bg below gradient */}
          <h1 className="text-3xl font-bold text-slate-900 mb-3 text-balance">Your Gateway to Subic Bay</h1>
          <p className="text-lg text-slate-600 mb-12">Exclusive benefits. Sustainable travel.</p>

          <div className="flex flex-col gap-3 w-full mb-4">
            <Button
              onClick={() => setOauthProvider("google")}
              variant="outline"
              className="w-full h-12 text-base font-medium bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-sm"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <Button
              onClick={() => setOauthProvider("facebook")}
              className="w-full h-12 text-base font-medium bg-[#1877F2] hover:bg-[#166FE5] text-white border-0 shadow-sm"
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Continue with Facebook
            </Button>

            <Button
              onClick={() => setOauthProvider("instagram")}
              className="w-full h-12 text-base font-medium text-white border-0 shadow-sm"
              style={{
                background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
              }}
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              Continue with Instagram
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 w-full mb-4">
            <div className="flex-1 h-px bg-slate-300" />
            <span className="text-sm text-slate-500">or</span>
            <div className="flex-1 h-px bg-slate-300" />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 w-full">
            <Button
              onClick={() => setIsSignupOpen(true)}
              variant="outline"
              className="w-full h-12 text-base font-semibold bg-transparent hover:bg-slate-100 text-slate-700 border-slate-300"
            >
              Sign up with Email
            </Button>
            <Button
              onClick={handleDemoLogin}
              className="w-full h-12 text-base font-semibold bg-[#0A74DA] hover:bg-[#0960b5] text-white shadow-md"
            >
              Demo as Elite Member
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full bg-[#00B14F] py-3">
        <p className="text-center text-white text-sm font-semibold tracking-wide">SBMA GREEN DESTINATIONS 2025</p>
      </div>

      <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
      <OAuthModal provider={oauthProvider} onClose={() => setOauthProvider(null)} onSuccess={handleOAuthSuccess} />
    </div>
  )
}
