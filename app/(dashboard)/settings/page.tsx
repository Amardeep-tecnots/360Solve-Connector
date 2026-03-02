"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  User,
  Building2,
  CreditCard,
  Users,
  KeyRound,
  Shield,
  Eye,
  EyeOff,
  Copy,
  Plus,
  Trash2,
  AlertTriangle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { useEffect } from "react"
import { fetchUsers } from "@/lib/store/slices/users-slice"
import { fetchCurrentTenant } from "@/lib/store/slices/tenant-slice"

const sections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "account", label: "Account", icon: Building2 },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "team", label: "Team", icon: Users },
  { id: "api-keys", label: "API Keys", icon: KeyRound },
  { id: "security", label: "Security", icon: Shield },
]

const mockApiKeys = [
  { id: "key-1", name: "Production", key: "sk_live_a1b2c3...d4e5", created: "Jan 15, 2025", lastUsed: "2 hours ago" },
  { id: "key-2", name: "Development", key: "sk_test_f6g7h8...i9j0", created: "Feb 1, 2025", lastUsed: "5 mins ago" },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile")
  const dispatch = useAppDispatch()

  const { user } = useAppSelector(state => state.auth)
  const { currentTenant } = useAppSelector(state => state.tenant)
  const { users } = useAppSelector(state => state.users)

  useEffect(() => {
    if (activeSection === 'team') {
      dispatch(fetchUsers())
    }
    if (activeSection === 'account' && !currentTenant) {
      dispatch(fetchCurrentTenant())
    }
  }, [activeSection, dispatch, currentTenant])

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground text-balance">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account, team, and platform preferences
        </p>
      </div>

      <div className="flex gap-8">
        {/* Settings Nav */}
        <nav className="hidden w-48 shrink-0 md:block" aria-label="Settings navigation">
          <div className="flex flex-col gap-0.5">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    activeSection === section.id
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {section.label}
                </button>
              )
            })}
          </div>
        </nav>

        {/* Content */}
        <div className="flex-1">
          {/* Mobile section selector */}
          <div className="mb-6 md:hidden">
            <select
              value={activeSection}
              onChange={(e) => setActiveSection(e.target.value)}
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
              aria-label="Select settings section"
            >
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Profile Section */}
          {activeSection === "profile" && (
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-card-foreground">Profile</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Update your personal information
              </p>

              <div className="mt-6 flex max-w-lg flex-col gap-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    {user?.name?.substring(0, 2).toUpperCase() || 'ME'}
                  </div>
                  <button className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent">
                    Change Avatar
                  </button>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-card-foreground">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue={user?.name || ''}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-card-foreground">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email || ''}
                    disabled
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10 opacity-70"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-card-foreground">
                    Role
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.role || ''}
                    disabled
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10 opacity-70"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => toast.success("Profile updated")}
                    className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.98]"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Account Section */}
          {activeSection === "account" && (
            <div className="flex flex-col gap-6">
              <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-card-foreground">Organization</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Manage your organization settings
                </p>
                <div className="mt-6 flex max-w-lg flex-col gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-card-foreground">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      defaultValue={currentTenant?.name || ''}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-card-foreground">
                      Workspace URL
                    </label>
                    <div className="flex items-center rounded-md border border-border bg-background">
                      <span className="px-3 text-sm text-muted-foreground">
                        360solve.app/
                      </span>
                      <input
                        type="text"
                        defaultValue={currentTenant?.name?.toLowerCase().replace(/\s+/g, '-') || ''}
                        className="w-full border-l border-border bg-transparent px-3 py-2 text-sm text-foreground outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => toast.success("Organization updated")}
                      className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <h2 className="text-lg font-semibold text-destructive">
                    Danger Zone
                  </h2>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Permanently delete your organization and all associated data. This action cannot be undone.
                </p>
                <button className="mt-4 rounded-md bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground transition-colors hover:bg-destructive/90">
                  Delete Organization
                </button>
              </div>
            </div>
          )}

          {/* Billing Section */}
          {activeSection === "billing" && (
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-card-foreground">Billing</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage your subscription and billing details
              </p>
              <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-card-foreground">Pro Plan</p>
                    <p className="text-xs text-muted-foreground">$49/month, billed monthly</p>
                  </div>
                  <button className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent">
                    Change Plan
                  </button>
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-3 text-sm">
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">Next billing date</span>
                  <span className="font-medium text-card-foreground">March 1, 2025</span>
                </div>
                <div className="flex items-center justify-between border-t border-border py-2">
                  <span className="text-muted-foreground">Payment method</span>
                  <span className="font-medium text-card-foreground">Visa ending in 4242</span>
                </div>
                <div className="flex items-center justify-between border-t border-border py-2">
                  <span className="text-muted-foreground">Workflows used</span>
                  <span className="font-medium text-card-foreground">12 / 50</span>
                </div>
              </div>
            </div>
          )}

          {/* Team Section */}
          {activeSection === "team" && (
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-card-foreground">Team Members</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Invite and manage team members
                  </p>
                </div>
                <button
                  onClick={() => toast.info("Invite flow coming soon")}
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Invite
                </button>
              </div>
              <div className="mt-6 flex flex-col divide-y divide-border">
                {users.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">No team members found</div>
                ) : users.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                        {member.name?.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-card-foreground">
                          {member.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {member.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        {member.role}
                      </span>
                      {member.id !== user?.id && (
                        <button
                          className="text-muted-foreground transition-colors hover:text-destructive"
                          aria-label={`Remove ${member.name}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* API Keys Section */}
          {activeSection === "api-keys" && (
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-card-foreground">API Keys</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Manage keys used to authenticate API requests
                  </p>
                </div>
                <button
                  onClick={() => toast.info("Key generation coming soon")}
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Create Key
                </button>
              </div>
              <div className="mt-6 flex flex-col divide-y divide-border">
                {mockApiKeys.map((apiKey) => (
                  <div key={apiKey.id} className="flex items-center justify-between py-4">
                    <div>
                      <p className="text-sm font-medium text-card-foreground">
                        {apiKey.name}
                      </p>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <code className="font-mono">{apiKey.key}</code>
                        <span>Created {apiKey.created}</span>
                        <span>Last used {apiKey.lastUsed}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(apiKey.key)
                          toast.success("Key copied to clipboard")
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        aria-label={`Copy ${apiKey.name} key`}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      <button
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        aria-label={`Delete ${apiKey.name} key`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Section */}
          {activeSection === "security" && (
            <div className="flex flex-col gap-6">
              <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-card-foreground">Password</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Update your password to keep your account secure
                </p>
                <div className="mt-6 flex max-w-lg flex-col gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-card-foreground">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-card-foreground">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-card-foreground">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => toast.success("Password updated")}
                      className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-card-foreground">
                  Two-Factor Authentication
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
                <div className="mt-4 flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-card-foreground">
                        Authenticator App
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Not configured
                      </p>
                    </div>
                  </div>
                  <button className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent">
                    Enable
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
