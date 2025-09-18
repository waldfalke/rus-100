import "./globals.css"
import { Inter, Source_Serif_4 } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import React from "react"

const inter = Inter({ 
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"]
})

const sourceSerifPro = Source_Serif_4({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-source-serif-pro",
  weight: ["400", "500", "600", "700"]
})

export const metadata = {
  title: "Генерация теста",
  description: "Приложение для генерации тестов с настраиваемой сложностью",
  generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning className={`${inter.variable} ${sourceSerifPro.variable}`}>
      <body className="bg-background font-sans">
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
