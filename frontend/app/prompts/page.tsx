"use client"

import React, { useState, useEffect } from "react"
import AppHeader from "@/components/AppHeader"
import { motion } from "framer-motion"
import { Sparkles, Copy, Check } from "lucide-react"
import { fetchData } from "@/utils/api"
import useSocket from "@/hooks/useSocket"

interface PromptResponse {
  data: { id: number; text: string; category: string; created_at: string }
  message: string
  status: number
}

export default function Prompt() {
  const [currentPrompt, setCurrentPrompt] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRandomPrompt = async () => {
    setLoading(true)
    setError(null)
    try {
      const response: PromptResponse = await fetchData("/prompts/index.php?random=true")
      if (response.status === 200 && response.data && response.data.text) {
        setCurrentPrompt(response.data.text)
      } else {
        setError(response.message || "Failed to fetch a prompt.")
        setCurrentPrompt(null)
      }
    } catch (err: any) {
      console.error("Failed to fetch prompts:", err)
      setError(err.message || "Failed to fetch a prompt.")
      setCurrentPrompt(null)
    } finally {
      setLoading(false)
    }

    setIsCopied(false)
  }

  useEffect(() => {
    fetchRandomPrompt()
  }, []) //Fixed: Added empty dependency array to run only once on mount

  useSocket();
  
  const copyToClipboard = async () => {
    if (currentPrompt) {
      try {
        await navigator.clipboard.writeText(currentPrompt)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      } catch (err) {
        console.error("Failed to copy text: ", err)
      }
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 to-white dark:from-rose-950 dark:to-black flex flex-col">
      <AppHeader />
      <motion.div
        className="flex-grow container mx-auto px-4 py-8 md:py-12 flex flex-col items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-rose-800 dark:text-rose-200 mb-8 text-center">
          Daily Reflection Prompt
        </h1>

        <button
          onClick={fetchRandomPrompt}
          className="bg-rose-200 dark:bg-rose-800 text-rose-700 dark:text-rose-200 px-6 py-3 rounded-full font-semibold shadow-md hover:bg-rose-300 dark:hover:bg-rose-700 transition duration-300 flex items-center"
          aria-label="Generate new prompt"
          disabled={loading}
        >
          {loading ? (
            "Loading..."
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Prompt
            </>
          )}
        </button>
        {error && <p className="text-red-600 dark:text-red-400 text-center mt-4">{error}</p>}
        {currentPrompt && (
          <motion.div
            className="mt-8 p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-md max-w-2xl w-full relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-xl text-gray-800 dark:text-gray-200 text-center pr-10">{currentPrompt}</p>
            <button
              onClick={copyToClipboard}
              className="absolute top-2 right-2 p-2 text-gray-500 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors duration-300"
              aria-label={isCopied ? "Prompt copied" : "Copy prompt to clipboard"}
            >
              {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </motion.div>
        )}

        <p className="mt-8 text-gray-600 dark:text-gray-400 text-center max-w-md">
          Use these prompts as a starting point for your journal entries. They can help guide your reflections and
          inspire deeper self-awareness.
        </p>
      </motion.div>
    </main>
  )
}

