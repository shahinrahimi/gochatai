"use client"
import React from "react"
import { ThemeProvider } from "next-themes"

interface ThemeProviderProps {
  children: React.ReactNode
}
export function ThemeProviderWrapper({children}: ThemeProviderProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      {children}
    </ThemeProvider>
  )
}
