"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <>
      {theme === 'light' ?
        <Sun size={13} onClick={() => setTheme("dark")} /> :
        <Moon size={13} onClick={() => setTheme("light")} />
      }
    </>
  )
}
