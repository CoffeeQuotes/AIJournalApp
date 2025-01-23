import Link from 'next/link';
import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-rose-100 text-rose-800 py-8">
    <div className="container mx-auto px-4 text-center">
      <p>© {new Date().getFullYear()} NotesApp. All rights reserved.</p>
      <div className="mt-4">
        <Link href="/privacy" className="hover:underline mr-4">
          Privacy Policy
        </Link>
        <Link href="/terms" className="hover:underline">
          Terms of Service
        </Link>
      </div>
    </div>
  </footer>
  );
}
