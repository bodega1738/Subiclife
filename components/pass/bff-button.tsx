import * as React from "react"
import { cn } from "@/lib/utils"

interface BFFButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  decorativeText: string
}

const BFFButton = React.forwardRef<HTMLButtonElement, BFFButtonProps>(
  ({ className, decorativeText, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative overflow-hidden bg-[#202020] rounded-[20px]",
          "transition-all duration-150",
          "hover:bg-[#2a2a2a] active:scale-95",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#202020]",
          className
        )}
        disabled={disabled}
        {...props}
      >
        {/* Layer 2: Decorative Text */}
        <span
          className="absolute -bottom-4 -right-4 text-[120px] font-bold leading-none text-white/10 pointer-events-none select-none z-0"
          aria-hidden="true"
        >
          {decorativeText}
        </span>

        {/* Layer 3: Foreground Content */}
        <div className="relative z-10 flex items-center justify-center gap-2 text-white font-semibold">
          {children}
        </div>
      </button>
    )
  }
)
BFFButton.displayName = "BFFButton"

export { BFFButton }
