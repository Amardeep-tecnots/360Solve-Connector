import type { Metadata, Viewport } from "next"
import { Sora, IBM_Plex_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { ReduxProvider } from "@/lib/store/provider"

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
})

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Nia Connect - AI-Powered Data Synchronization",
  description:
    "Nia connects and synchronizes data across any system — cloud, database, or on-premise — using AI that maps fields automatically so your team never touches a spreadsheet again.",
}

export const viewport: Viewport = {
  themeColor: "#2463EB",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${sora.variable} ${ibmPlexMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ReduxProvider>
          {children}
        </ReduxProvider>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  )
}
