"use client"; // Needed for useState and useEffect

import React, { useState, useEffect } from 'react';
// We don't need next/image here anymore as motion.img handles the display
import { motion, AnimatePresence } from "motion/react"; 
import RoomList from '@/components/Rooms/RoomList';
//import ResponsiveNav from '@/components/Helper/Navbar/ResponsiveNav'; 
import NewsletterSignup from '@/components/Home/NewsletterSignup/NewsletterSignup';

// DEFINE YOUR IMAGES HERE
const ROOMS_SLIDE_IMAGES = [
  "/images/Rooms/deluxe double room.jpg", // Kept your original as the first one
  "/images/Rooms/deluxe triple room.jpg", // Replace with actual paths
  "/images/Rooms/deluxe family room.jpg",
  "/images/Rooms/double room with garden view.jpg",
  "/images/Rooms/triple room with garden view.jpg",
];

const RoomsPage = () => {
  // SlideShow Logic
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Change image every 6 seconds
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % ROOMS_SLIDE_IMAGES.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);


  return (
    <div className="overflow-hidden">
      
      {/* Navigation */}
      {/* <ResponsiveNav /> */}

      {/* ============ HERO SECTION ============ */}
      {/* Changed height to 'h-screen' to take up 100% of the viewport */}
      <div className="relative h-screen flex items-center justify-center">
        
        {/* --- Slideshow Background Start --- */}
        {/* Added 'bg-black' here to prevent white flashes during transitions if images load slowly */}
        <div className="absolute inset-0 -z-10 bg-black">
            <AnimatePresence mode="popLayout">
            <motion.img
                key={index}
                src={ROOMS_SLIDE_IMAGES[index]}
                alt="Rooms Hero Sanctuary"
                // Animation States
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: 1, scale: 1.1 }}
                exit={{ opacity: 0 }}
                // Transitions
                transition={{
                opacity: { duration: 1.5, ease: "easeInOut" }, // Smooth fade
                scale: { duration: 7, ease: "linear" }, // Slow zoom over 7 seconds
                }}
                // Replaced object-center with object-[center_40%] to shift focus slightly up if needed, 
                // otherwise revert to object-center
                className="absolute top-0 left-0 w-full h-full object-cover object-center"
            />
            </AnimatePresence>

            {/* Dark Overlay - Kept your original bg-black/60 and ensured z-index */}
            <div className="absolute inset-0 bg-black/60 z-10"></div>
        </div>
         {/* --- Slideshow Background End --- */}


        {/* Hero Text */}
        {/* Kept pt-[10vh] as requested to avoid navbar clash */}
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-[10vh]">
          <p className="text-white/90 text-sm sm:text-base font-sfpro font-bold uppercase tracking-[0.3em] mb-6">
            The Ultimate Escape
          </p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-white font-medium mb-8 leading-tight drop-shadow-lg">
            Find Your Sanctuary
          </h1>
        </div>
      </div>

      {/* ============ ROOM LIST SECTION ============ */}
      <RoomList />

      <NewsletterSignup />

    </div>
  );
};

export default RoomsPage;