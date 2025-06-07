"use client";
import { Oswald } from "next/font/google";
import {
  HomeIcon,
  PlusCircleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid"; // Using solid for bold look
import Link from "next/link";

const oswald = Oswald({ weight: ["400", "700"], subsets: ["latin"] });

export default function MyFooter() {
  return (
    <footer className={`fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-300 z-50 ${oswald.className}`}>
      <div className="flex justify-around items-center h-20 px-4 sm:px-8">
        {/* Home Icon */}
        <Link href="/">
        <div className="flex flex-col items-center cursor-pointer">
          <HomeIcon className="h-8 w-8 text-gray-800 font-bold" />
          <span className="text-xs font-extrabold text-gray-800 mt-1">Home</span>
        </div>
        </Link>

        {/* Plus Button */}
        <Link href="/creator">
        <div className="relative flex items-center justify-center -mt-10">
          <div className="absolute h-20 w-20 rounded-full border-4 border-custom-purple animate-pulse-light opacity-70 pointer-events-none"></div>
          <button className="relative z-10 flex items-center justify-center h-16 w-16 rounded-full bg-black cursor-pointer shadow-lg">
            <PlusCircleIcon className="h-10 w-10 text-white" />
          </button>
        </div>
        </Link>
        {/* Profile Icon */}
        <Link href="/profile">

        <div className="flex flex-col items-center cursor-pointer">
          <UserCircleIcon className="h-8 w-8 text-gray-800 font-bold" />
          <span className="text-xs font-extrabold text-gray-800 mt-1">Profile</span>
        </div>
        </Link>

      </div>
    </footer>
  );
}
