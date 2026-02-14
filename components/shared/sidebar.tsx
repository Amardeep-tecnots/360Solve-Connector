"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Store,
  GitBranch,
  Activity,
  Server,
  Settings,
  Zap,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { useAppDispatch } from "@/lib/store/hooks"
import { signOut } from "@/lib/store/slices/auth-slice"
import { toast } from "sonner"

const navGroups = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard },
    ],
  },
  {
    label: "Integration",
    items: [
      { label: "Marketplace", href: "/marketplace", icon: Store },
      { label: "Workflows", href: "/workflows/list", icon: GitBranch },
      { label: "Executions", href: "/executions", icon: Activity },
    ],
  },
  {
    label: "Infrastructure",
    items: [
      { label: "Connectors", href: "/connectors", icon: Server },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await dispatch(signOut()).unwrap()
      toast.success("Signed out successfully")
      router.push("/sign-in")
    } catch (error: any) {
      toast.error(error?.message || "Sign out failed")
    } finally {
      setShowDialog(false)
    }
  }

  // Auto-collapse sidebar on detailed pages
  useEffect(() => {
    if (pathname.includes('/marketplace/installed/')) {
      setCollapsed(true)
    }
  }, [pathname])

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-border bg-card transition-all duration-200",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b border-border px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
          <Zap className="h-4 w-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground leading-tight">
              360Solve
            </span>
            <span className="text-[11px] text-muted-foreground leading-tight">
              Connector
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Main navigation">
        <div className="flex flex-col gap-6">
          {navGroups.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.label}
                </p>
              )}
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0",
                          isActive
                            ? "text-sidebar-accent-foreground"
                            : "text-muted-foreground group-hover:text-foreground"
                        )}
                      />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Footer actions */}
      <div className="border-t border-border p-3 flex flex-col gap-2">
        <button
          onClick={() => setShowDialog(true)}
          className={cn(
            "flex w-full items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
            collapsed ? "justify-center" : "justify-start"
          )}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Sign out</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

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
    </aside>
  )
}
