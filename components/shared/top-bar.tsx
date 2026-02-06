"use client"

import { Bell, Search, HelpCircle } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function TopBar() {
  const [searchFocused, setSearchFocused] = useState(false)

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-6">
      {/* Search */}
      <div className="flex flex-1 items-center">
        <div
          className={cn(
            "flex w-full max-w-sm items-center gap-2 rounded-md border bg-background px-3 py-2 transition-colors",
            searchFocused ? "border-primary ring-2 ring-primary/10" : "border-border"
          )}
        >
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search workflows, connectors..."
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            aria-label="Search"
          />
          <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-block">
            /
          </kbd>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Help"
        >
          <HelpCircle className="h-4 w-4" />
        </button>

        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
        </button>

        {/* User avatar */}
        <button
          className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
          aria-label="User menu"
        >
          SK
        </button>
      </div>
    </header>
  )
}
