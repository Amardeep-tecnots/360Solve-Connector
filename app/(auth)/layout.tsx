import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "../globals.css"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
})

export const metadata: Metadata = {
  title: "Auth - 360Solve Connector",
  description: "Sign in or create an account",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Next.js root layout provides <html> and <body>, so we just return the styled wrapper
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      {children}
    </div>
  )
}
