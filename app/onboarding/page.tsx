"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/user-context"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Plane, 
  Compass, 
  Wallet, 
  ChevronRight, 
  ChevronLeft, 
  X,
  Hotel,
  Mountain,
  Utensils,
  Waves,
  Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"

type OnboardingData = {
  travelFrequency?: 'first-time' | 'occasional' | 'frequent' | 'local-resident'
  interests: string[]
  budgetRange?: 'budget' | 'moderate' | 'luxury' | 'ultra-luxury'
}

export default function OnboardingPage() {
  const router = useRouter()
  const { user, updatePreferences } = useUser()
  const [step, setStep] = useState(1)
  const [data, setData] = useState<OnboardingData>({
    interests: []
  })

  useEffect(() => {
    if (!user) {
      router.push("/")
      return
    }

    if (user.preferences && step === 1) {
      // If preferences already exist and we just landed, maybe they are retaking it
      // but for now let's just allow it or redirect if desired.
      // router.push("/home") 
    }
  }, [user, router])

  const totalSteps = 3
  const progress = (step / totalSteps) * 100

  const handleSkipAll = () => {
    router.push("/home")
  }

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      handleFinish()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleFinish = () => {
    updatePreferences(data)
    router.push("/onboarding/offer")
  }

  const toggleInterest = (interest: string) => {
    setData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const isNextDisabled = () => {
    if (step === 1 && !data.travelFrequency) return true
    if (step === 2 && data.interests.length === 0) return true
    if (step === 3 && !data.budgetRange) return true
    return false
  }

  if (!user) return null

  return (
    <div className="h-[100dvh] bg-gradient-to-b from-blue-100/60 via-white to-orange-100/60 flex flex-col relative overflow-hidden">
      {/* Background Glows - Perfectionist Northern Lights */}
      <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[60%] bg-[#135bec]/30 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />
      <div className="absolute top-[10%] right-[-15%] w-[70%] h-[50%] bg-teal-300/40 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[80%] h-[60%] bg-orange-300/40 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-[10%] left-[-20%] w-[60%] h-[40%] bg-rose-300/30 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />
      <div className="absolute inset-0 bg-white/0 pointer-events-none" />
      
      {/* Header */}
      <div className="px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex-1 max-w-[120px]">
          {/* Segmented Progress Bar */}
          <div className="flex gap-1.5 h-1">
            {[1, 2, 3].map((s) => (
              <div 
                key={s}
                className={cn(
                  "flex-1 rounded-full transition-all duration-700 ease-in-out",
                  s <= step ? "bg-[#135bec] shadow-[0_0_8px_rgba(19,91,236,0.3)]" : "bg-slate-200/60"
                )}
              />
            ))}
          </div>
          <p className="text-[8px] uppercase tracking-[0.25em] text-slate-400 mt-3 font-black">Step {step} of {totalSteps}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-6 justify-center relative z-10 -mt-8">
        <div className="w-full max-w-lg mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-1.5">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">How often do you <br/>visit Subic?</h1>
                <p className="text-slate-500 text-sm leading-relaxed">Tailoring your experience based on familiarity.</p>
              </div>
              <div className="grid gap-2.5">
                {[
                  { id: 'first-time', label: 'First-time visitor', icon: Plane },
                  { id: 'occasional', label: 'Occasional Explorer', icon: Compass },
                  { id: 'frequent', label: 'Frequent Guest', icon: Sparkles },
                  { id: 'local-resident', label: 'Local Resident', icon: Hotel }
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setData({ ...data, travelFrequency: option.id as any })}
                    className={cn(
                      "flex items-center gap-4 p-3.5 rounded-2xl border transition-all duration-300 text-left group",
                      data.travelFrequency === option.id
                        ? "border-[#135bec] bg-white shadow-md ring-2 ring-[#135bec]/5"
                        : "border-white bg-white/60 hover:border-slate-200 hover:bg-white/80 backdrop-blur-sm shadow-sm"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                      data.travelFrequency === option.id ? "bg-[#135bec] text-white" : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                    )}>
                      <option.icon className="w-5 h-5" />
                    </div>
                    <span className={cn(
                      "font-semibold text-base",
                      data.travelFrequency === option.id ? "text-slate-900" : "text-slate-600"
                    )}>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-1.5">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">What interests <br/>you most?</h1>
                <p className="text-slate-500 text-sm leading-relaxed">Curating deals based on your passions.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { id: 'hotels', label: 'Boutique Stays', icon: Hotel },
                  { id: 'activities', label: 'Adventure', icon: Mountain },
                  { id: 'dining', label: 'Gastronomy', icon: Utensils },
                  { id: 'water-sports', label: 'Ocean Life', icon: Waves },
                  { id: 'wellness', label: 'Rejuvenation', icon: Sparkles }
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => toggleInterest(option.id)}
                    className={cn(
                      "flex items-center gap-3.5 p-3.5 rounded-2xl border transition-all duration-300 text-left group",
                      data.interests.includes(option.id)
                        ? "border-[#135bec] bg-white shadow-md ring-2 ring-[#135bec]/5"
                        : "border-white bg-white/60 hover:border-slate-200 hover:bg-white/80 backdrop-blur-sm shadow-sm"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                      data.interests.includes(option.id) ? "bg-[#135bec] text-white" : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                    )}>
                      <option.icon className="w-5 h-5" />
                    </div>
                    <span className={cn(
                      "font-semibold text-sm",
                      data.interests.includes(option.id) ? "text-slate-900" : "text-slate-600"
                    )}>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-1.5">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Your typical <br/>travel style?</h1>
                <p className="text-slate-500 text-sm leading-relaxed">Defining your ideal Subic experience.</p>
              </div>
              <div className="grid gap-2.5">
                {[
                  { id: 'budget', label: 'Essential', sub: '₱2-5K / day', icon: Wallet },
                  { id: 'moderate', label: 'Balanced', sub: '₱5-10K / day', icon: Wallet },
                  { id: 'luxury', label: 'Premium', sub: '₱10-20K / day', icon: Sparkles },
                  { id: 'ultra-luxury', label: 'Elite', sub: '₱20K+ / day', icon: Sparkles }
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setData({ ...data, budgetRange: option.id as any })}
                    className={cn(
                      "flex items-center gap-4 p-3.5 rounded-2xl border transition-all duration-300 text-left group",
                      data.budgetRange === option.id
                        ? "border-[#135bec] bg-white shadow-md ring-2 ring-[#135bec]/5"
                        : "border-white bg-white/60 hover:border-slate-200 hover:bg-white/80 backdrop-blur-sm shadow-sm"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                      data.budgetRange === option.id ? "bg-[#135bec] text-white" : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                    )}>
                      <option.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className={cn(
                        "font-semibold text-base",
                        data.budgetRange === option.id ? "text-slate-900" : "text-slate-600"
                      )}>{option.label}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em] mt-0.5">{option.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Footer Navigation */}
      <div className="px-6 py-6 pb-10 bg-transparent relative z-10 flex items-center justify-between gap-4 max-w-lg mx-auto w-full">
        <Button
          variant="ghost"
          onClick={step === 1 ? handleSkipAll : handleBack}
          className="text-slate-400 hover:text-slate-600 rounded-full h-11 px-6 font-semibold text-sm transition-colors"
        >
          {step === 1 ? "Skip" : "Back"}
        </Button>
        <Button
          onClick={handleNext}
          disabled={isNextDisabled()}
          className="bg-slate-900 hover:bg-slate-800 text-white rounded-full h-11 px-8 font-semibold text-sm shadow-lg shadow-slate-200 transition-all active:scale-[0.98] disabled:opacity-30 disabled:grayscale"
        >
          <span>{step === totalSteps ? "Complete" : "Next"}</span>
          <ChevronRight className="w-4 h-4 ml-1.5" />
        </Button>
      </div>
    </div>
  )
}
