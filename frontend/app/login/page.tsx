"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { fetchData } from "@/utils/api";
import { setCookie } from "cookies-next";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";
  // const [activeTheme, setActiveTheme] = useState<string>('system');
  // // Theme 
  // useEffect(() => {
  //   const savedTheme = localStorage.getItem("NotesAppTheme");
  //   if(savedTheme === 'system' || !savedTheme ) {
  //     applySystemTheme();
  //     setActiveTheme("system");
  //   } else {
  //     applyTheme(savedTheme);
  //     setActiveTheme(savedTheme);
  //   }

  //   const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  //   const handleSystemThemeChange = () => {
  //     if (!savedTheme || savedTheme === "system") {
  //       applySystemTheme();
  //     }
  //   };

  //   mediaQuery.addEventListener("change", handleSystemThemeChange);

  //   return () => {
  //     mediaQuery.removeEventListener("change", handleSystemThemeChange);
  //   };
  // }, []);

  // const applyTheme = (theme: string) => {
  //   if (theme === 'dark') {
  //     document.documentElement.classList.add('dark');
  //   } else if (theme === 'light') {
  //     document.documentElement.classList.remove('dark');
  //   }
  // };

  // const handleThemeChange = (newTheme: string) => {
  //   setActiveTheme(newTheme)
  //   localStorage.setItem('theme', newTheme);
  //   if (newTheme === 'system') {
  //     applySystemTheme();
  //   } else {
  //     applyTheme(newTheme);
  //   }
  // };

  // const applySystemTheme = () => {
  //   const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  //   if (systemPrefersDark) {
  //     document.documentElement.classList.add('dark');
  //   } else {
  //     document.documentElement.classList.remove('dark');
  //   }
  // }


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
        message?: string;
        error?: string;
        data?: { token: string; expires_at: string; username: string };
        status: number;
      }>("authentication/index.php?action=login", "POST", formData);

      if (response.status === 200 && response.data) {
        const expireyDate = new Date(response.data.expires_at).getTime();
        const maxAge = Math.round((expireyDate - Date.now()) / 1000);

        // Save token and username to cookies
        setCookie("authToken", response.data.token, { maxAge, path: "/" });
        setCookie("username", response.data.username, { maxAge, path: "/" });

        // Update user state
        login(response.data.token, response.data.username);

        setSuccessMessage(response.message || "Login Successful!");
        router.push(next);
      } else {
        setError(
          response.error || response.message || "Invalid email or password.",
        );
      }
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 to-white dark:from-rose-950 dark:to-black flex flex-col">
    <Header />
    <section className="flex-grow container mx-auto px-4 py-12 md:py-24 flex flex-col items-center justify-center">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-rose-800 dark:text-rose-200 text-center">Login</h2>
        <form className="bg-white dark:bg-zinc-900 shadow-md rounded-lg p-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md text-black dark:text-white bg-white dark:bg-zinc-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-700"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md text-black dark:text-white bg-white dark:bg-zinc-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-700"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          {error && <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>}
          {successMessage && (
            <p className="text-green-600 dark:text-green-400 text-sm text-center">{successMessage}</p>
          )}
          <button
            type="submit"
            className="w-full bg-rose-200 dark:bg-rose-800 text-rose-700 dark:text-rose-200 py-3 rounded-md hover:bg-rose-300 dark:hover:bg-rose-700 transition duration-300 font-medium"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <Link href="/register" className="text-rose-600 dark:text-rose-400 hover:underline">
            Register here
          </Link>{" "}
          or{" "}
          <Link href="/reset-password/request" className="text-rose-600 dark:text-rose-400 hover:underline">
            Forgot your password?
          </Link>
        </p>
      </motion.div>
    </section>
    <Footer />
  </main>
  );
}
