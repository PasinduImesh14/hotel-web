// context/RoomContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { BackendRoom } from "@/types/BackendRoom";

interface RoomContextType {
  rooms: BackendRoom[];
  isLoading: boolean;
  error: string | null;
  refreshRooms: () => Promise<void>; // Function to manually refetch if needed
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider = ({ children }: { children: ReactNode }) => {
  const [rooms, setRooms] = useState<BackendRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/rooms");
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to fetch rooms");
      
      setRooms(data.rooms);
      setHasFetched(true);
      setError(null);
    } catch (err: any) {
      console.error("Context fetch error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if we haven't fetched yet!
    if (!hasFetched) {
      fetchRooms();
    }
  }, [hasFetched]);

  return (
    <RoomContext.Provider value={{ rooms, isLoading, error, refreshRooms: fetchRooms }}>
      {children}
    </RoomContext.Provider>
  );
};

// Custom hook for easy usage
export const useRooms = () => {
  const context = useContext(RoomContext);
  if (context === undefined) {
    throw new Error("useRooms must be used within a RoomProvider");
  }
  return context;
};