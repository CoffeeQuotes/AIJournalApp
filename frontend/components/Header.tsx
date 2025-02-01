import React from "react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-10 border-b border-gray-950/5 dark:border-white/10 mx-auto px-4 py-6 flex justify-between items-center backdrop-blur-sm">
      <Link
          href="/">
      <h2 className="text-2xl font-bold text-rose-600 dark:text-rose-400">
        NotesApp
      </h2>
      </Link>
      <nav>
        <Link
          href="/login"
          className="text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-200 mr-4"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="px-4 py-2 bg-rose-200 dark:bg-rose-700 text-rose-700 dark:text-rose-200 rounded-lg hover:bg-rose-300 dark:hover:bg-rose-600 transition duration-300"
        >
          Register
        </Link>
      </nav>
    </header>
  );
}
