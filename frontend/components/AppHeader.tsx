"use client"

import { useState } from "react"
import Link from "next/link"
import { Toaster } from "sonner"

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/journal", label: "Journal" },
  { href: "/analysis", label: "Analysis" },
  { href: "/prompts", label: "Prompts" },
  { href: "/settings", label: "Settings" },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-rose-600 dark:text-rose-400">NotesApp</h2>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-200 transition duration-300"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-200 transition duration-300"
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {isOpen && (
            <div className="absolute right-4 mt-2 py-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-xl z-20">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <Toaster richColors position="top-center" />
    </header>
  )
}

