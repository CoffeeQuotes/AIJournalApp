"use client";

import React, { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { PlusCircle, Book, ChevronRight, Smile, Meh, Frown } from "lucide-react";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { fetchData } from "@/utils/api";
import Button from "@/components/ui/button";
import useSocket from "@/hooks/useSocket";

interface Entry {
  id: number;
  date: string;
  title: string;
  preview: string;
  sentiment_score: number;
  mood: string;
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

const getSentimentIntensity = (score: number) => {
  // Convert confidence score to percentage intensity
  return Math.round(score * 100); 
}

export default function Journal() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("created_at");
  const [order, setOrder] = useState("DESC");

  const router = useRouter();

  useEffect(() => {
    const fetchJournalEntries = async () => {
      if (!user?.token) return;

      setDataLoading(true);
      try {
        const response = await fetchData(
          `journal/index.php?page=${page}&limit=5&sort_by=${sortBy}&order=${order}`,
          "GET",
          null
        );

        if (response.status === 200) {
          const formattedEntries = response.data.map((entry: any) => ({
            id: entry.id,
            date: new Date(entry.created_at).toLocaleDateString(),
            title: generateTitle(entry.entry_text),
            preview: generateExcerpt(entry.entry_text),
            sentiment_score: Math.round(entry.sentiment_score), // Convert to percentage
            mood: entry.mood,
          }));

          setEntries(formattedEntries);
          setTotalPages(response.pagination.total_pages);
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
  }, [user, page, sortBy, order]);
  useSocket();
  const generateTitle = (entryText: string): string => {
    const firstSentence = entryText.split(".")[0];
    return firstSentence.length > 50 ? `${firstSentence.slice(0, 47)}...` : firstSentence;
  };

  const generateExcerpt = (entryText: string): string => {
    return entryText.length > 100 ? `${entryText.slice(0, 97)}...` : entryText;
  };

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black text-gray-800 dark:text-gray-200">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 to-white dark:from-rose-950 dark:to-black flex flex-col">
      <AppHeader />
      <section className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-rose-800 dark:text-rose-200">Your Journal</h1>
            <Link
              href="/journal/create"
              className="flex items-center px-4 py-2 bg-rose-200 dark:bg-rose-800 text-rose-700 dark:text-rose-200 rounded-md hover:bg-rose-300 dark:hover:bg-rose-700 transition duration-300"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              New Entry
            </Link>
          </div>

          {/* Sorting Controls */}
          <div className="flex justify-end space-x-2 mb-4">
            <select
              className="px-3 py-2 rounded-md border dark:border-gray-600 dark:bg-zinc-800 dark:text-white"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="created_at">Date</option>
              <option value="sentiment_score">Sentiment</option>
            </select>

            <select
              className="px-3 py-2 rounded-md border dark:border-gray-600 dark:bg-zinc-800 dark:text-white"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
            >
              <option value="DESC">Descending</option>
              <option value="ASC">Ascending</option>
            </select>
          </div>

          {/* Journal Entries */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>

          {/* No Entries */}
          {entries.length === 0 && (
            <div className="text-center py-12">
              <Book className="w-16 h-16 text-rose-300 dark:text-rose-700 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                You haven't made any entries yet. Start journaling today!
              </p>
            </div>
          )}

          {/* Pagination Controls */}
          {/* <div className="flex justify-between items-center mt-8"> */}
            {/* This shouldn't be shown if it is first page */}

            {/* <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
              Previous
            </Button> */}
            {/* <span className="text-gray-700 dark:text-gray-300">
              Page {page} of {totalPages}
            </span> */}
            {/* This shouldn't be shown if it last page  */}
            {/* <Button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
              Next
            </Button> */}
          {/* </div> */}
          <div className="flex justify-between items-center mt-8">
          {page > 1 && (
            <Button onClick={() => setPage(page - 1)}>
              Previous
            </Button>
          )}

          <span className="text-gray-700 dark:text-gray-300">
            Page {page} of {totalPages}
          </span>

          {page < totalPages && (
            <Button onClick={() => setPage(page + 1)}>
              Next
            </Button>
          )}
        </div>

        </motion.div>
      </section>
      <Footer />
    </main>
  );
}

function EntryCard({ entry }: { entry: Entry }) {
  const intensity = getSentimentIntensity(entry.sentiment_score);
  const isPositive = entry.mood.toLowerCase() === 'positive';
  return (
    <motion.div
      className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-xl font-semibold text-rose-700 dark:text-rose-300">{entry.title}</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">{entry.date}</span>
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">{entry.preview}</p>
      <div className="space-y-3">
        {/* Bidirectional Sentiment Bar */}
        {/* <div className="space-y-1">
          <div className="flex justify-between items-center text-sm">
            <span className="text-red-500 dark:text-red-400">Negative</span>
            <span className="text-green-500 dark:text-green-400">Positive</span>
          </div>
          <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"> */}
            {/* Center line */}
            {/* <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-400 dark:bg-gray-500" /> */}
            {/* Sentiment bar */}
            {/* {isPositive ? (
              <div 
                className="absolute left-1/2 top-0 bottom-0 bg-green-500 transition-all duration-300"
                style={{ width: `${intensity / 2}%` }}
              />
            ) : (
              <div 
                className="absolute right-1/2 top-0 bottom-0 bg-red-500 transition-all duration-300"
                style={{ width: `${intensity / 2}%` }}
              />
            )}
          </div>
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            {isPositive ? 'Positive' : 'Negative'} ({intensity}% confident)
          </div>
        </div> */}
        {/* Mood with Emoji */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-gray-600 dark:text-gray-400">Mood:</span>
            {getMoodEmoji(entry.mood)}
          </div>
          <Link
            href={`/journal/${entry.id}`}
            className="flex items-center text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-200 transition-colors duration-300"
          >
            Read more
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}