import React from "react"
import { cn } from "@/lib/utils"
import { MembershipTier } from "@/lib/types"

interface TierBadgeProps {
  tier: MembershipTier | undefined
  className?: string
}

export function TierBadge({ tier, className }: TierBadgeProps) {
  // Handle null/undefined tier by defaulting to starter
  const tierValue = tier || "starter"
  
  // Define tier-specific styles
  const tierStyles = {
    elite: {
      bg: "bg-black",
      text: "text-[#D97706]"
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

  const style = tierStyles[tierValue]
  const tierLabel = tierValue.charAt(0).toUpperCase() + tierValue.slice(1)

  return (
    <div className={cn(
      "inline-flex items-center px-3 py-1 rounded-full",
      style.bg,
      className
    )}>
      <span className={`text-xs font-semibold ${style.text}`}>
        {tierLabel}
      </span>
    </div>
  )
}
