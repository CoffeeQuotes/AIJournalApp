"use client";

import type React from "react";
import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchData } from "@/utils/api"; // Assuming fetchData is a utility for API calls
import { useAuth } from "@/hooks/useAuth"; // Assuming useAuth provides the user token

export default function NewEntry() {
  const [entryText, setEntryText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // State to handle submission state
  const router = useRouter();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const payload = { entry_text: entryText };
  
      // Use your fetchData utility
      const response = await fetchData("/journal/index.php", "POST", payload);
  
      // Check if the response status indicates success
      if (response.status === 201) {
        alert(response.message || "Journal entry created successfully!");
        router.push("/journal"); // Redirect to the journal page
      } else {
        // Handle unexpected status codes
        alert(`Failed to create entry: ${response.message}`);
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Error creating journal entry:", error);
      alert("An error occurred while creating the entry. Please try again.");
    }
  };
  

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 to-white dark:from-rose-950 dark:to-black flex flex-col">
      <AppHeader />

      <motion.section
        className="flex-grow container mx-auto px-4 py-8 md:py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Link
              href="/journal"
              className="inline-flex items-center text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-200 transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Journal
            </Link>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 md:p-8">
            <h1 className="text-3xl font-bold text-rose-800 dark:text-rose-200 mb-6">New Journal Entry</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="entry-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  What's on your mind today?
                </label>
                <textarea
                  id="entry-text"
                  rows={10}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 text-black dark:text-white bg-white dark:bg-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-700 resize-none placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Start writing your journal entry here..."
                  value={entryText}
                  onChange={(e) => setEntryText(e.target.value)}
                  required
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  className={`inline-flex items-center px-4 py-2 rounded-md transition duration-300 ${
                    isSubmitting
                      ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      : "bg-rose-200 dark:bg-rose-800 text-rose-700 dark:text-rose-200 hover:bg-rose-300 dark:hover:bg-rose-700"
                  }`}
                  disabled={isSubmitting}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Saving..." : "Save Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.section>

      <Footer />
    </main>
  );
}
