"use client";

import React, { useEffect, useState } from "react";
// import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Trash2, Smile, Meh, Frown } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { fetchData } from "@/utils/api";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import useSocket from "@/hooks/useSocket";

interface Classfier {
  classifier: string;
}
interface SingleEntry {
  id: number;
  date: string;
  time: string;
  title: string;
  content: string;
  mood: string;
  classifier: Classfier[];
}

const getMoodEmoji = (mood: string) => {
  switch (mood.toLowerCase()) {
    case 'positive':
      return <Smile className="w-6 h-6 text-green-500" />;
    case 'negative':
      return <Frown className="w-6 h-6 text-red-500" />;
    default:
      return <Meh className="w-6 h-6 text-yellow-500" />;
  }
};


export default function JournalEntry({ params }: { params: Promise<{ id: string }> }) {
  const { user } = useAuth();
  const [entry, setEntry] = useState<SingleEntry | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchJournalEntry = async () => {
      if (!user?.token) {
        return;
      }

      try {
        const resolvedParams = await params; // Unwrap the promise
        const response = await fetchData(`journal/index.php?id=${resolvedParams.id}`, "GET", null);

        if (response.status === 200) {
          const data = response.data;
          const formattedEntry = {
            id: data.id,
            date: new Date(data.created_at).toLocaleDateString(),
            time: new Date(data.created_at).toLocaleTimeString(),
            title: generateTitle(data.entry_text),
            content: data.entry_text,
            mood: data.mood,
            classifier: data.classifiers,
          };
          setEntry(formattedEntry);
        } else {
          console.error("Failed to fetch entry:", response.message);
        }
      } catch (error) {
        console.error("Error fetching journal entry:", error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchJournalEntry();
  }, [user, params]);
  useSocket();
  const generateTitle = (entryText: string): string => {
    const firstSentence = entryText.split(".")[0];
    return firstSentence.length > 50 ? `${firstSentence.slice(0, 47)}...` : firstSentence;
  };

  const handleDelete = async () => {
    if (!user?.token || !entry) {
      return;
    }

    const confirmed = window.confirm("Are you sure you want to delete this journal entry?");
    if (!confirmed) {
      return;
    }

    try {
      const response = await fetchData(`journal/index.php?id=${entry.id}`, "DELETE", null);

      if (response.status === 200) {
        alert("Journal entry deleted successfully!");
        router.push("/journal"); // Redirect to the journal list
      } else {
        console.error("Failed to delete entry:", response.message);
      }
    } catch (error) {
      console.error("Error deleting journal entry:", error);
    }
  };

  if (dataLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white dark:bg-black text-gray-800 dark:text-gray-200">
        <p>Loading...</p>
      </main>
    );
  }

  if (!entry) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white dark:bg-black text-gray-800 dark:text-gray-200">
        <p>Entry not found</p>
      </main>
    );
  }

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
            <h1 className="text-3xl font-bold text-rose-800 dark:text-rose-200 mb-4">{entry.title}</h1>

            <div className="flex items-center text-gray-600 dark:text-gray-400 mb-6">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="mr-4">{entry.date}</span>
              <Clock className="w-4 h-4 mr-2" />
              <span>{entry.time}</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 dark:text-gray-400">&nbsp; Mood:</span>
                {getMoodEmoji(entry.mood)}
              </div>
            </div>

            <div className="prose dark:prose-invert max-w-none">
              {entry.content.split("\n\n").map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700 dark:text-gray-300">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold text-rose-800 dark:text-rose-200 mb-4">Classifiers</h2>
              <ul className="list-disc list-inside">
                {entry.classifier.map((classifier, index) => (
                  <li key={index} className="mb-2 text-gray-700 dark:text-gray-300">
                    {classifier.classifier}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 bg-red-200 dark:bg-red-800 text-red-700 dark:text-red-200 rounded-md hover:bg-red-300 dark:hover:bg-red-700 transition duration-300"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Entry
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      <Footer />
    </main>
  );
}
