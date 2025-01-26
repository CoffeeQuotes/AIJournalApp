"use client"

import type React from "react"
import { useState } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { motion } from "framer-motion"
import { ArrowLeft, Send } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { fetchData } from "@/utils/api"

export default function RequestPasswordReset() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage("")

    try {
      // Here you would typically send a request to your backend
      const response = await fetchData("authentication/index.php?action=reset-password-request", "POST", { email });
      setMessage(response.message);
      // send back to login page with success message
      if (response.status === 200) {
        setTimeout(() => {
          router.push("/login"); // Redirect to login
        }, 2000); // Delay of 2 seconds for user to read the message
      }

        
    } catch (error) {
      setMessage("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex flex-col">
      <Header />

      <motion.section
        className="flex-grow container mx-auto px-4 py-8 md:py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <Link
              href="/login"
              className="inline-flex items-center text-rose-600 hover:text-rose-800 transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <h1 className="text-3xl font-bold text-rose-800 mb-6">Reset Password</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-3 border border-gray-300 text-black placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-200"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full inline-flex justify-center items-center px-4 py-2 bg-rose-200 text-rose-700 rounded-md hover:bg-rose-300 transition duration-300 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Reset Link
                    </>
                  )}
                </button>
              </div>
            </form>

            {message && <p className="mt-4 text-sm text-center text-gray-600">{message}</p>}
          </div>
        </div>
      </motion.section>

      <Footer />
    </main>
  )
}

