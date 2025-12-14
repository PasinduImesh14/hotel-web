// components/Rooms/RoomList.tsx

"use client";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import RoomCard from "./RoomCard";
import CustomAlert from "@/components/Common/CustomAlert"; // Adjust path if needed
import { BackendRoom } from "@/types/BackendRoom";
import { useRooms } from "@/app/context/RoomContext"; // <--- IMPORT CONTEXT

// Main Component wrapped in Suspense for useSearchParams safety in Next.js
export default function RoomList() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
      <RoomListContent />
    </Suspense>
  );
}

function RoomListContent() {
  const searchParams = useSearchParams();
  
  // --- USE CONTEXT ---
  const { rooms: contextRooms, isLoading: contextLoading } = useRooms();

  // --- STATE ---
  const [allRooms, setAllRooms] = useState<BackendRoom[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<BackendRoom[]>([]);
  
  // Loaders
  // We initialize based on whether context is already loaded
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  // Filter Inputs
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  // Alert State
  const [alert, setAlert] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "warning" | "info";
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  // --- ALERTS ---
  const showAlert = (
    title: string,
    message: string,
    type: "success" | "error" | "warning" | "info" = "info"
  ) => {
    setAlert({ isOpen: true, title, message, type });
  };

  const closeAlert = () => {
    setAlert({ ...alert, isOpen: false });
  };

  // --- STEP 1: SYNC WITH CONTEXT (REPLACED FETCH) ---
  useEffect(() => {
    // If context is still loading, wait.
    if (contextLoading) return;

    // Once context has data (or empty array), update local state
    setAllRooms(contextRooms);
    setFilteredRooms(contextRooms);
    setIsInitialLoading(false);
  }, [contextRooms, contextLoading]);

  // --- STEP 2: AVAILABILITY LOGIC ---
  const handleCheckAvailability = useCallback(async (cIn?: string, cOut?: string) => {
    // Determine which dates to use (args > state)
    const start = cIn || checkIn;
    const end = cOut || checkOut;

    // 1. Validation
    if (!start || !end) {
      setFilteredRooms(allRooms); // Reset if dates cleared
      return;
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (startDate >= endDate) {
      showAlert("Invalid Dates", "Check-out date must be after check-in date", "warning");
      return;
    }

    if (startDate < new Date(new Date().setHours(0, 0, 0, 0))) {
      showAlert("Invalid Dates", "Check-in date cannot be in the past", "warning");
      return;
    }

    setIsSearching(true);

    try {
      // 2. Fetch Existing Bookings
      // We assume /api/bookings/all returns all bookings from 'start' date onwards
      const response = await fetch(`/api/bookings/all?from=${start}`);
      const data = await response.json();

      if (response.ok) {
        const { bookingsByRoom } = data; // Expected Format: { [roomId]: [{checkIn, checkOut}, ...] }

        // 3. Filter Logic
        const availableRooms = allRooms.filter((room) => {
          const roomBookings = bookingsByRoom[room.id] || [];
          
          // Check overlap for every booking on this room
          for (const booking of roomBookings) {
            const bookedStart = new Date(booking.checkIn);
            const bookedEnd = new Date(booking.checkOut);

            // Overlap Formula: (StartA < EndB) and (EndA > StartB)
            if (startDate < bookedEnd && endDate > bookedStart) {
              return false; // Collision found, room is occupied
            }
          }
          return true; // No collisions
        });

        setFilteredRooms(availableRooms);
        
        if (availableRooms.length === 0) {
            showAlert("No Availability", "All rooms are booked for these dates. Please try different dates.", "info");
        }

      } else {
        console.error("Error fetching bookings:", data.error);
        showAlert("Error", "Failed to verify availability.", "error");
      }
    } catch (error) {
      console.error("Error checking availability:", error);
      showAlert("Error", "Network error while checking availability.", "error");
    } finally {
      setIsSearching(false);
    }
  }, [allRooms, checkIn, checkOut]); // Dependency on allRooms is crucial

  // --- STEP 3: URL PARAMS SYNC ---
  // Runs only after rooms are loaded to ensure we can actually filter them
  useEffect(() => {
    if (isInitialLoading || allRooms.length === 0) return;

    const paramCheckIn = searchParams.get("checkIn");
    const paramCheckOut = searchParams.get("checkOut");

    if (paramCheckIn && paramCheckOut) {
      setCheckIn(paramCheckIn);
      setCheckOut(paramCheckOut);
      // Trigger search immediately with URL params
      handleCheckAvailability(paramCheckIn, paramCheckOut);
    }
  }, [isInitialLoading, allRooms, searchParams, handleCheckAvailability]);


  // --- RENDER ---
  if (isInitialLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">Finding the perfect room...</p>
      </div>
    );
  }

  // NOTE: I commented this out because 'contextRooms' might be empty initially 
  // and we don't want to show "No rooms found" while context is still fetching in background.
  // The 'isInitialLoading' check above handles the wait.
  if (!allRooms || allRooms.length === 0) {
    return (
      <div className="text-center py-32 text-xl font-semibold text-gray-500">
        No rooms found in the system.
      </div>
    );
  }

  return (
    <section className="bg-gray-50 py-24 lg:py-32">
      <div className="w-[90%] md:w-[85%] xl:w-[75%] mx-auto flex flex-col gap-16 md:gap-24">
        
        {/* --- Header --- */}
        <div className="text-center">
          <p className="text-green-600 font-bold uppercase tracking-widest text-sm mb-3">
            Handpicked Comfort
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 mb-6">
            Our Suites & Rooms
          </h2>
          <div className="w-24 h-1 bg-green-500 mx-auto rounded-full"></div>
        </div>

        {/* --- Search / Filter Bar --- */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col lg:flex-row items-end lg:items-center justify-between gap-6 w-full max-w-5xl mx-auto -mt-4 relative z-10">
          
          {/* Check In Input */}
          <div className="w-full">
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Check In
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors bg-gray-50 hover:bg-white cursor-pointer"
            />
          </div>

          {/* Check Out Input */}
          <div className="w-full">
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Check Out
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors bg-gray-50 hover:bg-white cursor-pointer"
            />
          </div>

          {/* Search Button */}
          <div className="w-full lg:w-auto">
            <label className="block text-sm font-bold text-transparent mb-2 select-none hidden lg:block">
              Search
            </label>
            <button
              onClick={() => handleCheckAvailability()}
              disabled={isSearching}
              className="w-full lg:w-auto bg-green-600 text-white font-semibold py-3.5 px-8 rounded-lg shadow-md hover:bg-green-700 hover:shadow-lg transition-all duration-300 whitespace-nowrap flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSearching ? "Checking..." : "Check Availability"}
              {!isSearching && (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* --- Room Grid --- */}
        <div className="flex flex-col gap-20 md:gap-28 mt-4">
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room, index) => (
              <RoomCard
                key={room.id}
                room={room}
                index={index}
                checkIn={checkIn}
                checkOut={checkOut}
              />
            ))
          ) : (
            <div className="text-center py-16 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-2xl font-serif text-gray-800 mb-2">No rooms available</p>
              <p className="text-sm text-gray-500">
                All rooms are booked for the selected dates. <br/> Please try different dates or clear the search.
              </p>
              <button 
                onClick={() => {
                    setCheckIn("");
                    setCheckOut("");
                    setFilteredRooms(allRooms);
                }}
                className="mt-6 text-green-600 font-semibold hover:underline"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- Custom Alert Modal --- */}
      <CustomAlert
        isOpen={alert.isOpen}
        onClose={closeAlert}
        title={alert.title}
        message={alert.message}
        type={alert.type}
      />
    </section>
  );
}