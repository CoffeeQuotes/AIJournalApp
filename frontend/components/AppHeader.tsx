import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="container mx-auto px-4 py-6 flex justify-between items-center">
      <h2 className="text-2xl font-bold text-rose-600 dark:text-rose-400">NotesApp</h2>
      <nav className="flex items-center space-x-4">
        <Link
          href="/dashboard"
          className="text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-200 transition duration-300"
        >
          Dashboard
        </Link>
        <Link
          href="/journal"
          className="text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-200 transition duration-300"
        >
          Journal
        </Link>
        <Link
          href="/analysis"
          className="text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-200 transition duration-300"
        >
          Analysis
        </Link>
        <Link
          href="/prompts"
          className="text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-200 transition duration-300"
        >
          Prompts
        </Link>
        <Link
          href="/settings"
          className="text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-200 transition duration-300"
        >
          Settings
        </Link>
      </nav>
    </header>
  );
}
