import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-rose-600">NotesApp</h2>
        <nav>
          <Link href="/login" className="text-rose-600 hover:text-rose-800 mr-4">
            Login
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 bg-rose-200 text-rose-700 rounded-lg hover:bg-rose-300 transition duration-300"
          >
            Register
          </Link>
        </nav>
      </header>
  );
}
