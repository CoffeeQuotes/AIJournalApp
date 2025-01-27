"use client"

import type React from "react"
import { useState, useEffect } from "react"
import AppHeader from "@/components/AppHeader"
import Footer from "@/components/Footer"
import { motion } from "framer-motion"
import { fetchData } from "@/utils/api"
import { Check, Loader2 } from "lucide-react"

interface SettingsResponse {
  data: {
    id: number
    user_id: number
    theme: string
    notification: number
    language: string
    created_at: string
  }
  message: string
  status: number
}

export default function Settings() {
  const [settings, setSettings] = useState<{
    theme: string
    notification: number
    language: string
  }>({
    theme: "light",
    notification: 0,
    language: "en",
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true)
      setError(null)
      try {
        const response: SettingsResponse = await fetchData("/settings/index.php")
        if (response.status === 200 && response.data) {
          setSettings({
            theme: response.data.theme,
            notification: response.data.notification,
            language: response.data.language,
          })
        } else {
          setError(response.message || "Failed to fetch settings.")
        }
      } catch (err: any) {
        console.error("Error fetching settings:", err)
        setError(err.message || "Failed to fetch settings.")
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target
    setSettings((prevSettings) => ({
      ...prevSettings,
      [id]: id === "notification" ? Number.parseInt(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const response: SettingsResponse = await fetchData("/settings/index.php", "PUT", settings)

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage(response.message || "Settings updated successfully!")
      } else {
        setError(response.message || "Failed to update settings.")
      }
    } catch (err: any) {
      console.error("Error updating settings:", err)
      setError(err.message || "Failed to update settings.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex flex-col">
      <AppHeader />
      <motion.section
        className="flex-grow container mx-auto px-4 py-8 md:py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-rose-800 text-center mb-2">User Settings</h2>
            <p className="text-gray-600 text-center mb-6">Customize your app experience</p>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="w-8 h-8 text-rose-600 animate-spin" />
              </div>
            ) : error ? (
              <p className="text-center text-red-600">{error}</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
                    Theme
                  </label>
                  <select
                    id="theme"
                    className="w-full p-3 border border-gray-300 rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-rose-200"
                    value={settings.theme}
                    onChange={handleInputChange}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="notification" className="block text-sm font-medium text-gray-700 mb-1">
                    Notifications
                  </label>
                  <select
                    id="notification"
                    className="w-full p-3 border border-gray-300 rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-rose-200"
                    value={settings.notification}
                    onChange={handleInputChange}
                  >
                    <option value={1}>On</option>
                    <option value={0}>Off</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                    Language
                  </label>
                  <select
                    id="language"
                    className="w-full p-3 border border-gray-300 rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-rose-200"
                    value={settings.language}
                    onChange={handleInputChange}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>

                {successMessage && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-green-600 text-sm text-center"
                  >
                    {successMessage}
                  </motion.p>
                )}
                <button
                  type="submit"
                  className="w-full bg-rose-200 text-rose-700 py-3 rounded-md hover:bg-rose-300 transition duration-300 font-medium flex items-center justify-center"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Save Settings
                      <Check className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </motion.section>
      <Footer />
    </main>
  )
}

