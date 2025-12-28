import React from "react"
import { cn } from "@/lib/utils"
import { MembershipTier } from "@/lib/types"

interface TierBadgeProps {
  tier: MembershipTier | undefined
  className?: string
  size?: "sm" | "md" | "lg"
}

export function TierBadge({ tier, className, size = "md" }: TierBadgeProps) {
  // Handle null/undefined tier by defaulting to starter
  const tierValue = tier || "starter"
  
  // Define tier-specific styles
  const tierStyles = {
    elite: {
      bg: "bg-black",
      text: "text-[#D97706]"
    },
    prestige: {
      bg: "bg-gradient-to-r from-[#F59E0B] to-[#D97706]",
      text: "text-white"
    },
    premium: {
      bg: "bg-[#D97706]",
      text: "text-white"
    },
    basic: {
      bg: "bg-[#10B981]",
      text: "text-white"
    },
    starter: {
      bg: "bg-[#135bec]",
      text: "text-white"
    }
  }

  const sizes = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-3 py-1 text-xs",
    lg: "px-4 py-1.5 text-sm"
  }

  const style = tierStyles[tierValue]
  const tierLabel = tierValue.charAt(0).toUpperCase() + tierValue.slice(1)

  return (
    <div className={cn(
      "inline-flex items-center rounded-full font-semibold",
      style.bg,
      sizes[size],
      className
    )}>
      <span className={cn(style.text)}>
        {tierLabel}
      </span>
    </div>
  )
}
