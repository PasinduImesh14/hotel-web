
"use client";

import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Select from "react-select";
import { getData } from "country-list";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  User,
  CheckCircle,
  Car,
  BedDouble,
  CreditCard,
  Clock,
  Utensils,
  Map,
  UserCheck,
  MapPin,
  Phone,
  Info,
} from "lucide-react";
import CustomAlert from "@/components/Common/CustomAlert";
import { useRooms } from "@/app/context/RoomContext"; // <--- 1. IMPORT CONTEXT

// --- Types ---
interface BookedSlot {
  checkIn: string;
  checkOut: string;
}

// --- Constants ---
const vehicleOptions = [
  { value: "BIKE", label: "Bike ($15)" },
  { value: "CAR", label: "Car ($45)" },
  { value: "VAN", label: "Van ($65)" },
  { value: "SUV", label: "SUV ($20)" },
];

const vehiclePrices: Record<string, number> = {
  BIKE: 15,
  CAR: 45,
  VAN: 65,
  SUV: 20,
};

const hotelInfo = {
  name: "Scenic Cottage",
  image: "/images/BookingPage/IMG_9964.JPG",
  contact: "+94 74 055 8858",
  address: "Sigiriya Road, Inamaluwa, 21124 Sigiriya, Sri Lanka",
  description: "Experience tranquility and natural beauty at Scenic Cottage.",
  promoText:
    "Escape to a sanctuary where nature hugs luxury. Nestled in the heart of Sigiriya, Scenic Cottage offers you a peaceful retreat away from the chaos.",
};

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"contact" | "booking">("contact");
  const [isExiting, setIsExiting] = useState(false);

  // --- 2. USE CONTEXT INSTEAD OF LOCAL STATE ---
  // Alias isLoading to loadingRooms to match your existing variable naming
  const { rooms, isLoading: loadingRooms } = useRooms();

  // --- Form State ---
  const [formData, setFormData] = useState({
    // Customer
    title: "Mr",
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    contactNumber: "",
    /* address: "",
      */ passportType: "Passport",
    passportNumber: "",

    // Booking
    room: "",
    checkInDate: "",
    checkInTime: "09:00",
    checkOutDate: "",
    checkOutTime: "11:00",

    // Other Details
    vehicleNeeded: false,
    /* vehicleType: "CAR", // Default
    driver: false, */
    meal: false,
    guide: false,
  });

  // Removed local 'rooms' and 'loadingRooms' state (handled by context now)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
  
  const [phoneNumber, setPhoneNumber] = useState("");
  const [detectedCountry, setDetectedCountry] = useState<string>("GB");
  const [alert, setAlert] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "warning" | "info";
    onCloseCallback?: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    onCloseCallback: undefined,
  });

  // --- 3. REMOVED FETCH ROOMS useEffect ---
  // The logic that called /api/rooms is removed because useRooms() provides the data globally.

  useEffect(() => {
    const checkInFromUrl = searchParams.get("checkIn");
    const checkOutFromUrl = searchParams.get("checkOut");
    const roomIdFromUrl = searchParams.get("roomId");

    setFormData((prev) => ({
      ...prev,
      checkInDate: checkInFromUrl || prev.checkInDate,
      checkOutDate: checkOutFromUrl || prev.checkOutDate,
      room: roomIdFromUrl || prev.room,
    }));
  }, [searchParams]);

  // Fetch Availability
  useEffect(() => {
    const fetchBookedDates = async () => {
      if (!formData.room) return;
      try {
        const today = new Date().toISOString().split("T")[0];
        const response = await fetch(
          `/api/bookings/available?roomId=${formData.room}&from=${today}`
        );
        const data = await response.json();

        if (data.bookedSlots) {
          setBookedSlots(data.bookedSlots);
          if (formData.checkInDate && formData.checkOutDate) {
            const isCheckInBooked = data.bookedSlots.some(
              (slot: BookedSlot) =>
                formData.checkInDate >= slot.checkIn &&
                formData.checkInDate <= slot.checkOut
            );
            const isCheckOutBooked = data.bookedSlots.some(
              (slot: BookedSlot) =>
                formData.checkOutDate >= slot.checkIn &&
                formData.checkOutDate <= slot.checkOut
            );

            if (isCheckInBooked || isCheckOutBooked) {
              setFormData((prev) => ({
                ...prev,
                checkInDate: "",
                checkOutDate: "",
              }));
              showAlert(
                "Dates Unavailable",
                "Selected dates are not available for this room.",
                "warning"
              );
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch booked dates:", error);
      }
    };
    fetchBookedDates();
  }, [formData.room, formData.checkInDate, formData.checkOutDate]);

  const isDateBooked = (date: Date) => {
    if (!formData.room) return false;

    // Get local date string properly (avoid timezone issues)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const checkDate = `${year}-${month}-${day}`;

    return bookedSlots.some(
      (slot) => checkDate >= slot.checkIn && checkDate <= slot.checkOut
    );
  };

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        if (data.country_code) {
          setFormData((prev) => ({
            ...prev,
            country: data.country_name || "",
          }));
          setDetectedCountry(data.country_code || "GB");
        }
      })
      .catch((err) => console.error("Could not detect country:", err));
  }, []);

  // --- Calculations ---
  // Note: 'rooms' comes from context now
  const selectedRoom =
    rooms.find((r) => r.id.toString() === formData.room.toString()) || null;

  const calculateDays = () => {
    if (!formData.checkInDate || !formData.checkOutDate) return 0;

    const checkInDateTime = new Date(
      `${formData.checkInDate}T${formData.checkInTime || "09:00"}:00`
    );
    const checkOutDateTime = new Date(
      `${formData.checkOutDate}T${formData.checkOutTime || "11:00"}:00`
    );

    const diffMs = checkOutDateTime.getTime() - checkInDateTime.getTime();

    if (diffMs <= 0) return 0;

    const diffHours = diffMs / (1000 * 60 * 60);

    // Calculate days: every 24 hours = 1 day, round up
    return Math.max(1, Math.ceil(diffHours / 24));
  };

  const days = calculateDays();
  const roomCost = selectedRoom ? days * Number(selectedRoom.cost) : 0;

  // Vehicle Cost
  const vehicleCost = formData.vehicleNeeded
    ? (vehiclePrices["CAR"] || 45) * (days || 1) // Defaulting to CAR price logic if type logic is commented out
    : 0;

  const serviceCharge = (roomCost + vehicleCost) * 0.05;
  const grandTotal = roomCost + vehicleCost + serviceCharge;
  const showAlert = (
    title: string,
    message: string,
    type: "success" | "error" | "warning" | "info" = "info",
    onCloseCallback?: () => void
  ) => {
    setAlert({ isOpen: true, title, message, type, onCloseCallback });
  };

  const closeAlert = () => {
    const callback = alert.onCloseCallback;
    setAlert({ ...alert, isOpen: false, onCloseCallback: undefined });

    // Execute callback after closing if it exists
    if (callback) {
      setTimeout(() => callback(), 300);
    }
  };
  const isContactComplete =
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    formData.country &&
    formData.contactNumber;
  const isBookingComplete =
    formData.room && formData.checkInDate && formData.checkOutDate;

  // --- Handlers ---
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (typeof window !== "undefined" && window.history.length > 1) {
        router.back();
      } else {
        router.push("/");
      }
    }, 600);
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!isContactComplete || !isBookingComplete) {
      showAlert(
        "Incomplete Form",
        "Please complete all required fields before booking.",
        "warning"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Prepare Customer Data
      const customerData = {
        name: `${formData.title} ${formData.firstName} ${formData.lastName}`.trim(),
        passportNumber:
          formData.passportType === "Passport" ? formData.passportNumber : "",
        nicNumber:
          formData.passportType === "NIC" ? formData.passportNumber : "",
        address: formData.country || "N/A",
        contactNumber: formData.contactNumber,
      };

      // 2. Prepare Booking Payload
      const payload: any = {
        customer: customerData,
        customerEmail: formData.email,
        roomId: Number(formData.room),
        checkIn: `${formData.checkInDate}T${
          formData.checkInTime || "09:00"
        }:00.000Z`,
        checkOut: `${formData.checkOutDate}T${
          formData.checkOutTime || "11:00"
        }:00.000Z`,
      };

      // 3. Add Other Details (Matches your Prisma Schema)
      if (formData.vehicleNeeded || formData.meal || formData.guide) {
        payload.otherDetails = {
          vehicleSupport: formData.vehicleNeeded ? "YES" : "NO",
          meal: formData.meal ? "YES" : "NO",
          guide: formData.guide ? "YES" : "NO",
        };
      }

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Booking failed");
      }

      showAlert(
        "Booking Confirmed! 🎉",
        "Your booking has been completed successfully. We look forward to hosting you! A confirmation email has been sent to your provided email address.",
        "success",
        () => router.push("/")
      );
    } catch (error: any) {
      console.error("Booking error:", error);
      showAlert(
        "Booking Failed",
        error.message || "Failed to create booking. Please try again.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const countryOptions = getData().map((country) => ({
    value: country.code,
    label: country.name,
  }));

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key="booking-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-6"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{
              scale: 0.5,
              opacity: 0,
              rotate: -15,
              transition: { duration: 0.5, ease: "anticipate" },
            }}
            className="bg-white w-full max-w-[1400px] h-[90vh] rounded-[2rem] shadow-2xl relative flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 z-[100] p-2 bg-white/80 backdrop-blur hover:bg-red-50 text-gray-600 hover:text-red-500 rounded-full shadow-md transition-all border border-gray-100"
            >
              <X size={24} />
            </button>

            {/* LEFT SIDE: Form */}
            <div className="w-full lg:flex-1 p-6 md:p-12 lg:p-16 bg-white lg:overflow-y-auto lg:h-full custom-scrollbar">
              <div className="p-8 md:p-12 lg:p-16 max-w-4xl mx-auto">
                <div className="mb-10">
                  <h1 className="text-4xl md:text-5xl font-serif text-[#003b14] font-bold mb-3">
                    Secure Your Stay
                  </h1>
                  <p className="text-gray-500 text-lg">
                    Complete the details below to confirm your reservation.
                  </p>
                </div>

                {/* Tab Switcher */}
                <div className="flex p-1 bg-gray-100 rounded-xl mb-8 w-full shadow-inner">
                  <button
                    onClick={() => setActiveTab("contact")}
                    // Fixed: Reduced padding (px-2) and text size (text-xs) on mobile to prevent overlap
                    className={`flex-1 py-3 px-2 md:px-4 rounded-lg text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      activeTab === "contact"
                        ? "bg-white text-[#007326] shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <User size={18} /> Contact Info
                  </button>
                  <button
                    onClick={() => setActiveTab("booking")}
                    // Fixed: Reduced padding (px-2) and text size (text-xs) on mobile to prevent overlap
                    className={`flex-1 py-3 px-2 md:px-4 rounded-lg text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      activeTab === "booking"
                        ? "bg-white text-[#007326] shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Calendar size={18} /> Booking Details
                  </button>
                </div>

                <div className="space-y-6 pb-10">
                  <AnimatePresence mode="wait">
                    {/* CONTACT TAB */}
                    {activeTab === "contact" && (
                      <motion.div
                        key="contact"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="space-y-5"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="md:col-span-1">
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                              Title
                            </label>
                            <select
                              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007326] outline-none cursor-pointer"
                              value={formData.title}
                              onChange={(e) =>
                                handleChange("title", e.target.value)
                              }
                            >
                              <option>Mr</option>
                              <option>Mrs</option>
                              <option>Ms</option>
                              <option>Dr</option>
                            </select>
                          </div>
                          <div className="md:col-span-3">
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                              First Name
                            </label>
                            <input
                              type="text"
                              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007326] outline-none"
                              placeholder="Enter your First Name here..."
                              value={formData.firstName}
                              onChange={(e) =>
                                handleChange("firstName", e.target.value)
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                            Last Name
                          </label>
                          <input
                            type="text"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007326] outline-none"
                            placeholder="Enter your Last Name here..."
                            value={formData.lastName}
                            onChange={(e) =>
                              handleChange("lastName", e.target.value)
                            }
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                              Phone Number
                            </label>
                            {/* <PhoneInput international defaultCountry="GB" value={formData.contactNumber} onChange={(val) => handleChange("contactNumber", val)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-[#007326] outline-none flex" /> */}
                            <PhoneInput
                              international
                              defaultCountry={detectedCountry as any}
                              value={phoneNumber}
                              onChange={(value) => {
                                setPhoneNumber(value || "");
                                handleChange("contactNumber", value || "");
                              }}
                              className="w-full [&_.PhoneInputCountry]:px-3 [&_.PhoneInputCountry]:py-2.5 [&_.PhoneInputCountry]:border [&_.PhoneInputCountry]:border-gray-200 [&_.PhoneInputCountry]:rounded-l-xl [&_.PhoneInputCountry]:bg-gray-50 [&_.PhoneInputInput]:flex-1 [&_.PhoneInputInput]:px-3 [&_.PhoneInputInput]:py-2.5 [&_.PhoneInputInput]:text-sm [&_.PhoneInputInput]:border [&_.PhoneInputInput]:border-gray-200 [&_.PhoneInputInput]:rounded-r-xl [&_.PhoneInputInput:focus]:ring-2 [&_.PhoneInputInput:focus]:ring-[#007326] [&_.PhoneInputInput:focus]:border-transparent [&_.PhoneInputInput]:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                              Email Address
                            </label>
                            <input
                              type="email"
                              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007326] outline-none"
                              placeholder="Enter your email here..."
                              value={formData.email}
                              onChange={(e) =>
                                handleChange("email", e.target.value)
                              }
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                              Nationality
                            </label>
                            <Select
                              options={countryOptions}
                              value={countryOptions.find(
                                (c) => c.label === formData.country
                              )}
                              placeholder="Select Country"
                              onChange={(opt) =>
                                handleChange("country", opt?.label)
                              }
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  padding: "6px",
                                  borderRadius: "0.75rem",
                                  border: "1px solid #e5e7eb",
                                }),
                              }}
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                              ID Number
                            </label>
                            <div className="flex gap-2">
                              <select
                                className="w-1/3 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none cursor-pointer"
                                value={formData.passportType}
                                onChange={(e) =>
                                  handleChange("passportType", e.target.value)
                                }
                              >
                                <option>Passport</option>
                                <option>NIC</option>
                              </select>
                              <input
                                type="text"
                                className="w-2/3 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007326] outline-none"
                                placeholder="Number"
                                value={formData.passportNumber}
                                onChange={(e) =>
                                  handleChange(
                                    "passportNumber",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveTab("booking")}
                          className="w-full py-4 mt-4 bg-[#007326] text-white font-bold rounded-xl shadow-lg hover:bg-[#005a1e] transition-transform active:scale-95 cursor-pointer"
                        >
                          Next: Booking Details
                        </button>
                      </motion.div>
                    )}

                    {/* BOOKING TAB */}
                    {activeTab === "booking" && (
                      <motion.div
                        key="booking"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-5"
                      >
                        {/* Room Select */}
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                            Select Room
                          </label>
                          {/* Fixed: Added min-h-[100px] and border to ensure visibility even when empty */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 min-h-[100px] overflow-y-auto custom-scrollbar border border-transparent">
                            {loadingRooms ? (
                              <div className="col-span-full flex items-center justify-center h-20">
                                <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-green-600 mb-4"></div>
                                <p className="text-sm text-gray-400">
                                  Loading rooms...
                                </p>
                              </div>
                            ) : rooms.length > 0 ? (
                              rooms.map((room: any) => (
                                <div
                                  key={room.id}
                                  onClick={() =>
                                    handleChange("room", room.id.toString())
                                  }
                                  className={`cursor-pointer rounded-xl border-2 p-4 transition-all bg-white ${
                                    formData.room === room.id.toString()
                                      ? "border-[#007326] bg-green-50"
                                      : "border-gray-200 hover:border-gray-300"
                                  }`}
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <BedDouble
                                      className={
                                        formData.room === room.id.toString()
                                          ? "text-[#007326]"
                                          : "text-gray-400"
                                      }
                                    />
                                    <span className="text-xs font-bold bg-white px-2 py-1 rounded shadow-sm">
                                      ${room.cost}
                                    </span>
                                  </div>
                                  <p className="font-bold text-sm text-gray-800">
                                    {room.name}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {room.capacity} Guests
                                  </p>
                                </div>
                              ))
                            ) : (
                              // Fixed: Added explicit empty state message
                              <div className="col-span-full flex items-center justify-center h-20 border-2 border-dashed border-gray-200 rounded-xl">
                                <p className="text-sm text-gray-400">
                                  No rooms available.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                              Check-in
                            </label>
                            <DatePicker
                              selected={
                                formData.checkInDate
                                  ? new Date(
                                      formData.checkInDate + "T00:00:00"
                                    )
                                  : null
                              }
                              onChange={(date) => {
                                if (date) {
                                  const year = date.getFullYear();
                                  const month = String(
                                    date.getMonth() + 1
                                  ).padStart(2, "0");
                                  const day = String(date.getDate()).padStart(
                                    2,
                                    "0"
                                  );
                                  handleChange(
                                    "checkInDate",
                                    `${year}-${month}-${day}`
                                  );
                                } else {
                                  handleChange("checkInDate", "");
                                }
                              }}
                              placeholderText="Select Date"
                              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007326] outline-none"
                              minDate={new Date()}
                              filterDate={(date) => !isDateBooked(date)}
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                              Check-out
                            </label>
                            <DatePicker
                              selected={
                                formData.checkOutDate
                                  ? new Date(
                                      formData.checkOutDate + "T00:00:00"
                                    )
                                  : null
                              }
                              onChange={(date) => {
                                if (date) {
                                  const year = date.getFullYear();
                                  const month = String(
                                    date.getMonth() + 1
                                  ).padStart(2, "0");
                                  const day = String(date.getDate()).padStart(
                                    2,
                                    "0"
                                  );
                                  const selectedDate = `${year}-${month}-${day}`;

                                  // Validate: if same day selected, check times
                                  if (selectedDate === formData.checkInDate) {
                                    const checkInTime =
                                      formData.checkInTime || "09:00";
                                    const checkOutTime =
                                      formData.checkOutTime || "11:00";

                                    if (checkOutTime <= checkInTime) {
                                      showAlert(
                                        "Invalid Time Range",
                                        "Check-out time must be after check-in time on the same day, or select a later date.",
                                        "warning"
                                      );
                                      return;
                                    }
                                  }

                                  handleChange("checkOutDate", selectedDate);
                                } else {
                                  handleChange("checkOutDate", "");
                                }
                              }}
                              placeholderText="Select Date"
                              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007326] outline-none"
                              minDate={
                                formData.checkInDate
                                  ? new Date(
                                      formData.checkInDate + "T00:00:00"
                                    )
                                  : new Date()
                              }
                              filterDate={(date) => !isDateBooked(date)}
                            />
                          </div>
                        </div>

                        {/* Times */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                              Check-in Time
                            </label>
                            <div className="relative">
                              <DatePicker
                                selected={
                                  formData.checkInTime
                                    ? new Date(
                                        `2000-01-01T${formData.checkInTime}`
                                      )
                                    : null
                                }
                                onChange={(date) =>
                                  handleChange(
                                    "checkInTime",
                                    date ? date.toTimeString().slice(0, 5) : ""
                                  )
                                }
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Time"
                                dateFormat="h:mm aa"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007326] outline-none"
                              />
                              <Clock
                                size={16}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                              Check-out Time
                            </label>
                            <div className="relative">
                              <DatePicker
                                selected={
                                  formData.checkOutTime
                                    ? new Date(
                                        `2000-01-01T${formData.checkOutTime}`
                                      )
                                    : null
                                }
                                onChange={(date) => {
                                  if (date) {
                                    const timeStr = date
                                      .toTimeString()
                                      .slice(0, 5);

                                    // Validate: if same day, check-out time must be after check-in time
                                    if (
                                      formData.checkInDate ===
                                      formData.checkOutDate
                                    ) {
                                      const checkInTime =
                                        formData.checkInTime || "09:00";
                                      if (timeStr <= checkInTime) {
                                        showAlert(
                                          "Invalid Time",
                                          "Check-out time must be after check-in time on the same day.",
                                          "warning"
                                        );
                                        return;
                                      }
                                    }

                                    handleChange("checkOutTime", timeStr);
                                  } else {
                                    handleChange("checkOutTime", "");
                                  }
                                }}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Time"
                                dateFormat="h:mm aa"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007326] outline-none"
                              />
                              <Clock
                                size={16}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Add-ons Section */}
                        <div className="pt-4 border-t border-gray-100">
                          <label className="text-xs font-bold text-gray-500 uppercase mb-3 block">
                            Extra Services
                          </label>

                          {/* 1. Meal */}
                          <div className="flex justify-between items-center mb-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                                <Utensils size={16} />
                              </div>
                              <span className="font-semibold text-gray-700 text-sm">
                                Meals?
                              </span>
                            </div>
                            <input
                              type="checkbox"
                              className="w-5 h-5 text-green-600 rounded focus:ring-green-500 cursor-pointer"
                              checked={formData.meal}
                              onChange={(e) =>
                                handleChange("meal", e.target.checked)
                              }
                            />
                          </div>

                          {/* 2. Guide */}
                          <div className="flex justify-between items-center mb-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                <Map size={16} />
                              </div>
                              <span className="font-semibold text-gray-700 text-sm">
                                Need a Guide?
                              </span>
                            </div>
                            <input
                              type="checkbox"
                              className="w-5 h-5 text-green-600 rounded focus:ring-green-500 cursor-pointer"
                              checked={formData.guide}
                              onChange={(e) =>
                                handleChange("guide", e.target.checked)
                              }
                            />
                          </div>

                          {/* 3. Vehicle */}
                          <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                            <div className="flex justify-between items-center mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                                  <Car size={16} />
                                </div>
                                <span className="font-semibold text-gray-700 text-sm">
                                  Vehicle Rental?
                                </span>
                              </div>
                              <input
                                type="checkbox"
                                className="w-5 h-5 text-green-600 rounded focus:ring-green-500 cursor-pointer"
                                checked={formData.vehicleNeeded}
                                onChange={(e) =>
                                  handleChange(
                                    "vehicleNeeded",
                                    e.target.checked
                                  )
                                }
                              />
                            </div>

                            {/* Vehicle Options (Only if checked) */}
                            {/* {formData.vehicleNeeded && (
                                <div className="mt-3 space-y-3 pl-2 border-l-2 border-gray-200 ml-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 block mb-1">Vehicle Type</label>
                                        <select value={formData.vehicleType} onChange={(e) => handleChange("vehicleType", e.target.value)} className="w-full p-2 text-sm border rounded-lg outline-none focus:border-green-500">
                                           {vehicleOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Need a Driver?</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-gray-400">{formData.driver ? "Yes" : "No"}</span>
                                            <input type="checkbox" className="w-4 h-4" checked={formData.driver} onChange={(e) => handleChange("driver", e.target.checked)} />
                                        </div>
                                    </div>
                                </div>
                             )} */}
                          </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                          <button
                            onClick={() => setActiveTab("contact")}
                            className="w-full py-4 bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition cursor-pointer"
                          >
                            Back
                          </button>
                          {/* Confirm Button removed from here and moved to Summary */}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Sticky Summary */}
            <div className="w-full lg:flex-1 bg-[#003b14] text-white p-6 md:p-8 overflow-hidden relative lg:h-full h-auto flex-shrink-0 order-last">
              <div className="h-full flex flex-col">
                <h2 className="text-xl md:text-2xl font-serif font-bold border-b border-green-800 pb-4 mb-4">
                  Your Stay
                </h2>

                {/* Fixed: Removed overflow-y-auto to stop scrolling */}
                <div className="flex-1 flex flex-col gap-3">
                  {selectedRoom ? (
                    <div className="flex flex-col gap-3 h-full">
                      {/* Fixed: Reduced image height to h-32 (128px) */}
                      <div className="w-full h-32 bg-green-800 rounded-xl overflow-hidden relative shadow-lg shrink-0">
                        <img
                          src={
                            selectedRoom.image ||
                            // @ts-ignore
                            selectedRoom.img1 ||
                            "/placeholder.png"
                          }
                          alt="Room"
                          className="object-cover w-full h-full"
                        />
                      </div>

                      {/* Room Title & Capacity */}
                      <div className="shrink-0">
                        <p className="font-bold text-xl font-serif leading-tight">
                          {selectedRoom.name}
                        </p>
                        <p className="text-xs text-green-300 mt-1">
                          {selectedRoom.capacity} Guests • {selectedRoom.beds}
                        </p>
                      </div>

                      {/* Check-In/Out Box - Fixed: Compacted padding (p-3) */}
                      <div className="bg-[#004d1a] rounded-xl p-3 flex justify-between items-center text-sm border border-green-800/50 shadow-inner shrink-0">
                        <div>
                          <p className="text-green-300 text-[10px] uppercase font-bold tracking-wider">
                            Check-In
                          </p>
                          <p className="font-medium text-base mt-0.5">
                            {formData.checkInDate || "--"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-green-300 text-[10px] uppercase font-bold tracking-wider">
                            Check-Out
                          </p>
                          <p className="font-medium text-base mt-0.5">
                            {formData.checkOutDate || "--"}
                          </p>
                        </div>
                      </div>

                      {/* Price Breakdown - Fixed: Compacted spacing */}
                      <div className="space-y-2 pt-2 border-t border-green-800 text-sm mt-auto">
                        <div className="flex justify-between text-green-100/80">
                          <span>Room ({days} nights)</span>
                          <span>${roomCost}</span>
                        </div>
                        {vehicleCost > 0 && (
                          <div className="flex justify-between text-green-100/80">
                            <span>Vehicles</span>
                            <span>${vehicleCost}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-green-100/80">
                          <span>Service Charge (5%)</span>
                          <span>${serviceCharge.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-green-800 mt-1">
                          <span>Total</span>
                          <span>${grandTotal.toFixed(2)}</span>
                        </div>

                        {/* Confirm Button */}
                        <button
                          onClick={handleSubmit}
                          disabled={
                            isSubmitting ||
                            !isContactComplete ||
                            !isBookingComplete
                          }
                          className={`w-full mt-4 py-4 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                            isContactComplete &&
                            isBookingComplete &&
                            !isSubmitting
                              ? "bg-white text-[#003b14] hover:bg-green-50 active:scale-95 cursor-pointer"
                              : "bg-green-900/50 text-green-200/50 cursor-not-allowed"
                          }`}
                        >
                          {isSubmitting
                            ? "Processing..."
                            : "Confirm Booking"}
                          <CheckCircle size={18} />
                        </button>

                        {/* Validation Message */}
                        {(!isContactComplete || !isBookingComplete) && (
                          <p className="text-center text-[10px] text-red-300 mt-1 font-medium bg-red-900/20 py-1 rounded-lg">
                            * Please complete all fields.
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    // Empty State
                    <div className="flex flex-col gap-4 animate-fadeIn h-full">
                      {/* Fixed: Reduced image height to h-40 */}
                      <div className="w-full h-40 bg-green-800 rounded-xl overflow-hidden relative shadow-lg shrink-0">
                        <img
                          src={hotelInfo.image}
                          alt="Cottage"
                          className="object-cover w-full h-full opacity-90 hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-serif font-bold text-white">
                          {hotelInfo.name}
                        </h3>
                        <div className="flex items-center gap-2 text-green-300 text-xs">
                          <MapPin size={14} />
                          <p>{hotelInfo.address}</p>
                        </div>
                        <div className="flex items-center gap-2 text-green-300 text-xs">
                          <Phone size={14} />
                          <p>{hotelInfo.contact}</p>
                        </div>
                      </div>
                      <div className="bg-[#004d1a] p-4 rounded-xl border-l-4 border-green-500">
                        <p className="text-white/90 italic leading-relaxed text-sm">
                          "{hotelInfo.promoText}"
                        </p>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-green-400/60 mt-auto pb-4">
                        <Info size={16} />
                        <span className="text-xs uppercase tracking-widest">
                          Select a room to begin
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Notes */}
                <div className="mt-auto pt-4 border-t border-green-800 flex flex-col gap-1 text-[10px] text-green-300/60">
                  <div className="flex items-center gap-2">
                    <CreditCard size={12} />
                    <p>No payment required today, Pay at property.</p>
                  </div>
                  <p>Extra charges will be charged for Extra services.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <CustomAlert
        key="custom-alert"
        isOpen={alert.isOpen}
        onClose={closeAlert}
        title={alert.title}
        message={alert.message}
        type={alert.type}
      />
    </AnimatePresence>
  );
}