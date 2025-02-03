"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="flex flex-col">
      {/* Hero Section */}
      <div className="min-h-screen flex items-center justify-center bg-[url('/flowerbg.jpg')] bg-no-repeat bg-cover bg-center">
      {/* Header */}
      <Header />
      <section className="mx-auto p-6 md:p-12 flex flex-col md:flex-row items-center backdrop-blur-sm shadow-md rounded-full border-b border-gray-950/5">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-rose-800 dark:text-rose-200 mb-4">
            Welcome to NotesApp
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Your AI-powered personal journal and mood analyzer.
          </p>
          <div className="space-x-4">
            <Link
              href="/login"
              className="px-6 py-3 bg-rose-200 dark:bg-rose-800 text-rose-700 dark:text-rose-200 rounded-lg shadow-md hover:bg-rose-300 dark:hover:bg-rose-700 transition duration-300"
            >
              Get Started
            </Link>
            <Link
              href="/about"
              className="px-6 py-3 bg-white dark:bg-zinc-800 text-rose-600 dark:text-rose-400 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-zinc-700 transition duration-300"
            >
              Learn More
            </Link>
          </div>
        </motion.div>
        <motion.div
          className="mt-12 md:mt-0"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* <Image
            src="/herobg.jpg"
            alt="Person writing in a journal"
            width={600}
            height={400}
            className="rounded-lg shadow-lg"
          /> */}
        </motion.div>
      </section>
      </div>
      {/* Features Section */}
      <section className="bg-white dark:bg-zinc-900 py-16 bg-[url(/xv.png)]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-rose-800 dark:text-rose-200 mb-12">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {["AI-Powered Analysis", "Mood Tracking", "Secure & Private"].map(
              (feature, index) => (
                <motion.div
                  key={index}
                  className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <h3 className="text-xl font-semibold text-rose-600 dark:text-rose-400 mb-2">
                    {feature}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                </motion.div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
