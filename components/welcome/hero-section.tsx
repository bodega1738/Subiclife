"use client"

import { useRouter } from "next/navigation"
import { useUser } from "@/lib/user-context"
import { Mail, Building2 } from "lucide-react"

export function HeroSection() {
  const { loginAsDemo } = useUser()
  const router = useRouter()

  const handleDemoLogin = () => {
    loginAsDemo()
    router.push("/home")
  }

  return (
    <div className="bg-white min-h-screen flex items-center justify-center font-sans overflow-hidden">
      <div className="w-full max-w-md mx-auto h-full min-h-screen relative overflow-hidden flex flex-col justify-end">
        {/* Northern Lights Ambient Gradient Background */}
        <div className="absolute inset-0 z-0 bg-[#F9FAFB] overflow-hidden">
          {/* Soft diffuse orbs as per inspiration.md */}
          <div className="absolute top-[-5%] left-[-10%] w-[400px] h-[400px] bg-[#135bec] opacity-[0.08] blur-[100px] rounded-full animate-pulse-slow"></div>
          <div className="absolute top-[15%] right-[-15%] w-[350px] h-[350px] bg-[#10B981] opacity-[0.07] blur-[80px] rounded-full"></div>
          <div className="absolute bottom-[20%] left-[-10%] w-[450px] h-[450px] bg-[#D97706] opacity-[0.06] blur-[120px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-white/80"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 pb-10 pt-24">
          
          <div className="text-center mb-6 animate-in slide-in-from-top-4 duration-700">
            <h2 className="text-xl font-bold text-gray-900/60 tracking-tight mb-4">
              Hello!
            </h2>
            <h1 className="flex flex-col items-center">
              <span className="text-[4.4rem] font-black text-gray-900 tracking-[-0.06em] leading-[0.8]">Welcome</span>
              <span className="text-[2rem] font-bold text-gray-900/80 tracking-tight mt-6">To</span>
            </h1>
          </div>

          {/* Logo Centerpiece */}
          <div className="relative mb-10 animate-in zoom-in-95 duration-700 delay-100 -ml-[30px]">
            <div className="absolute inset-0 bg-gray-900/5 blur-3xl rounded-full scale-150"></div>
            {/* Added brightness-0 to make the script logo black for premium contrast on light background */}
            <img src="/images/subic-life-script-logo.png" alt="Subic Life Logo" className="relative z-10 h-24 object-contain brightness-0" />
          </div>

          <p className="text-gray-500 text-[13px] text-center font-medium leading-relaxed max-w-[240px] animate-in fade-in duration-700 delay-200">
            You are now a step closer to enjoying VIP perks across Subic Bay.
          </p>
        </div>

        {/* Action Sheet - Premium Glassmorphism */}
        <div className="relative z-20 bg-white/70 backdrop-blur-2xl rounded-t-[3rem] border-t border-white shadow-premium px-8 pt-10 pb-12 flex flex-col animate-slide-up">
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8"></div>
          
          {/* Premium Social Login Buttons */}
          <div className="space-y-3 w-full max-w-sm mx-auto">
            <button
              onClick={() => router.push("/register?provider=google")}
              className="w-full relative flex items-center justify-center bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-900 font-semibold py-4 px-6 rounded-full transition-all duration-200 group cursor-pointer shadow-sm"
            >
              <svg className="w-5 h-5 absolute left-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.24.81-.6z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-sm">Continue with Google</span>
            </button>

            <button
              onClick={() => router.push("/register?provider=facebook")}
              className="w-full relative flex items-center justify-center bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-900 font-semibold py-4 px-6 rounded-full transition-all duration-200 group cursor-pointer shadow-sm"
            >
              <svg className="w-5 h-5 absolute left-6 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="text-sm">Continue with Facebook</span>
            </button>

            <button
              onClick={() => router.push("/register?provider=apple")}
              className="w-full relative flex items-center justify-center bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-900 font-semibold py-4 px-6 rounded-full transition-all duration-200 group cursor-pointer shadow-sm"
            >
              <svg className="w-5 h-5 absolute left-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.21-1.96 1.07-3.11-1.05.05-2.31.74-3.02 1.61-.69.85-1.24 2.07-1.09 3.2 1.18.09 2.39-.75 3.04-1.7z"/>
              </svg>
              <span className="text-sm">Continue with Apple</span>
            </button>

            <button
              onClick={() => router.push("/register?provider=instagram")}
              className="w-full relative flex items-center justify-center bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-900 font-semibold py-4 px-6 rounded-full transition-all duration-200 group cursor-pointer shadow-sm"
            >
               <svg className="w-5 h-5 absolute left-6" viewBox="0 0 24 24">
                <defs>
                  <linearGradient id="ig-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f09433" />
                    <stop offset="25%" stopColor="#e6683c" />
                    <stop offset="50%" stopColor="#dc2743" />
                    <stop offset="75%" stopColor="#cc2366" />
                    <stop offset="100%" stopColor="#bc1888" />
                  </linearGradient>
                </defs>
                <path fill="url(#ig-grad)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
              <span className="text-sm">Continue with Instagram</span>
            </button>
          </div>

          <div className="relative py-6 flex items-center px-4">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-[10px] text-gray-400 uppercase tracking-widest font-bold">or</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <div className="space-y-3 w-full max-w-sm mx-auto">
            <button
              onClick={() => router.push("/register")}
              className="w-full bg-black text-white font-bold text-sm py-4 px-6 rounded-full shadow-premium hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Sign up with Email
            </button>

            <button
              onClick={handleDemoLogin}
              className="w-full bg-subic-blue/10 text-subic-blue font-bold text-sm py-4 px-6 rounded-full transition-all duration-200 hover:bg-subic-blue/20"
            >
              Demo as Elite Member
            </button>
          </div>

          <div className="mt-8 text-center">
            <button 
              onClick={() => router.push("/portal/register")}
              className="text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-subic-blue transition-colors flex items-center justify-center gap-1 mx-auto"
            >
              <Building2 className="w-3 h-3" />
              Partner Login
            </button>
          </div>

          <p className="text-[10px] text-center text-gray-400 mt-6 px-4 leading-relaxed max-w-xs mx-auto">
            By continuing, you agree to Subic Life's <a className="underline decoration-1 underline-offset-2 text-gray-600 font-semibold" href="#">Terms</a> and <a className="underline decoration-1 underline-offset-2 text-gray-600 font-semibold" href="#">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
