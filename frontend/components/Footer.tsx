import Link from 'next/link';
import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-zinc-100 dark:bg-zinc-900 text-rose-800 dark:text-rose-200 py-8">
    <div className="container mx-auto px-4 text-center">
      <p>© {new Date().getFullYear()} NotesApp. All rights reserved.</p>
      <div className="mt-4">
        <Link
          href="/privacy"
          className="hover:underline mr-4 text-rose-700 dark:text-rose-300 hover:text-rose-900 dark:hover:text-rose-100"
        >
          Privacy Policy
        </Link>
        <Link
          href="/terms"
          className="hover:underline text-rose-700 dark:text-rose-300 hover:text-rose-900 dark:hover:text-rose-100"
        >
          Terms of Service
        </Link>
      </div>
    </div>
  </footer>
  );
}
