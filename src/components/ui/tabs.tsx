import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex-1 h-full rounded-md flex items-center justify-center gap-2",
      "text-sm font-medium",
      "text-dashboard-text-secondary/70 dark:text-dashboard-text-secondary/70",
      "hover:text-dashboard-text-secondary dark:hover:text-dashboard-text-secondary",
      "data-[state=active]:text-dashboard-text dark:data-[state=active]:text-dashboard-text",
      "data-[state=active]:bg-dashboard-card dark:data-[state=active]:bg-dashboard-card",
      "data-[state=active]:shadow-none",
      "transition-colors duration-200",
      "focus-visible:ring-0 focus-visible:ring-offset-0",
      "focus:ring-0 focus:ring-offset-0",
      "ring-0 ring-offset-0",
      "border-0 outline-none",
      "data-[state=active]:ring-0",
      "data-[state=active]:ring-offset-0",
      "data-[state=active]:border-0",
      "data-[state=active]:outline-none"
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
