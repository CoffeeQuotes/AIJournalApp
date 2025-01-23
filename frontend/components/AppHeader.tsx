import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-rose-600">NotesApp</h2>
        <nav>
          <Link href="/journal" className="text-rose-600 hover:text-rose-800 mr-4">
            Journal
          </Link>
          <Link
            href="/analysis"
            className="text-rose-600 hover:text-rose-800 mr-4"
          >
            Analysis
          </Link>
          <Link
            href="/prompts"
            className="text-rose-600 hover:text-rose-800 mr-4"
          >
            Prompts
          </Link>
          <Link
            href="/settings"
            className="text-rose-600 hover:text-rose-800 mr-4"
          >
            Settings
          </Link>
          
        </nav>
      </header>
  );
}
