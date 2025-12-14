"use client";

import { useEffect, ChangeEvent, FormEvent, useState } from "react";
import { DateRange, Range } from "react-date-range";
import { format } from "date-fns";
import { getNames } from "country-list";
import PhoneInput from "react-phone-input-2";
import { roomsData } from "@/data/rooms";
import { bookedDates } from "@/data/bookedDates";

interface HotelRoom {
  id: number;
  image: string[];
  name: string;
  location: string;
  rating: number;
  reviews: string;
  price: string;
  beds?: string;
  features: string[];
  capacity: number;
}

interface Vehicle {
  type: string;
  quantity: number;
  range: Range;
  key?: string;
}

interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  phone: string;
  bookingFor: string;
  workTravel: string;
  room: string;
  vehicleNeeded: string;
  vehicles: Vehicle[];
  arrivalTime: string;
  specialRequest: string;
}

interface BookingFormProps {
  formData: BookingFormData;
  setFormData: React.Dispatch<React.SetStateAction<BookingFormData>>;
  roomSelection: Range;
  setRoomSelection: React.Dispatch<React.SetStateAction<Range>>;
}

export default function BookingForm({
  formData,
  setFormData,
  roomSelection,
  setRoomSelection,
}: BookingFormProps) {
  const [autoCountry, setAutoCountry] = useState<string>("lk");
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);

  // Auto-detect country
  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        if (data.country_code && data.country_name) {
          setAutoCountry(data.country_code.toLowerCase());
          setFormData((prev) => ({ ...prev, country: data.country_name }));
        }
      })
      .catch((err) => console.error("Country detection failed:", err));
  }, [setFormData]);

  // Update disabled room dates
  useEffect(() => {
    if (!formData.room) {
      setDisabledDates([]);
      setRoomSelection({ startDate: new Date(), endDate: new Date(), key: "room" });
      return;
    }

    const roomId = Number(formData.room);
    const dates: Date[] = [];

    bookedDates
      .filter((b: any) => b.roomId === roomId)
      .forEach((range: any) => {
        const current = new Date(range.start);
        const end = new Date(range.end);
        while (current <= end) {
          dates.push(new Date(current));
          current.setDate(current.getDate() + 1);
        }
      });

    setDisabledDates(dates);
    setRoomSelection({ startDate: new Date(), endDate: new Date(), key: "room" });
  }, [formData.room, setRoomSelection]);

  const countries = getNames();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.room) {
      alert("Please select a room first!");
      return;
    }

    const roomId = Number(formData.room);

    const overlappingBooking = bookedDates.some((b: any) => {
      if (b.roomId !== roomId) return false;
      const start = b.start;
      const end = b.end;
      return (
        (roomSelection.startDate! >= start && roomSelection.startDate! <= end) ||
        (roomSelection.endDate! >= start && roomSelection.endDate! <= end) ||
        (roomSelection.startDate! <= start && roomSelection.endDate! >= end)
      );
    });

    if (overlappingBooking) {
      alert("Selected room dates are already booked. Please choose different dates.");
      return;
    }

    const payload = {
      ...formData,
      checkIn: roomSelection.startDate ? format(roomSelection.startDate, "yyyy-MM-dd") : "",
      checkOut: roomSelection.endDate ? format(roomSelection.endDate, "yyyy-MM-dd") : "",
      vehicles:
        formData.vehicleNeeded === "yes"
          ? formData.vehicles.map((v) => ({
              type: v.type,
              quantity: v.quantity,
              startDate: v.range.startDate ? format(v.range.startDate, "yyyy-MM-dd") : "",
              endDate: v.range.endDate ? format(v.range.endDate, "yyyy-MM-dd") : "",
            }))
          : [],
    };

    console.log("Booking submitted:", payload);
    alert("Booking submitted!");

    // Add booking to in-memory array
    (bookedDates as any).push({
      roomId,
      start: roomSelection.startDate!,
      end: roomSelection.endDate!,
    });

    // Reset form (keep country)
    setFormData((prev) => ({
      ...prev,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      bookingFor: "",
      workTravel: "",
      room: "",
      vehicleNeeded: "",
      vehicles: [],
      arrivalTime: "",
      specialRequest: "",
    }));

    setRoomSelection({ startDate: new Date(), endDate: new Date(), key: "room" });
  };

  const selectedRoom: HotelRoom | undefined = roomsData.find(
    (r) => r.id === Number(formData.room)
  );

  const bookedRanges: Range[] = selectedRoom
    ? bookedDates
        .filter((b: any) => b.roomId === selectedRoom.id)
        .map((b: any) => ({
          startDate: b.start,
          endDate: b.end,
          key: `booked-${b.roomId}-${b.start}-${b.end}`,
          color: "#dc2626",
          disabled: true,
        }))
    : [];

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white w-full shadow-2xl rounded-3xl p-8 space-y-6"
    >
      <h2 className="text-4xl font-extrabold text-green-700 text-center mb-6">
        Book Your Stay
      </h2>

      {/* Name Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          className="p-4 rounded-xl border border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          className="p-4 rounded-xl border border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
          required
        />
      </div>

      {/* Email */}
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="p-4 w-full rounded-xl border border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
        required
      />

      {/* Country */}
      <select
        name="country"
        value={formData.country}
        onChange={handleChange}
        className="p-4 w-full rounded-xl border border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
        required
      >
        <option value="">Select Country</option>
        {countries.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* Phone */}
      <PhoneInput
        country={autoCountry}
        value={formData.phone}
        onChange={(value) => setFormData((prev) => ({ ...prev, phone: value }))}
        inputClass="w-full rounded-xl border border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition px-4 py-3"
      />

      {/* Room Selection */}
      <select
        name="room"
        value={formData.room}
        onChange={handleChange}
        className="w-full p-4 rounded-xl border border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
        required
      >
        <option value="">Select Room</option>
        {roomsData.map((room) => (
          <option key={room.id} value={room.id}>
            {room.name}
          </option>
        ))}
      </select>

      {/* Room Details */}
      {selectedRoom && (
        <div className="p-4 bg-green-100 rounded-2xl space-y-2 shadow-inner">
          <p className="font-bold text-lg text-green-800">{selectedRoom.name}</p>
          {selectedRoom.beds && <p className="text-green-700">{selectedRoom.beds}</p>}
          <ul className="list-disc ml-6 text-green-700">
            {selectedRoom.features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Room Date Picker */}
      {selectedRoom && (
        <div className="border border-green-300 rounded-2xl p-3 shadow-inner">
          <h3>Select Booking dates</h3>
          <DateRange
            key={formData.room}
            ranges={[{ ...roomSelection, key: "selection" }, ...bookedRanges]}
            onChange={(item: any) =>
              setRoomSelection(item.selection || roomSelection)
            }
            minDate={new Date()}
            moveRangeOnFirstSelection={false}
            editableDateInputs={true}
            disabledDates={disabledDates}
          />
        </div>
      )}

      {/* Booking For */}
      <select
        name="bookingFor"
        value={formData.bookingFor}
        onChange={handleChange}
        className="w-full p-4 rounded-xl border border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
        required
      >
        <option value="">Who are you booking for?</option>
        <option value="myself">Myself</option>
        <option value="someone">Someone else</option>
      </select>

      {/* Work Travel */}
      <select
        name="workTravel"
        value={formData.workTravel}
        onChange={handleChange}
        className="w-full p-4 rounded-xl border border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
        required
      >
        <option value="">Are you traveling for work?</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>

      {/* Vehicle Selection */}
<select
  name="vehicleNeeded"
  value={formData.vehicleNeeded}
  onChange={(e) =>
    setFormData((prev) => ({
      ...prev,
      vehicleNeeded: e.target.value,
      vehicles: e.target.value === "yes" ? prev.vehicles || [] : [],
    }))
  }
  className="w-full p-4 rounded-xl border border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
>
  <option value="">Need a vehicle?</option>
  <option value="yes">Yes</option>
  <option value="no">No</option>
</select>

{formData.vehicleNeeded === "yes" && (
  <div className="space-y-4">
    {(formData.vehicles || []).map((v, index) => (
      <div
        key={v.key || index}
        className="space-y-2 border p-3 rounded-2xl shadow-inner"
      >
        <div className="flex gap-2 items-center">
          <select
            name="vehicleType"
            value={v.type}
            onChange={(e) => {
              const newVehicles = [...formData.vehicles];
              newVehicles[index].type = e.target.value;
              setFormData((prev) => ({ ...prev, vehicles: newVehicles }));
            }}
            className="w-full p-3 rounded-xl border border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
          >
            <option value="">Select Vehicle Type</option>
            <option value="car">Car</option>
            <option value="three_wheel">Three Wheel</option>
            <option value="safari">Safari</option>
            <option value="bike">Bike</option>
          </select>

          <input
            type="number"
            min={1}
            placeholder="Quantity"
            value={v.quantity}
            onChange={(e) => {
              const newVehicles = [...formData.vehicles];
              newVehicles[index].quantity = Number(e.target.value);
              setFormData((prev) => ({ ...prev, vehicles: newVehicles }));
            }}
            className="w-24 p-3 rounded-xl border border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
          />
        </div>

        {/* FIXED Date Range */}
        <div className="border border-green-300 rounded-2xl p-3 shadow-inner">
          <DateRange
            ranges={[v.range]}
            onChange={(item: any) => {
              const key = Object.keys(item)[0]; // dynamic key
              const newVehicles = [...formData.vehicles];
              newVehicles[index].range = item[key];
              setFormData((prev) => ({ ...prev, vehicles: newVehicles }));
            }}
            minDate={new Date()}
            moveRangeOnFirstSelection={false}
            editableDateInputs={true}
          />
        </div>

        <button
          type="button"
          className="text-red-500 text-sm underline mt-1"
          onClick={() => {
            const newVehicles = formData.vehicles.filter((_, i) => i !== index);
            setFormData((prev) => ({ ...prev, vehicles: newVehicles }));
          }}
        >
          Remove Vehicle
        </button>
      </div>
    ))}

    <button
      type="button"
      className="w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
      onClick={() => {
        const uniqueKey = `vehicle-${Date.now()}`;
        setFormData((prev) => ({
          ...prev,
          vehicles: [
            ...(prev.vehicles || []),
            {
              type: "",
              quantity: 1,
              range: {
                startDate: new Date(),
                endDate: new Date(),
                key: uniqueKey,
              },
              key: uniqueKey,
            },
          ],
        }));
      }}
    >
      Add Vehicle
    </button>
  </div>
)}

      {/* Arrival Time */}
      <select
        name="arrivalTime"
        value={formData.arrivalTime}
        onChange={handleChange}
        className="w-full p-4 rounded-xl border border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
      >
        <option value="">Arrival Time</option>
        <option value="morning">Morning (8 AM - 12 PM)</option>
        <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
        <option value="evening">Evening (4 PM - 8 PM)</option>
      </select>

      {/* Special Request */}
      <textarea
        name="specialRequest"
        value={formData.specialRequest}
        placeholder="Special requests (optional)"
        onChange={handleChange}
        className="w-full p-4 rounded-xl border border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
      />

      <button
        type="submit"
        className="w-full py-5 bg-green-600 text-white text-lg font-bold rounded-2xl hover:bg-green-700 transition"
      >
        Complete Booking
      </button>
    </form>
  );
}
