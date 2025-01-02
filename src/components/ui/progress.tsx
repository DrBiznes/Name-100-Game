import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => {
  // Calculate the color based on progress value
  const getProgressColor = (value: number = 0) => {
    // Transition from light pink to deep pink
    const hue = 330; // Pink hue
    const saturation = 100;
    const lightness = 90 - (value * 0.4); // Start lighter, get deeper
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`
  }

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-muted",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 transition-all duration-300"
        style={{ 
          transform: `translateX(-${100 - (value || 0)}%)`,
          backgroundColor: getProgressColor(value ?? 0),
        }}
      />
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
