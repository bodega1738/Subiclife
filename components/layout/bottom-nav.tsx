"use client"

import { usePathname, useRouter } from "next/navigation"
import { Home, MessageSquare, CreditCard, Users } from "lucide-react"

const navItems = [
  { id: "home", label: "Home", icon: Home, path: "/home" },
  { id: "concierge", label: "Concierge", icon: MessageSquare, path: "/concierge" },
  { id: "pass", label: "My Pass", icon: CreditCard, path: "/pass" },
  { id: "partners", label: "Partners", icon: Users, path: "/partners" },
]

export function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
      <div className="max-w-md mx-auto flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path
          return (
            <button
              key={item.id}
              onClick={() => router.push(item.path)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${
                isActive ? "text-[#0A74DA]" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "fill-current" : ""}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
      {/* Safe area padding for mobile */}
      <div className="h-safe-area-inset-bottom bg-white" />
    </nav>
  )
}
