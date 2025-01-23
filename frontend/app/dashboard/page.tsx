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

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return null;
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
            <h1 className="text-3xl font-bold text-rose-800">Welcome, User</h1>
            <button
              className="flex items-center px-4 py-2 bg-rose-200 text-rose-700 rounded-md hover:bg-rose-300 transition duration-300"
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
              link="/new-entry"
            />
            <DashboardCard
              title="View Entries"
              description="Browse your past journal entries"
              icon={<Book className="w-6 h-6" />}
              link="/entries"
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
        className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="flex items-center mb-4 text-rose-600">
          {icon}
          <h3 className="text-xl font-semibold ml-2">{title}</h3>
        </div>
        <p className="text-gray-600">{description}</p>
      </motion.div>
    </Link>
  );
}
