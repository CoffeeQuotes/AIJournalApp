"use client"

import { useState, useEffect } from "react"
import AppHeader from "@/components/AppHeader"
import Footer from "@/components/Footer"
import { motion, AnimatePresence } from "framer-motion"
import { fetchData } from "@/utils/api"
import { Bell, CheckCircle, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import useSocket from "@/hooks/useSocket"

interface Notification {
  id: number
  user_id: number
  title: string
  message: string
  is_read: number
  created_at: string
}

interface NotificationResponse {
  data: {
    notifications: Notification[]
    page: string
    limit: number
    total: number
  }
  message: string
  status: number
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isActionLoading, setIsActionLoading] = useState<number | null>(null)

  const fetchNotifications = async (page: number = 1) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetchData<NotificationResponse>(
        `notification/index.php?action=get-notifications&page=${page}`
      )
      
      if (response.status === 200 && response.data) {
        setNotifications(response.data.notifications)
        setTotalPages(Math.ceil(response.data.total / response.data.limit))
        setCurrentPage(parseInt(response.data.page))
      } else {
        setError(response.message || "Failed to fetch notifications.")
      }
    } catch (err: any) {
      console.error("Error fetching notifications:", err)
      setError(err.message || "Failed to fetch notifications.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const markAsRead = async (id: number) => {
    if (isActionLoading === id) return
    setIsActionLoading(id)
    
    try {
      const response = await fetchData(
        "notification/index.php?action=mark-as-read",
        "POST",
        { notification_id: id }
      )

      if (response.status === 200) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === id ? { ...notif, is_read: 1 } : notif
          )
        )
        toast.success("Notification marked as read")
      } else {
        toast.error("Failed to mark notification as read")
      }
    } catch (err) {
      console.error("Error marking notification as read:", err)
      toast.error("Failed to mark notification as read")
    } finally {
      setIsActionLoading(null)
    }
  }

  const deleteNotification = async (id: number) => {
    if (isActionLoading === id) return
    setIsActionLoading(id)

    try {
      const response = await fetchData(
        "notification/index.php?action=delete-notification",
        "POST",
        { notification_id: id }
      )

      if (response.status === 200) {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id))
        toast.success("Notification deleted successfully")
      } else {
        toast.error("Failed to delete notification")
      }
    } catch (err) {
      console.error("Error deleting notification:", err)
      toast.error("Failed to delete notification")
    } finally {
      setIsActionLoading(null)
    }
  }

  // Mark all as read notifications
  const markAllNotificationsRead = async () => {
    try {
      const response = await fetchData(
        "notification/index.php?action=mark-all-as-read",
        "POST"
      )

      if (response.status === 200) {
        // notification will still shown as read 
        setNotifications((prev) =>
          prev.map((notif) => ({ ...notif, is_read: 1 }))
        )
        toast.success("All notifications marked as read")
      } else {
        toast.error("Failed to mark all notifications read.")
      }
    } catch (err) {
      console.error("Error clearing all notifications:", err)
      toast.error("Failed to mark all notifications read")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  useSocket()
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
          <h1 className="text-3xl font-bold text-rose-800 dark:text-rose-400 mb-6 flex items-center justify-center">
            <Bell className="w-8 h-8 mr-2" />
            Notifications
          </h1>
          {/* Mark all notification read */}
          <button
            onClick={markAllNotificationsRead}
            className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 mb-4 flex items-center"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Mark all as read
          </button>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="w-8 h-8 text-rose-600 dark:text-rose-400 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <button
                onClick={() => fetchNotifications(currentPage)}
                className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300"
              >
                Try again
              </button>
            </div>
          ) : notifications.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400">
              No notifications at the moment.
            </p>
          ) : (
            <>
              <AnimatePresence mode="popLayout">
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className={`bg-white dark:bg-zinc-800 rounded-lg shadow-md dark:shadow-gray-700/30 p-4 mb-4 ${
                      notification.is_read ? "opacity-60" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-grow">
                        <h3 className={`text-gray-900 dark:text-gray-100 ${
                          notification.is_read ? "font-normal" : "font-semibold"
                        }`}>
                          {notification.title}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {formatDate(notification.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center ml-4">
                        {!notification.is_read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-green-500 dark:text-green-400 hover:text-green-600 dark:hover:text-green-300 mr-2 disabled:opacity-50"
                            aria-label="Mark as read"
                            disabled={isActionLoading === notification.id}
                          >
                            {isActionLoading === notification.id ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <CheckCircle className="w-5 h-5" />
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 disabled:opacity-50"
                          aria-label="Delete notification"
                          disabled={isActionLoading === notification.id}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-6 space-x-2">
                  <button
                    onClick={() => fetchNotifications(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                    className="px-4 py-2 text-sm rounded-md bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-400 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-gray-700 dark:text-gray-300">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => fetchNotifications(currentPage + 1)}
                    disabled={currentPage === totalPages || loading}
                    className="px-4 py-2 text-sm rounded-md bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-400 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </motion.section>
      <Footer />
    </main>
  )
}