"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { fetchData } from "@/utils/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const response = await fetchData<{
        message?: string;
        user_id?: string;
        error?: string;
        status?: number;
      }>("authentication/index.php?action=register", "POST", formData);

      if (response.status === 201 && response.message) {
        // Handle success
        toast.success(response.message);
        setSuccessMessage(response.message);
        setTimeout(() => {
          router.push("/login"); // Redirect to login page
        }, 2000);
      } else {
        // Handle error returned from the API
        toast.error(response.error || response.message || "Registration failed.");
        setError(response.error || "Registration failed. Please try again.");
      }
    } catch (err: any) {
      // Handle network or unexpected errors
      toast.error(err.message || "An error occurred. Please try again.");
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 to-white dark:from-rose-950 dark:to-black">
      <Header />

      <section className="flex-grow container mx-auto px-4 py-12 md:py-24 flex flex-col items-center justify-center">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-rose-800 dark:text-rose-200 text-center">
            Register
          </h2>
          <form
            className="bg-white dark:bg-zinc-900 shadow-md rounded-lg p-8 space-y-4"
            onSubmit={handleSubmit}
          >
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md text-black dark:text-white bg-white dark:bg-zinc-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-700"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
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
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Create a password"
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md text-black dark:text-white bg-white dark:bg-zinc-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-700"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            {error && (
              <p className="text-red-600 dark:text-red-400 text-sm text-center">
                {error}
              </p>
            )}
            {successMessage && (
              <p className="text-green-600 dark:text-green-400 text-sm text-center">
                {successMessage}
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-rose-200 dark:bg-rose-800 text-rose-700 dark:text-rose-200 py-3 rounded-md hover:bg-rose-300 dark:hover:bg-rose-700 transition duration-300 font-medium"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
          <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-rose-600 dark:text-rose-400 hover:underline"
            >
              Login here
            </Link>
            &nbsp;or&nbsp;
            <Link
              href="/reset-password/request"
              className="text-rose-600 dark:text-rose-400 hover:underline"
            >
              Forgot your password?
            </Link>
          </p>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
