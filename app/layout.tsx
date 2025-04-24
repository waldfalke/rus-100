import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const metadata = {
  title: "Генерация теста",
  description: "Приложение для генерации тестов с настраиваемой сложностью",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
