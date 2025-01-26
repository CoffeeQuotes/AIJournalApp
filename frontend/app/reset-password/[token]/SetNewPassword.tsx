"use client";
import type React from "react";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchData } from "@/utils/api"; // Adjust the import path as needed

interface SetNewPasswordProps{
   token: string;
}
export default function SetNewPassword({token}: SetNewPasswordProps) {
 const [password, setPassword] = useState("");
 const [confirmPassword, setConfirmPassword] = useState("");
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [error, setError] = useState("");
 const router = useRouter();

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   setIsSubmitting(true);
   setError("");

   if (password !== confirmPassword) {
     setError("Passwords do not match");
     setIsSubmitting(false);
     return;
   }

   try {
     const data = await fetchData(
       "/authentication/index.php?action=reset-password",
       "POST",
       { token, new_password: password }
     );

     if (data.status === 200) {
       router.push("/login?reset=success");
     } else {
       setError(data.error || "An error occurred. Please try again.");
     }
   } catch (error: any) {
     console.error("Error resetting password:", error);
     setError(error.message || "An error occurred. Please try again.");
   } finally {
     setIsSubmitting(false);
   }
 };

 return (
   <main className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex flex-col">
     <Header />

     <motion.section
       className="flex-grow container mx-auto px-4 py-8 md:py-12"
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.5 }}
     >
       <div className="max-w-md mx-auto">
         <div className="mb-6">
           <Link
             href="/login"
             className="inline-flex items-center text-rose-600 hover:text-rose-800 transition-colors duration-300"
           >
             <ArrowLeft className="w-4 h-4 mr-2" />
             Back to Login
           </Link>
         </div>

         <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
           <h1 className="text-3xl font-bold text-rose-800 mb-6">Set New Password</h1>

           <form onSubmit={handleSubmit} className="space-y-6">
             <div>
               <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                 New Password
               </label>
               <input
                 type="password"
                 id="password"
                 className="w-full p-3 border border-gray-300 text-black placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-200"
                 placeholder="Enter new password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 required
                 minLength={8}
               />
             </div>
             <div>
               <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                 Confirm New Password
               </label>
               <input
                 type="password"
                 id="confirm-password"
                 className="w-full p-3 border border-gray-300 text-black placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-200"
                 placeholder="Confirm new password"
                 value={confirmPassword}
                 onChange={(e) => setConfirmPassword(e.target.value)}
                 required
                 minLength={8}
               />
             </div>
             <div>
               <button
                 type="submit"
                 className="w-full inline-flex justify-center items-center px-4 py-2 bg-rose-200 text-rose-700 rounded-md hover:bg-rose-300 transition duration-300 disabled:opacity-50"
                 disabled={isSubmitting}
               >
                 {isSubmitting ? (
                   "Saving..."
                 ) : (
                   <>
                     <Save className="w-4 h-4 mr-2" />
                     Save New Password
                   </>
                 )}
               </button>
             </div>
           </form>

           {error && <p className="mt-4 text-sm text-center text-red-600">{error}</p>}
         </div>
       </div>
     </motion.section>

     <Footer />
   </main>
 );
}