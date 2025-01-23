"use client";

import React, { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { PlusCircle, Book, ChevronRight } from "lucide-react";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { fetchData } from "@/utils/api";

interface Entry {
  id: number;
  date: string;
  title: string;
  preview: string;
}

export default function Journal() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
      // Only fetch data if user is authenticated
      const fetchJournalEntries = async () => {
        if (!user?.token) {
          return;
        }

        try {
          const response = await fetchData("journal/index.php", "GET", null, user.token);

          if (response.status === 200) {
            const formattedEntries = response.data.map((entry: any) => ({
              id: entry.id,
              date: new Date(entry.created_at).toLocaleDateString(),
              title: generateTitle(entry.entry_text),
              preview: generateExcerpt(entry.entry_text),
            }));
            setEntries(formattedEntries);
          } else {
            console.error("Failed to fetch entries:", response.message);
          }
        } catch (error) {
          console.error("Error fetching journal entries:", error);
        } finally {
          setDataLoading(false);
        }
      };

      fetchJournalEntries();

  }, [user]);

  const generateTitle = (entryText: string): string => {
    const firstSentence = entryText.split(".")[0];
    return firstSentence.length > 50 ? `${firstSentence.slice(0, 47)}...` : firstSentence;
  };

  const generateExcerpt = (entryText: string): string => {
    return entryText.length > 100 ? `${entryText.slice(0, 97)}...` : entryText;
  };

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex flex-col">
      <AppHeader />
      <section className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-rose-800">Your Journal</h1>
            <Link
              href="/new-entry"
              className="flex items-center px-4 py-2 bg-rose-200 text-rose-700 rounded-md hover:bg-rose-300 transition duration-300"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              New Entry
            </Link>
          </div>

          <div className="space-y-4">
            {entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>

          {entries.length === 0 && (
            <div className="text-center py-12">
              <Book className="w-16 h-16 text-rose-300 mx-auto mb-4" />
              <p className="text-gray-600">You haven't made any entries yet. Start journaling today!</p>
            </div>
          )}
        </motion.div>
      </section>
      <Footer />
    </main>
  );
}

function EntryCard({ entry }: { entry: Entry }) {
  return (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-xl font-semibold text-rose-700">{entry.title}</h2>
        <span className="text-sm text-gray-500">{entry.date}</span>
      </div>
      <p className="text-gray-600 mb-4">{entry.preview}</p>
      <Link
        href={`/entry/${entry.id}`}
        className="flex items-center text-rose-600 hover:text-rose-800 transition-colors duration-300"
      >
        Read more
        <ChevronRight className="w-4 h-4 ml-1" />
      </Link>
    </motion.div>
  );
}