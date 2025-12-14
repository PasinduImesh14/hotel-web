"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FaArrowRight, FaCheck, FaTimes, FaUserFriends, FaBed, FaRulerCombined, FaListUl } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { BackendRoom } from "@/types/BackendRoom";
import { useRouter } from 'next/navigation';


type Props = {
  room: BackendRoom;
  index: number;
   checkIn?: string;
  checkOut?: string;
};

const RoomCard = ({ room, index,checkIn, checkOut }: Props) => {
  const router = useRouter();
  const isReversed = index % 2 !== 0;
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    const nextState = !showDetails;
    setShowDetails(nextState);

    // ✅ FIX: Only scroll on MOBILE screens (width < 1024px).
    // On Desktop, the layout is side-by-side, so no scrolling is needed.
    if (nextState && typeof window !== "undefined" && window.innerWidth < 1024) {
      setTimeout(() => {
        const element = document.getElementById(`room-${room.id}`);
        if (element) {
          const yOffset = -100; 
          const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    }
  };

const handleBookNow = () => {
  const params = new URLSearchParams();
  params.append('roomId', room.id.toString());
  
  // Use dates from props (which come from RoomList's state - either URL or manual input)
  if (checkIn) params.append('checkIn', checkIn);
  if (checkOut) params.append('checkOut', checkOut);
  
  router.push(`/booking?${params.toString()}`);
};

  const images = [room.img1, room.img2, room.img3, room.img4].filter(Boolean);

  // Map backend room features to readable names
  const featureMap: { [key: string]: string } = {
    ac: "AC",
    wifi: "Wi-Fi",
    fan: "Fan",
    balcony: "Balcony",
    gardenView: "Garden View",
    tv: "TV",
    iron: "Iron",
    locker: "Locker",
    parking: "Parking",
    sittingArea: "Sitting Area",
    dryingRack: "Drying Rack",
    clothRack: "Cloth Rack",
  };

  const features = Object.entries(featureMap)
    .filter(([key]) => room[key as keyof BackendRoom] === "YES")
    .map(([_, label]) => label);

  const beds = room.bedrooms.map(b => b.bedType).join(", ");

  // Bathroom features layout
  const bathroomFeatures = room.bathrooms.length
    ? room.bathrooms.map((b, i) => (
        <div key={i} className="mb-4 pt-4 border-t border-gray-700">
          <h5 className="text-green-400 font-semibold mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400"></span> Bathroom {i + 1}
          </h5>
          <ul className="grid grid-cols-2 gap-x-2 gap-y-1 text-gray-300 text-sm pl-4">
            {b.shower === "YES" && <li>• Shower</li>}
            {b.slipper === "YES" && <li>• Slipper</li>}
            {b.soap === "YES" && <li>• Soap</li>}
            {b.bidet === "YES" && <li>• Bidet</li>}
            {b.towels === "YES" && <li>• Towels</li>}
            {b.toiletPaper === "YES" && <li>• Toilet Paper</li>}
            {b.hotWater === "YES" && <li>• Hot Water</li>}
            {b.privateBathroom === "YES" && <li>• Private</li>}
          </ul>
        </div>
      ))
    : null;

  // Kitchen features layout
  const kitchenFeatures = room.kitchen ? (
    <div className="mb-4 pt-4 border-t border-gray-700">
      <h5 className="text-green-400 font-semibold mb-2 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-400"></span> Kitchen
      </h5>
      <ul className="grid grid-cols-2 gap-x-2 gap-y-1 text-gray-300 text-sm pl-4">
        {room.kitchen.diningTable === "YES" && <li>• Dining Table</li>}
        {room.kitchen.gasCooker === "YES" && <li>• Gas Cooker</li>}
        {room.kitchen.riceCooker === "YES" && <li>• Rice Cooker</li>}
        {room.kitchen.woodStove === "YES" && <li>• Wood Stove</li>}
        {room.kitchen.fridge === "YES" && <li>• Fridge</li>}
        {room.kitchen.electricKettle === "YES" && <li>• Electric Kettle</li>}
        {room.kitchen.waterBottle === "YES" && <li>• Water Bottle</li>}
      </ul>
    </div>
  ) : null;

  return (
    <div
      id={`room-${room.id}`}
      className="scroll-mt-40 group w-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 relative"
    >
      <div className={`flex flex-col lg:flex-row ${isReversed ? "lg:flex-row-reverse" : ""} h-auto lg:h-[500px]`}>
        
        {/* ============ LEFT SECTION (Image / Details) ============ */}
        <div className="w-full lg:w-[55%] relative h-[500px] lg:h-full overflow-hidden bg-gray-100">
          <AnimatePresence mode="wait" initial={false}>
            {!showDetails ? (
              // --- IMAGE VIEW ---
              <motion.div
                key="image"
                className="relative w-full h-full"
                initial={{ x: isReversed ? "100%" : "-100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: isReversed ? "100%" : "-100%", opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {images.length > 0 ? (
                  <Image
                    src={images[0]!}
                    alt={room.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                    No Image
                  </div>
                )}
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md px-6 py-3 rounded-lg shadow-lg z-10 border-l-4 border-green-500">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Starting from</p>
                  <p className="text-2xl font-poppins text-gray-900 font-bold">
                    ${room.cost} <span className="text-sm font-sans font-medium text-gray-400">/night</span>
                  </p>
                </div>
              </motion.div>
            ) : (
              // --- DETAILS VIEW ---
              <motion.div
                key="details"
                className="relative w-full h-full flex flex-col bg-gray-900 text-white"
                initial={{ x: isReversed ? "-100%" : "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: isReversed ? "-100%" : "100%", opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {/* Close Button Fixed at Top Right */}
                <button
                  onClick={toggleDetails}
                  className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-20"
                >
                  <FaTimes className="text-white" />
                </button>

                {/* Scrollable Content Area */}
                <div className="w-full h-full p-8 lg:p-12 overflow-y-auto custom-scrollbar">
                  <h4 className="text-3xl font-serif mb-2 text-green-400">Room Overview</h4>
                  <p className="text-gray-400 text-sm mb-6 uppercase tracking-widest font-semibold">
                    {room.name} • {room.size}m²
                  </p>

                  <div className="space-y-6">
                    {/* General Amenities */}
                    <div>
                      <div className="flex items-center gap-2 mb-3 text-white font-bold sticky top-0 bg-gray-900 py-2 z-10 border-b border-gray-800">
                        <FaListUl className="text-green-500" /> 
                        <span>General Amenities</span>
                      </div>
                      <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                        {features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                            <div className="min-w-[6px] h-[6px] rounded-full bg-green-500"></div>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dynamic Sections */}
                    {kitchenFeatures}
                    {bathroomFeatures}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ============ RIGHT SECTION (Static Info) ============ */}
        <div className="w-full lg:w-[45%] flex flex-col justify-center p-8 sm:p-10 lg:p-10 bg-white relative h-auto lg:h-full">
          <h3 className="text-4xl sm:text-5xl font-serif font-medium text-gray-900 mb-8 leading-tight">
            {room.name}
          </h3>

          <div className="flex items-center gap-4 py-6 border-t border-b border-gray-100 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-full text-orange-600">
                <FaUserFriends />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">Capacity</p>
                <p className="text-sm font-bold text-gray-800">{room.capacity} Guests</p>
              </div>
            </div>

            <div className="w-[1px] h-10 bg-gray-100"></div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-full text-blue-600">
                <FaBed />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">Bedding</p>
                <p className="text-sm font-bold text-gray-800">{beds}</p>
              </div>
            </div>

            <div className="w-[1px] h-10 bg-gray-100 hidden sm:block"></div>

            <div className="hidden sm:flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-full text-green-600">
                <FaRulerCombined />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">Size</p>
                <p className="text-sm font-bold text-gray-800">{room.size} m²</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-10">
            {features.slice(0, 4).map((feature, i) => (
              <span
                key={i}
                className="flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100"
              >
                <FaCheck className="text-green-500 text-[10px]" /> {feature}
              </span>
            ))}
            {features.length > 4 && <span className="text-xs font-medium text-gray-400 px-2 py-1.5">+more</span>}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <button  onClick={handleBookNow} className="flex-1 px-8 py-3.5 bg-gray-900 text-white text-sm font-bold uppercase tracking-wider hover:bg-green-600 transition-colors duration-300 rounded-sm shadow-lg shadow-gray-200">
              Book Now
            </button>
            <button
              onClick={toggleDetails}
              className={`flex-1 px-8 py-3.5 border text-sm font-bold uppercase tracking-wider transition-all duration-300 rounded-sm flex items-center justify-center gap-2 ${
                showDetails ? "border-green-500 bg-green-50 text-green-600" : "border-gray-200 text-gray-900 hover:border-gray-900 hover:bg-gray-50"
              }`}
            >
              {showDetails ? "Close" : "Details"} {showDetails ? <FaTimes /> : <FaArrowRight />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;