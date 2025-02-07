"use client"

import { useTheme } from "next-themes"
import { Moon, Sun, Github } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white py-4 shadow-md transition-colors duration-300">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Kashi Tiris April Dexter Loui</h1>
        <div className="flex items-center space-x-2">
          {/* GitHub Star Button */}
          <a
            href="https://github.com/rgestudillo/cmsc134-writeups"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200 hover:text-blue-600"
          >
            <Button variant="ghost" aria-label="Star on GitHub" className="flex items-center">
              <Github className="h-5 w-5 mr-2" />
              Star on GitHub
            </Button>
          </a>
          {/* Theme Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="transition-colors duration-200 hover:text-blue-600"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
