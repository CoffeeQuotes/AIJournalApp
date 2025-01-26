"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { fetchData } from "@/utils/api";
import { setCookie } from 'cookies-next';

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
        const response = await fetchData<{
          message?: string; // Optional, as it might not be present in errors
          error?: string;  // Optional, as it might not be present on success
          data?: { token: string; expires_at: string };
          status: number;
        }>("authentication/index.php?action=login", "POST", formData);

      if (response.status === 200 && response.data) {
        // Handle successful login
        const expireyDate = new Date(response.data.expires_at).getTime()
        const maxAge = Math.round((expireyDate - Date.now()) / 1000);
        setCookie('authToken', response.data.token, { maxAge: maxAge, path: '/' });
        login(response.data.token);
        setSuccessMessage(response.message || "Login Successful!");
        router.push(next);
      } else {
        // Handle unsuccessful login
         setError(response.error || response.message || "Invalid email or password.");
      }

    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex flex-col">
      <Header />
      <section className="flex-grow container mx-auto px-4 py-12 md:py-24 flex flex-col items-center justify-center">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-rose-800 text-center">Login</h2>
          <form className="bg-white shadow-md rounded-lg p-8 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 border border-gray-300 rounded-md text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-200"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="w-full p-3 border border-gray-300 rounded-md text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-200"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            {error && <p className="text-red-600 text-sm text-center">{error}</p>}
            {successMessage && <p className="text-green-600 text-sm text-center">{successMessage}</p>}
            <button
              type="submit"
              className="w-full bg-rose-200 text-rose-700 py-3 rounded-md hover:bg-rose-300 transition duration-300 font-medium"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="mt-4 text-center text-gray-600">
            Don't have an account?{" "}
            <Link href="/register" className="text-rose-600 hover:underline">
              Register here
            </Link>
             or 
            <Link href="/reset-password/request" className="text-rose-600 hover:underline">
              Forgot your password?
            </Link>
          </p>
        </motion.div>
      </section>
      <Footer />
    </main>
  );
}