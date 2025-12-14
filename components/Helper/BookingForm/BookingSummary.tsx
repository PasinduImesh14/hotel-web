"use client";

import React from "react";
import { format } from "date-fns";
import { HotelDetails } from "@/data/hotelInfo";
import { vehicleData } from "@/data/vehical";

interface HotelRoom {
  id: number;
  name: string;
  beds?: string;
  features: string[];
  price: string;
  image: string[];
}

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface VehicleBooking {
  type: number | string; // vehicle id reference (from form it could be string)
  quantity: number;
  range: {
    startDate: Date | string;
    endDate: Date | string;
    key: string;
  };
}

interface BookingSummaryProps {
  selectedRoom?: HotelRoom;
  roomSelection: DateRange;
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    country: string;
    phone: string;
    bookingFor: string;
    vehicleNeeded?: string;
    vehicles?: VehicleBooking[];
  };
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  selectedRoom,
  roomSelection,
  formData,
}) => {
  // ===== Room Cost Calculation =====
  const totalDays =
    roomSelection.startDate && roomSelection.endDate
      ? Math.max(
          0,
          Math.ceil(
            (roomSelection.endDate.getTime() -
              roomSelection.startDate.getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;

  const roomCost =
    selectedRoom && totalDays > 0
      ? Number(selectedRoom.price) * totalDays
      : 0;

  // ===== Vehicle Cost Calculation =====
  let vehicleTotal = 0;

  if (formData.vehicleNeeded === "yes" && formData.vehicles?.length) {
    vehicleTotal = formData.vehicles.reduce((sum, v) => {
      const vehicleInfo = vehicleData.find(
        (item) => item.id === Number(v.type)
      );
      if (!vehicleInfo) return sum;

      const start = new Date(v.range.startDate);
      const end = new Date(v.range.endDate);

      const days = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );

      const cost = days > 0 ? Number(vehicleInfo.price) * v.quantity * days : 0;

      return sum + cost;
    }, 0);
  }

  const grandTotal = roomCost + vehicleTotal;

  return (
    <div className="h-full bg-green-900 text-white p-4 sm:p-6 lg:rounded-l-3xl shadow-2xl overflow-y-auto flex flex-col gap-6">
      {/* ===== Hotel Info Section ===== */}
      <div className="space-y-3 border-b border-green-700 pb-4">
        <img
          src={HotelDetails.image}
          alt={HotelDetails.name}
          className="w-full h-36 sm:h-44 md:h-52 object-cover rounded-xl shadow-lg"
        />
        <h1 className="text-2xl sm:text-3xl font-bold text-green-300">
          {HotelDetails.name}
        </h1>
        <p className="text-xs sm:text-sm text-green-400 leading-relaxed">
          {HotelDetails.description}
        </p>
        <p className="text-sm font-medium mt-1">📞 {HotelDetails.contact}</p>
        <p className="text-xs sm:text-sm text-green-400">📍 {HotelDetails.address}</p>
        {HotelDetails.whatsapp && (
          <p className="text-xs sm:text-sm mt-1">WhatsApp: {HotelDetails.whatsapp}</p>
        )}
      </div>

      {/* ===== Booking Details ===== */}
      <div className="space-y-4 border-b border-green-700 pb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-green-300 border-b border-green-700 pb-1">
          Booking Details
        </h2>

        {/* Guest Info */}
        <div className="space-y-1 sm:space-y-2">
          <h3 className="text-green-200 font-medium">Guest Information</h3>
          <p className="text-xs sm:text-sm">
            Name:{" "}
            <span className="font-medium text-green-100">
              {formData.firstName} {formData.lastName}
            </span>
          </p>
          <p className="text-xs sm:text-sm">
            Email: <span className="font-medium text-green-100">{formData.email}</span>
          </p>
          <p className="text-xs sm:text-sm">
            Country: <span className="font-medium text-green-100">{formData.country}</span>
          </p>
          <p className="text-xs sm:text-sm">
            Phone: <span className="font-medium text-green-100">{formData.phone}</span>
          </p>
          <p className="text-xs sm:text-sm">
            Booking For: <span className="font-medium text-green-100">{formData.bookingFor}</span>
          </p>
        </div>

        {/* Selected Room */}
        {selectedRoom && (
          <div className="space-y-2 mt-3">
            <h3 className="text-green-200 font-medium">Selected Room</h3>
            <img
              src={selectedRoom.image[0]}
              alt={selectedRoom.name}
              className="w-full h-32 sm:h-40 md:h-48 object-cover rounded-lg shadow-md"
            />
            <p className="text-base sm:text-lg font-bold text-green-200 mt-1">
              {selectedRoom.name}
            </p>
            {selectedRoom.beds && (
              <p className="text-xs sm:text-sm text-green-200">{selectedRoom.beds}</p>
            )}
            <ul className="list-disc ml-5 text-xs sm:text-sm text-green-200">
              {selectedRoom.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>

            <p className="text-xs sm:text-sm mt-1">
              Check-in: {roomSelection.startDate ? format(roomSelection.startDate, "dd MMM yyyy") : "TBD"}
            </p>
            <p className="text-xs sm:text-sm">
              Check-out: {roomSelection.endDate ? format(roomSelection.endDate, "dd MMM yyyy") : "TBD"}
            </p>
          </div>
        )}
      </div>

      {/* ===== Pricing Summary ===== */}
      {selectedRoom && (
        <div className="space-y-2">
          <h2 className="text-lg sm:text-xl font-semibold text-green-300 border-b border-green-700 pb-1">
            Pricing Summary
          </h2>

          <p className="text-xs sm:text-sm">
            Room Rate per Night:{" "}
            <span className="font-medium text-green-100">${selectedRoom.price}</span>
          </p>
          <p className="text-xs sm:text-sm">
            Total Nights: <span className="font-medium text-green-100">{totalDays}</span>
          </p>

          <p className="text-md sm:text-lg font-bold">
            Room Cost: <span className="text-green-300">${roomCost}</span>
          </p>

          {/* Vehicle Cost Breakdown */}
          {formData.vehicleNeeded === "yes" && formData.vehicles?.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="text-green-200 font-medium">Vehicle Rentals</h3>

              {formData.vehicles.map((v, i) => {
                const info = vehicleData.find((item) => item.id === Number(v.type));
                if (!info) return null;

                const start = new Date(v.range.startDate);
                const end = new Date(v.range.endDate);

                const days = Math.ceil(
                  (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
                );
                const cost = days > 0 ? Number(info.price) * v.quantity * days : 0;

                return (
                  <div key={i} className="border border-green-700 p-2 rounded-lg text-xs sm:text-sm">
                    <p className="font-medium">{info.type}</p>
                    <p>Quantity: {v.quantity}</p>
                    <p>Rate: ${info.price}/day</p>
                    <p>
                      From: {format(start, "dd MMM")} → To: {format(end, "dd MMM")}
                    </p>
                    <p className="font-bold text-green-300">Subtotal: ${cost}</p>
                  </div>
                );
              })}

              <p className="text-md sm:text-lg font-bold">
                Vehicle Cost: <span className="text-green-300">${vehicleTotal}</span>
              </p>
            </div>
          )}

          {/* Grand Total */}
          <p className="text-xl sm:text-2xl font-bold mt-3">
            Grand Total: <span className="text-green-400">${grandTotal}</span>
          </p>
        </div>
      )}

      {!selectedRoom && (
        <p className="text-green-400 italic text-xs sm:text-sm mt-3">
          Select a room and dates to see the summary.
        </p>
      )}
    </div>
  );
};

export default BookingSummary;
