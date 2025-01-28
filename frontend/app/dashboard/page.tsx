"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { LogOut, PlusCircle, Book, BarChart } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { useAuth } from "@/hooks/useAuth";
import { fetchData } from "@/utils/api";
import { getCookie } from "cookies-next";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  const handleLogout = async () => {
    try {
      if (!user?.token) {
        console.error("No token found for logout.");
        return;
      }

      await fetchData("authentication/index.php?action=logout", "POST", {
        token: user.token,
      });

      logout();
      router.push("/login");
    } catch (err) {
      console.error("Failed to log out:", err);
    }
  };

  if (!user) {
    return null;
  }
  // console.log(getCookie("authToken"));
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
            <h1 className="text-3xl font-bold text-rose-800 dark:text-rose-200">
              Welcome, {user.username.charAt(0).toUpperCase() + user.username.slice(1)}!
            </h1>
            <button
              className="flex items-center px-4 py-2 bg-rose-200 dark:bg-rose-800 text-rose-700 dark:text-rose-200 rounded-md hover:bg-rose-300 dark:hover:bg-rose-700 transition duration-300"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard
              title="New Entry"
              description="Create a new journal entry"
              icon={<PlusCircle className="w-6 h-6" />}
              link="/journal/create"
            />
            <DashboardCard
              title="View Entries"
              description="Browse your past journal entries"
              icon={<Book className="w-6 h-6" />}
              link="/journal"
            />
            <DashboardCard
              title="Mood Analysis"
              description="View your mood trends and insights"
              icon={<BarChart className="w-6 h-6" />}
              link="/analysis"
            />
          </div>
        </motion.div>
      </section>
      <Footer />
    </main>
  );
}

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

function DashboardCard({ title, description, icon, link }: DashboardCardProps) {
  return (
    <Link href={link} className="block">
      <motion.div
        className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="flex items-center mb-4 text-rose-600 dark:text-rose-400">
          {icon}
          <h3 className="text-xl font-semibold ml-2">{title}</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </motion.div>
    </Link>
  );
}
