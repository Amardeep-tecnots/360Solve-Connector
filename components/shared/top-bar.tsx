"use client"

import { Bell, Search, HelpCircle, LogOut, Settings } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAppDispatch } from "@/lib/store/hooks"
import { signOut } from "@/lib/store/slices/auth-slice"
import { toast } from "sonner"

export function TopBar() {
  const [searchFocused, setSearchFocused] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const router = useRouter()
  const dispatch = useAppDispatch()

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", onClickOutside)
    }
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [menuOpen])

  const handleSignOut = async () => {
    try {
      await dispatch(signOut()).unwrap()
      toast.success("Signed out successfully")
      router.push("/sign-in")
    } catch (error: any) {
      toast.error(error?.message || "Sign out failed")
    } finally {
      setMenuOpen(false)
      setShowDialog(false)
    }
  }

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
      <div className="relative flex items-center gap-1" ref={menuRef}>
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
          onClick={() => setMenuOpen((open) => !open)}
          className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground transition-colors hover:opacity-90"
          aria-label="User menu"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
        >
          SK
        </button>

        {menuOpen && (
          <div
            role="menu"
            className="absolute right-0 top-11 z-10 w-48 rounded-md border border-border bg-popover shadow-lg"
          >
            <button
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
              role="menuitem"
              onClick={() => {
                setMenuOpen(false)
                router.push("/settings")
              }}
            >
              <Settings className="h-4 w-4" />
              Account / Settings
            </button>
            <button
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
              role="menuitem"
              onClick={() => setShowDialog(true)}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        )}
        {showDialog && (
          <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-sm rounded-lg border border-border bg-card shadow-lg">
              <div className="px-4 py-3 border-b border-border">
                <h2 className="text-sm font-semibold text-foreground">Sign out</h2>
                <p className="mt-1 text-sm text-muted-foreground">Are you sure you want to sign out?</p>
              </div>
              <div className="flex justify-end gap-2 px-4 py-3">
                <button
                  className="rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                  onClick={() => setShowDialog(false)}
                >
                  Cancel
                </button>
                <button
                  className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
                  onClick={handleSignOut}
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
