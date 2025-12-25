"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Compass, Ticket, User } from "lucide-react"

const navItems = [
  { id: "home", Icon: Home, path: "/home" },
  { id: "discover", Icon: Compass, path: "/partners" },
  { id: "pass", Icon: Ticket, path: "/pass" },
  { id: "profile", Icon: User, path: "/profile" },
]

export function NewBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-6 left-6 right-6 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-[calc(100%-3rem)] md:max-w-md bg-[#111318]/90 dark:bg-card-dark text-white backdrop-blur-xl rounded-[2rem] shadow-premium border border-white/10 z-50 h-[72px] flex items-center justify-around px-2">
      {navItems.map((item) => {
        const isActive = pathname === item.path
        return (
          <Link
            key={item.id}
            href={item.path}
            className={`flex flex-col items-center justify-center rounded-full transition-all duration-300 ${
              isActive 
                ? "w-12 h-12 bg-white text-black shadow-lg scale-110" 
                : "w-12 h-12 text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <item.Icon className={`w-6 h-6 ${isActive ? "stroke-[2.5px]" : "stroke-[1.5px]"}`} />
          </Link>
        )
      })}
    </nav>
  )
}
