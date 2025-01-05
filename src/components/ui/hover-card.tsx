import * as React from "react"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"

import { cn } from "@/lib/utils"

const HoverCard = HoverCardPrimitive.Root

const HoverCardTrigger = HoverCardPrimitive.Trigger

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Portal>
    <HoverCardPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-[100] rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
        // Base animations
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        // Desktop styles and animations
        "md:w-64 md:relative md:top-auto md:left-auto md:transform-none",
        "md:data-[side=bottom]:slide-in-from-top-2 md:data-[side=left]:slide-in-from-right-2 md:data-[side=right]:slide-in-from-left-2 md:data-[side=top]:slide-in-from-bottom-2",
        // Mobile specific styles
        "w-[calc(100vw-2rem)] max-w-[90vw] md:max-w-none",
        "fixed md:!absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:translate-x-0 md:translate-y-0",
        className
      )}
      {...props}
    />
  </HoverCardPrimitive.Portal>
))
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName

export { HoverCard, HoverCardTrigger, HoverCardContent }
