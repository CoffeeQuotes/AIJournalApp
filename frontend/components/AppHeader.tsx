"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Toaster, toast } from "sonner"
import { Bell } from "lucide-react"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { useAuth } from "@/hooks/useAuth"
import { fetchData } from "@/utils/api"
// import { useRouter } from "next/router"

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/journal", label: "Journal" },
  { href: "/analysis", label: "Analysis" },
  { href: "/prompts", label: "Prompts" },
  { href: "/settings", label: "Settings" },
]

interface Notification {
  id: number
  user_id: number
  title: string
  message: string
  clickable_url?: string
  is_read: number
  created_at: string
}

interface NotificationResponse {
  data: {
    notifications: Notification[]
    total: number
  }
  message: string
  status: number
}

export default function Header() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  // const router = useRouter()
  useEffect(() => {
    setIsAuthenticated(!!user?.token)
  }, [user])

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return

    try {
      const response = await fetchData<NotificationResponse>(
        "notification/index.php?action=get-unread-notifications",
        "POST",
      )

      if (response.status === 200 && response.data?.notifications) {
        setNotifications(response.data.notifications)
      } else {
        // here we are facing issue regarding expired token after (1hrs)
        // so we are not able to fetch data from server 
        // technically the moment token expires, we should logout automatically, but we have to check if token expired then only logout
        // so let's check if token expired or not
        // if token expired then logout
        if (response.status === 500 && response.message === "Unauthorized: Invalid or expired token.") {
          console.log("Token expired")
          // logout
          logout()
        }

        console.error("Failed to fetch notifications:", response.message)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
    }
  }, [isAuthenticated])

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  const handleNotificationClick = async (notification: Notification) => {
    if (isLoading) return
    setIsLoading(true)

    try {
      const response = await fetchData("notification/index.php?action=mark-as-read", "POST", {
        notification_id: notification.id,
      })

      if (response.status === 200) {
        setNotifications((prev) => prev.filter((n) => n.id !== notification.id))
        toast.success("Notification marked as read")
        if (notification.clickable_url) {
          window.open(notification.clickable_url, "_blank")
        }
      } else {
        toast.error("Failed to mark notification as read")
        if(notification.clickable_url) {
          window.open(notification.clickable_url, "_blank")
        }
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
      toast.error("Failed to mark notification as read")
    } finally {
      setIsLoading(false)
    }
  }

   // clear notification 
  const clearNotifications = async () => {
    if (isLoading) return
    setIsLoading(true)

    try {
      const response = await fetchData("notification/index.php?action=mark-all-as-read", "POST")

      if (response.status === 200) {
        setNotifications([]) 
      }
    } catch (error) {
      console.error("Error clearing notifications:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const renderNotificationItem = (notification: Notification) => (
    <DropdownMenu.Item
      key={notification.id}
      className="text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2 py-2 outline-none cursor-pointer"
      onClick={() => handleNotificationClick(notification)}
    >
      <div className="flex flex-col gap-1">
        <span className="font-medium">{notification.title}</span>
        <span className="text-gray-600 dark:text-gray-400">{notification.message}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(notification.created_at)}</span>
      </div>
    </DropdownMenu.Item>
  )

  return (
    <header className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-rose-600 dark:text-rose-400">NotesApp</h2>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-200 transition duration-300"
            >
              {item.label}
            </Link>
          ))}

          {/* Notifications Dropdown */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                className="p-2 text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-200 transition duration-300 relative"
                disabled={isLoading}
              >
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
                <span className="sr-only">Notifications</span>
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="min-w-[300px] max-w-[300px] max-h-[400px] overflow-y-auto bg-white dark:bg-zinc-800 rounded-md p-1 shadow-md"
                onOpenAutoFocus={(e) => e.preventDefault()}
                sideOffset={5}
              >
                {notifications.length === 0 ? (
                  <DropdownMenu.Item className="text-sm text-gray-700 dark:text-gray-200 px-2 py-1">
                    No new notifications
                  </DropdownMenu.Item>
                ) : (
                  notifications.map(renderNotificationItem)
                )}
                <div className="flex justify-between items-center mt-2">
                <DropdownMenu.Item className="text-sm text-center text-rose-600 dark:text-rose-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2 py-1 outline-none cursor-default">
                  <Link href="/notifications" className="block w-full">
                    View all notifications
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item className="text-sm text-center text-rose-600 dark:text-rose-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2 py-1 outline-none cursor-pointer" onClick={clearNotifications}>Clear all notification</DropdownMenu.Item>
              </div>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center">
          {/* Notifications Dropdown for Mobile */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                className="p-2 mr-2 text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-200 transition duration-300 relative"
                disabled={isLoading}
              >
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
                <span className="sr-only">Notifications</span>
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="min-w-[300px] max-w-[300px] max-h-[400px] overflow-y-auto bg-white dark:bg-zinc-800 rounded-md p-1 shadow-md"
                onOpenAutoFocus={(e) => e.preventDefault()}
                sideOffset={5}
                align="end"
              >
                {notifications.length === 0 ? (
                  <DropdownMenu.Item className="text-sm text-gray-700 dark:text-gray-200 px-2 py-1">
                    No new notifications
                  </DropdownMenu.Item>
                ) : (
                  notifications.map(renderNotificationItem)
                )}
                <div className="flex justify-between items-center mt-2">
                <DropdownMenu.Item className="text-sm text-center text-rose-600 dark:text-rose-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2 py-1 outline-none cursor-default">
                  <Link href="/notifications" className="block w-full">
                    View all notifications
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item className="text-sm text-center text-rose-600 dark:text-rose-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2 py-1 outline-none cursor-pointer" onClick={clearNotifications}>Clear all notification</DropdownMenu.Item>
              </div>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-200 transition duration-300"
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <nav className="md:hidden mt-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block py-2 text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-200 transition duration-300"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}

      <Toaster richColors position="top-center" />
    </header>
  )
}

