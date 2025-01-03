import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  spellCheck?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border-2 px-3 py-1 text-base shadow-sm transition-colors",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          // Base state - white background with primary border
          "bg-white text-black border-primary",
          // Valid state - green background and border
          "data-[state=valid]:bg-green-50 data-[state=valid]:border-green-500",
          // Invalid state - red background and border
          "data-[state=invalid]:bg-red-50 data-[state=invalid]:border-red-500",
          // Pending state - yellow background and border
          "data-[state=pending]:bg-yellow-50 data-[state=pending]:border-yellow-500 data-[state=pending]:cursor-wait",
          // Disabled state - muted colors
          "disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100 disabled:border-muted",
          // Hover state when not in a special state
          "hover:data-[state=idle]:border-accent",
          "md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
