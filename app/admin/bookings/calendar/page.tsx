"use client";

import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput } from "@fullcalendar/core";
import Sidebar from "../../dashboard/Sidebar";

interface Booking {
  id: number;
  room: { id: number; name: string };
  customer: { id: number; name: string };
  checkIn: string;
  checkOut: string;
}

export default function BookingCalendarPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [events, setEvents] = useState<EventInput[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch bookings");

      setBookings(data.bookings);

      // Count bookings per date
      const dateCount: Record<string, number> = {};
      data.bookings.forEach((b: Booking) => {
        const start = new Date(b.checkIn);
        const end = new Date(b.checkOut);
        const curr = new Date(start);
        while (curr <= end) {
          const key = curr.toISOString().split("T")[0]; // YYYY-MM-DD
          dateCount[key] = (dateCount[key] || 0) + 1;
          curr.setDate(curr.getDate() + 1);
        }
      });

      // Map bookings to events with color based on booking count
      const calendarEvents: EventInput[] = data.bookings.map((b: Booking) => {
        const start = new Date(b.checkIn);
        const end = new Date(b.checkOut);

        // Determine intensity based on max count in the range
        let maxCount = 0;
        const temp = new Date(start);
        while (temp <= end) {
          const key = temp.toISOString().split("T")[0];
          if (dateCount[key] > maxCount) maxCount = dateCount[key];
          temp.setDate(temp.getDate() + 1);
        }

        // Color: more bookings = darker color
        const colorIntensity = Math.min(255, 50 + maxCount * 40);
        const color = `rgb(255, ${255 - colorIntensity}, ${255 - colorIntensity})`;

        return {
          id: String(b.id),
          title: `${b.customer.name} - ${b.room.name}`,
          start: b.checkIn,
          end: b.checkOut,
          backgroundColor: color,
          borderColor: color,
        };
      });

      setEvents(calendarEvents);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) return <p className="p-6">Loading calendar...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 flex-1">
        <h1 className="text-3xl font-bold mb-6">Booking Calendar</h1>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          height="auto"
        />
      </div>
    </div>
  );
}
