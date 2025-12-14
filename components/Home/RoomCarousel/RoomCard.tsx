"use client";

import React, { useState } from "react";
import Image from "next/image";
import Slider from "react-slick";
import { 
  FaBed, FaUsers, FaWifi, FaFan, FaTv, FaParking, FaChair, FaSnowflake, FaDoorOpen 
} from "react-icons/fa"; // ✅ Added missing imports
import { motion } from "framer-motion";
import Link from "next/link";
import svgpath from "@/components/Helper/Navbar/svgpath"; 
import { BackendRoom } from "@/types/BackendRoom";

// ==================== IMAGE SECTION ====================
const RoomImageSection: React.FC<{
  images: string[];
  name: string;
  isFavorited: boolean;
  setIsFavorited: (val: boolean) => void;
  activeSlide: number;
  setActiveSlide: (val: number) => void;
}> = ({ images, name, isFavorited, setIsFavorited, activeSlide, setActiveSlide }) => {
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    beforeChange: (_: number, next: number) => setActiveSlide(next),
    pauseOnHover: true,
  };

  return (
    <div className="relative w-full h-[240px] overflow-hidden bg-gray-200">
      <Slider {...sliderSettings} className="h-full">
        {images.map((img, idx) => (
          <div key={idx} className="relative w-full h-[240px]">
            <Image
              src={img}
              alt={`${name}-${idx}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        ))}
      </Slider>

      <motion.div
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsFavorited(!isFavorited)}
        className="absolute right-3 top-3 w-8 h-8 flex items-center justify-center cursor-pointer z-10 bg-white/80 rounded-full backdrop-blur-sm shadow-sm"
      >
        <svg
          className="w-5 h-5"
          fill={isFavorited ? "#ff6b6b" : "none"}
          stroke={isFavorited ? "#ff6b6b" : "#4a4a4a"}
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={svgpath.pea4b2f0} />
        </svg>
      </motion.div>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.map((_, dot) => (
          <div
            key={dot}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              activeSlide === dot ? "bg-white w-6" : "bg-white/50 w-1.5"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// ==================== DATA SECTION ====================
const RoomDataSection: React.FC<{ room: BackendRoom }> = ({ room }) => {
  const formattedCapacity = `${room.capacity} Adult${room.capacity > 1 ? "s" : ""}`;

  const bedInfo =
    room.bedrooms && room.bedrooms.length > 0
      ? room.bedrooms.map(b => `${b.count} ${b.bedType}`).join(" & ")
      : "Bedding info";

  // ✅ COMPLETE ICON MAPPING
  // Checks every possible backend key and assigns an icon
  const allFeatures = [
    { key: 'ac', icon: <FaSnowflake />, label: "AC" },
    { key: 'wifi', icon: <FaWifi />, label: "WiFi" },
    { key: 'tv', icon: <FaTv />, label: "TV" },
    { key: 'fan', icon: <FaFan />, label: "Fan" },
    { key: 'parking', icon: <FaParking />, label: "Parking" },
    { key: 'sittingArea', icon: <FaChair />, label: "Sitting Area" },
    { key: 'balcony', icon: <FaDoorOpen />, label: "Balcony" },
  ];

  // Filter: Only show icons where room[key] === "YES" (or "AC" for ac)
  const activeIcons = allFeatures.filter(f => {
    // @ts-ignore - Dynamic access to room properties
    const val = room[f.key]; 
    return val === "YES" || val === "AC";
  });

  return (
    <div className="p-5 flex flex-col gap-3">
      <div className="flex justify-between items-start gap-2">
        <Link href={`/rooms#room-${room.id}`} scroll={true} className="hover:text-red-600 transition-colors duration-200">
          <h3 className="text-xl font-bold text-gray-800 leading-tight line-clamp-1" title={room.name}>
            {room.name}
          </h3>
        </Link>
        <div className="text-right shrink-0">
          <span className="text-lg font-bold text-[#C49C74]">${room.cost}</span>
          <span className="block text-[10px] text-gray-400 uppercase font-medium">/ night</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 font-medium">
        <div className="flex items-center gap-1.5">
          <FaBed className="text-gray-400" />
          <span>{bedInfo}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <FaUsers className="text-gray-400" />
          <span>{formattedCapacity}</span>
        </div>
      </div>

      {/* ✅ RENDER ALL ICONS DYNAMICALLY */}
      {activeIcons.length > 0 && (
        <div className="pt-3 mt-1 border-t border-gray-100 flex gap-4 text-gray-400 text-lg flex-wrap">
          {activeIcons.map((feat) => (
            <div key={feat.key} title={feat.label} className="hover:text-gray-600 transition-colors">
              {feat.icon}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ==================== MAIN ROOM CARD ====================
const RoomCard: React.FC<{ room: BackendRoom; index: number }> = ({ room, index }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const rawImages = [room.img1, room.img2, room.img3, room.img4].filter(Boolean) as string[];
  const sliderImages = rawImages.length ? rawImages : ["/images/placeholder.png"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="w-full shrink-0 relative bg-white rounded-[20px] shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group mx-auto max-w-[340px]"
    >
      <RoomImageSection
        images={sliderImages}
        name={room.name}
        isFavorited={isFavorited}
        setIsFavorited={setIsFavorited}
        activeSlide={activeSlide}
        setActiveSlide={setActiveSlide}
      />
      <RoomDataSection room={room} />
    </motion.div>
  );
};

export default RoomCard;