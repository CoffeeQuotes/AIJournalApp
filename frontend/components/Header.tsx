import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-blue-600 text-white py-4">
      <nav className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">NotesApp</h1>
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link href="/login" className="hover:underline">
              Login
            </Link>
          </li>
          <li>
            <Link href="/register" className="hover:underline">
              Register
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
