"use client";

import { Suspense } from "react";
import BookingPage from '@/components/Helper/BookingForm/BookingPage'

export default function Booking() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Suspense fallback={<div>Loading booking...</div>}>
        <BookingPage />
      </Suspense>
    </div>
  );
}