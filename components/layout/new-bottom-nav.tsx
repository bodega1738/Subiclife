"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, MessageCircle, Heart, Ticket, User } from "lucide-react"
import { useUser } from "@/lib/user-context"

const navItems = [
  { id: "home", Icon: Home, path: "/home" },
  { id: "concierge", Icon: MessageCircle, path: "/concierge" },
  { id: "wishlist", Icon: Heart, path: "/wishlist" },
  { id: "pass", Icon: Ticket, path: "/pass" },
  { id: "profile", Icon: User, path: "/profile" },
]

export function NewBottomNav() {
  const pathname = usePathname()
  const { user } = useUser()
  const wishlistCount = user?.wishlist?.length || 0

  if (pathname === '/concierge') return null

  return (
    <nav className="fixed bottom-6 left-6 right-6 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-[calc(100%-3rem)] md:max-w-md bg-[#111318]/90 dark:bg-card-dark text-white backdrop-blur-xl rounded-[2rem] shadow-premium border border-white/10 z-50 h-[72px] flex items-center justify-around px-2">
      {navItems.map((item) => {
        const isActive = pathname === item.path
        const isWishlist = item.id === "wishlist"

        return (
          <Link
            key={item.id}
            href={item.path}
            aria-label={
              isWishlist && wishlistCount > 0
                ? `Wishlist (${wishlistCount} item${wishlistCount !== 1 ? "s" : ""})`
                : undefined
            }
            className={`flex flex-col items-center justify-center rounded-full transition-all duration-300 ${
              isActive
                ? "w-12 h-12 text-white"
                : "w-12 h-12 text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <div className="relative">
              <item.Icon className="w-6 h-6 stroke-[1.5px]" />
              {isWishlist && wishlistCount > 0 && (
                <div
                  className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold shadow-premium border-2 border-[#111318] px-1 animate-in fade-in duration-200"
                >
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </div>
              )}
            </div>
          </Link>
        )
      })}
    </nav>
  )
}
