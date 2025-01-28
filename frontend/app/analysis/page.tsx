"use client"
import React, { useState, useEffect } from "react"
import Footer from "@/components/Footer"
import { motion } from "framer-motion"
import { fetchData } from "@/utils/api"
import { Bar, Pie } from "react-chartjs-2"
import {
  Chart as ChartJS,
  ArcElement,
  PointElement,
  CategoryScale,
  BarElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import AppHeader from "@/components/AppHeader"

ChartJS.register(ArcElement, PointElement, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend)

interface MoodSummaryEntry {
  mood: "NEGATIVE" | "POSITIVE"
  count: number
  recorded_date: string
}

interface MoodTrendsEntry {
  mood: "NEGATIVE" | "POSITIVE"
  total: string
}

interface MoodSummaryResponse {
  data: MoodSummaryEntry[]
  message: string
  status: number
}

interface MoodTrendsResponse {
  data: MoodTrendsEntry[]
  message: string
  status: number
}

export default function Analysis() {
  const [moodSummary, setMoodSummary] = useState<MoodSummaryEntry[]>([])
  const [moodTrends, setMoodTrends] = useState<MoodTrendsEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalysisData = async () => {
      setLoading(true)
      try {
        const trendsResponse: MoodTrendsResponse = await fetchData("/analysis/index.php?action=summary")
        const summaryResponse: MoodSummaryResponse = await fetchData("/analysis/index.php?action=mood-trends")

        if (summaryResponse.status === 200 && trendsResponse.status === 200) {
          setMoodSummary(summaryResponse.data)
          setMoodTrends(trendsResponse.data)
        } else {
          setError(summaryResponse.message || trendsResponse.message || "An error occurred while fetching the data.")
        }
      } catch (err: any) {
        console.error("Error fetching analysis data:", err)
        setError(err.message || "An error occurred while fetching data.")
      } finally {
        setLoading(false)
      }
    }

    fetchAnalysisData()
  }, [])

  // Bar chart data preparation
  const barChartData = {
    labels: Array.from(new Set(moodSummary.map((entry) => entry.recorded_date))).sort(),
    datasets: [
      {
        label: "Positive Mood",
        data: Array.from(new Set(moodSummary.map((entry) => entry.recorded_date)))
          .sort()
          .map((date) =>
            moodSummary
              .filter((entry) => entry.recorded_date === date && entry.mood === "POSITIVE")
              .reduce((acc, entry) => acc + entry.count, 0),
          ),
        backgroundColor: "#4caf50",
      },
      {
        label: "Negative Mood",
        data: Array.from(new Set(moodSummary.map((entry) => entry.recorded_date)))
          .sort()
          .map((date) =>
            moodSummary
              .filter((entry) => entry.recorded_date === date && entry.mood === "NEGATIVE")
              .reduce((acc, entry) => acc + entry.count, 0),
          ),
        backgroundColor: "#f44336",
      },
    ],
  }

  // Pie chart data preparation
  const pieChartData = {
    labels: ["Positive Mood", "Negative Mood"],
    datasets: [
      {
        data: [
          Number(moodTrends.find((entry) => entry.mood === "POSITIVE")?.total || 0),
          Number(moodTrends.find((entry) => entry.mood === "NEGATIVE")?.total || 0),
        ],
        backgroundColor: ["#4caf50", "#f44336"],
        borderColor: ["rgba(76, 175, 80, 0.8)", "rgba(244, 67, 54, 0.8)"],
        borderWidth: 1,
      },
    ],
  }

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "rgb(156, 163, 175)", // gray-400 for both light and dark mode
        },
      },
      title: {
        display: true,
        text: "Daily Mood Analysis",
        color: "rgb(156, 163, 175)", // gray-400 for both light and dark mode
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: "rgb(156, 163, 175)", // gray-400 for both light and dark mode
        },
        grid: {
          color: "rgba(156, 163, 175, 0.1)", // Slightly visible grid lines
        },
      },
      x: {
        ticks: {
          color: "rgb(156, 163, 175)", // gray-400 for both light and dark mode
        },
        grid: {
          color: "rgba(156, 163, 175, 0.1)", // Slightly visible grid lines
        },
      },
    },
  }

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "rgb(156, 163, 175)", // gray-400 for both light and dark mode
        },
      },
      title: {
        display: true,
        text: "Overall Mood Distribution",
        color: "rgb(156, 163, 175)", // gray-400 for both light and dark mode
      },
    },
  }

  const generateInsights = () => {
    if (loading) return "Loading insights..."
    if (error) return "Error loading insights."
    if (moodTrends.length === 0) return "No data available to show insights"

    const positiveMoodTotal = Number(moodTrends.find((item) => item.mood === "POSITIVE")?.total || 0)
    const negativeMoodTotal = Number(moodTrends.find((item) => item.mood === "NEGATIVE")?.total || 0)
    const totalMoods = positiveMoodTotal + negativeMoodTotal

    let insightText = ""

    if (positiveMoodTotal > negativeMoodTotal) {
      const positivePercentage = ((positiveMoodTotal / totalMoods) * 100).toFixed(1)
      insightText = `You've been feeling more positive overall! ${positivePercentage}% of your entries are positive (${positiveMoodTotal} out of ${totalMoods} total entries).`
    } else if (negativeMoodTotal > positiveMoodTotal) {
      const negativePercentage = ((negativeMoodTotal / totalMoods) * 100).toFixed(1)
      insightText = `You've been feeling more negative lately. ${negativePercentage}% of your entries are negative (${negativeMoodTotal} out of ${totalMoods} total entries).`
    } else {
      insightText = "Your mood appears to be perfectly balanced with an equal number of positive and negative entries."
    }

    const dates = Array.from(new Set(moodSummary.map((entry) => entry.recorded_date))).sort()
    if (dates.length > 0) {
      const positiveByDate = new Map()
      const negativeByDate = new Map()

      moodSummary.forEach((entry) => {
        const map = entry.mood === "POSITIVE" ? positiveByDate : negativeByDate
        map.set(entry.recorded_date, (map.get(entry.recorded_date) || 0) + entry.count)
      })

      let maxPositiveCount = 0
      let maxNegativeCount = 0
      let mostPositiveDay = null
      let mostNegativeDay = null

      dates.forEach((date) => {
        const positiveCount = positiveByDate.get(date) || 0
        const negativeCount = negativeByDate.get(date) || 0

        if (positiveCount > maxPositiveCount) {
          maxPositiveCount = positiveCount
          mostPositiveDay = date
        }
        if (negativeCount > maxNegativeCount) {
          maxNegativeCount = negativeCount
          mostNegativeDay = date
        }
      })

      if (mostPositiveDay) {
        insightText += ` Your most positive day was ${mostPositiveDay}.`
      }
      if (mostNegativeDay) {
        insightText += ` Your most negative day was ${mostNegativeDay}.`
      }
    }

    return insightText
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
        <h1 className="text-3xl font-bold text-rose-800 dark:text-rose-200 mb-6 text-center">Your Mood Analysis</h1>

        {loading ? (
          <p className="text-center text-gray-600 dark:text-gray-400">Loading analysis data...</p>
        ) : error ? (
          <p className="text-center text-red-600 dark:text-red-400">{error}</p>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="h-[400px] bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Daily Mood Summary</h2>
                <Bar data={barChartData} options={barChartOptions} />
              </div>
              <div className="h-[400px] bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
                  Overall Mood Distribution
                </h2>
                <Pie data={pieChartData} options={pieChartOptions} />
              </div>
            </div>

            <div className="mt-6 bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Insights</h2>
              <p className="text-gray-800 dark:text-gray-200">{generateInsights()}</p>
            </div>
          </>
        )}
      </motion.section>
      <Footer />
    </main>
  )
}

