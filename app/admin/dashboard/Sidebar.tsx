"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [showRooms, setShowRooms] = useState(true);
  const [showBookings, setShowBookings] = useState(true);

  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>

      {/* Dashboard */}
      <Link
        href="/admin/dashboard"
        className={`p-2 rounded hover:bg-gray-700 ${
          pathname === "/admin/dashboard" ? "bg-gray-700" : ""
        }`}
      >
        Dashboard
      </Link>

      {/* Rooms Section */}
      <div className="mt-4">
        <button
          onClick={() => setShowRooms(!showRooms)}
          className="w-full text-left p-2 rounded hover:bg-gray-700 font-semibold"
        >
          Rooms
        </button>
        {showRooms && (
          <div className="flex flex-col ml-4 mt-2 gap-1">
            <Link
              href="/admin/rooms/add"
              className={`p-2 rounded hover:bg-gray-700 ${
                pathname === "/admin/rooms/add" ? "bg-gray-700" : ""
              }`}
            >
              Add New Room
            </Link>
            <Link
              href="/admin/rooms/view"
              className={`p-2 rounded hover:bg-gray-700 ${
                pathname === "/admin/rooms" ? "bg-gray-700" : ""
              }`}
            >
              View Rooms
            </Link>
          </div>
        )}
      </div>

      {/* Bookings Section */}
      <div className="mt-4">
        <button
          onClick={() => setShowBookings(!showBookings)}
          className="w-full text-left p-2 rounded hover:bg-gray-700 font-semibold"
        >
          Bookings
        </button>
        {showBookings && (
          <div className="flex flex-col ml-4 mt-2 gap-1">
            <Link
              href="/admin/bookings"
              className={`p-2 rounded hover:bg-gray-700 ${
                pathname === "/admin/bookings" ? "bg-gray-700" : ""
              }`}
            >
              View Bookings
            </Link>
            {/* Calendar Button */}
            <Link
              href="/admin/bookings/calendar"
              className={`p-2 rounded hover:bg-gray-700 ${
                pathname === "/admin/bookings/calendar" ? "bg-gray-700" : ""
              }`}
            >
              View Calendar
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
