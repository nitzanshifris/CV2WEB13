import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "@/components/session-provider"
import { SessionDebugger } from "@/components/session-debugger"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "CV Website Generator",
  description: "Create professional CV websites with ease",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SessionProvider>
            {children}
            <SessionDebugger />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
