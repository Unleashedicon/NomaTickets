"use client";
import { useState } from "react";
import "flowbite";
import { Oswald } from "next/font/google";
import { Ticket } from 'lucide-react';

const oswald = Oswald({ weight: ["400", "700"], subsets: ["latin"] });

export default function MyNavbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  return (
    <>
      <nav className={`border-black bg-white dark:bg-black dark:border-white ${oswald.className}`}>
        <div className="max-w-screen-xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
          {/* Logo */}
          <a href="/" className="flex flex-col items-center text-center">
                          <Ticket className="h-8 w-8 text-[#1D4ED8]" />
              <span className="text-xl font-bold text-[#111827]">NomaTickets</span>
          </a>

          {/* Search Bar */}
          <form className="flex-grow flex items-center gap-2">
            <label htmlFor="simple-search" className="sr-only">Search</label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2" />
                </svg>
              </div>
              <input
                type="text"
                id="simple-search"
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm md:text-base rounded-lg ps-10 py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Search event..."
                required
              />
            </div>
            <button
              type="submit"
              className="ml-2 p-2.5 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
              <span className="sr-only">Search</span>
            </button>
          </form>

          {/* Hamburger Menu */}
          <button
            onClick={toggleDrawer}
            type="button"
            aria-controls="drawer-navigation"
            aria-expanded={drawerOpen}
            className="inline-flex items-center justify-center p-2 w-10 h-10 text-sm text-black rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-black dark:text-white dark:hover:bg-gray-700 dark:focus:ring-white"
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Drawer */}
      <div
        id="drawer-navigation"
        className={`fixed top-0 right-0 z-40 w-64 h-screen p-4 overflow-y-auto transition-transform bg-white dark:bg-gray-800 ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
        tabIndex={-1}
        aria-labelledby="drawer-navigation-label"
      >
        <h5 id="drawer-navigation-label" className="text-base font-semibold text-gray-500 uppercase dark:text-gray-400">
          Menu
        </h5>
        <button
          type="button"
          onClick={toggleDrawer}
          aria-controls="drawer-navigation"
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 end-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span className="sr-only">Close menu</span>
        </button>

        <div className="py-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            {["Dashboard", "Services", "Pricing", "Contact"].map((item) => (
              <li key={item}>
                <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
