"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Footer from "@/components/Footer"
import { motion } from "framer-motion"
import Link from "next/link"
import { LogOut, PlusCircle, Book, BarChart, Smile, Frown, Meh } from "lucide-react"
import AppHeader from "@/components/AppHeader"
import { useAuth } from "@/hooks/useAuth"
import { fetchData } from "@/utils/api"
import useSocket from "@/hooks/useSocket"
import "react-big-calendar/lib/css/react-big-calendar.css"
import MoodCalendar from "@/components/MoodCalendar"



interface MoodEntry {
  recorded_date: string
  mood: "POSITIVE" | "NEGATIVE" | "NEUTRAL"
  count: number
}

// const moodColors = {
//   POSITIVE: "#4CAF50",
//   NEGATIVE: "#F44336",
//   NEUTRAL: "#FFC107",
// }

// const MoodIcon = ({ mood }: { mood: "POSITIVE" | "NEGATIVE" | "NEUTRAL" }) => {
//   switch (mood) {
//     case "POSITIVE":
//       return <Smile className="w-5 h-5" style={{ color: moodColors.POSITIVE }} />
//     case "NEGATIVE":
//       return <Frown className="w-5 h-5" style={{ color: moodColors.NEGATIVE }} />
//     case "NEUTRAL":
//       return <Meh className="w-5 h-5" style={{ color: moodColors.NEUTRAL }} />
//   }
// }

export default function Dashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])

  useEffect(() => {
    if (!user) {
      router.replace("/login")
    } else {
      fetchMoodEntries()
    }
  }, [user, router])

  useSocket()

  const fetchMoodEntries = async () => {
    try {
      const response = await fetchData("analysis/index.php?action=mood-trends")
      if (response.status === 200 && response.data) {
        setMoodEntries(response.data)
      }
    } catch (err) {
      console.error("Failed to fetch mood entries:", err)
    }
  }

  const handleLogout = async () => {
    try {
      if (!user?.token) {
        console.error("No token found for logout.")
        return
      }

      await fetchData("authentication/index.php?action=logout", "POST", {
        token: user.token,
      })

      logout()
      router.push("/login")
    } catch (err) {
      console.error("Failed to log out:", err)
    }
  }

  if (!user) {
    return null
  }

  // Aggregate moods per date
  // const aggregatedMoods: Record<string, { mood: string; count: number }> = {}

  // moodEntries.forEach((entry) => {
  //   if (aggregatedMoods[entry.recorded_date]) {
  //     aggregatedMoods[entry.recorded_date].count += entry.count
  //   } else {
  //     aggregatedMoods[entry.recorded_date] = { mood: entry.mood, count: entry.count }
  //   }
  // })

  // // Format events for Calendar
  // const calendarEvents = Object.entries(aggregatedMoods).map(([date, data]) => ({
  //   title: `${data.mood} (${data.count})`,
  //   start: new Date(date),
  //   end: new Date(date),
  //   mood: data.mood,
  // }))

  // // Style events based on mood
  // const eventStyleGetter = (event: any) => ({
  //   style: {
  //     backgroundColor: moodColors[event.mood] || "#757575",
  //     borderRadius: "5px",
  //     opacity: 0.8,
  //     color: "white",
  //     border: "none",
  //     display: "block",
  //     padding: "4px",
  //     textAlign: "center",
  //     fontWeight: "bold",
  //   },
  // })

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <DashboardCard title="New Entry" description="Create a new journal entry" icon={<PlusCircle />} link="/journal/create" />
            <DashboardCard title="View Entries" description="Browse your past journal entries" icon={<Book />} link="/journal" />
            <DashboardCard title="Mood Analysis" description="View your mood trends and insights" icon={<BarChart />} link="/analysis" />
          </div>

          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md mb-8">
            {/* <h2 className="text-2xl font-semibold text-rose-800 dark:text-rose-200 mb-4">Mood Calendar</h2> */}
           {/* <Calendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500, borderRadius: "10px", padding: "10px", backgroundColor: "white" }}
              eventPropGetter={eventStyleGetter}
              components={{
                event: (props) => (
                  <div className="flex items-center space-x-2">
                    <MoodIcon mood={props.event.mood} />
                    <span>{props.event.title}</span>
                  </div>
                ),
              }}
            />*/}
            <MoodCalendar moodEntries={moodEntries} />
            
          </div>
        </motion.div>
      </section>
      <Footer />
    </main>
  )
}

interface DashboardCardProps {
  title: string
  description: string
  icon: React.ReactNode
  link: string
}

function DashboardCard({ title, description, icon, link }: DashboardCardProps) {
  return (
    <Link href={link} className="block">
      <motion.div
        className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center space-x-3"
        whileHover={{ scale: 1.03 }}
      >
        {icon}
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-gray-600 dark:text-gray-300">{description}</p>
        </div>
      </motion.div>
    </Link>
  )
}
