import React from 'react';
import Image from 'next/image';
import RoomList from '@/components/Rooms/RoomList';
//import ResponsiveNav from '@/components/Helper/Navbar/ResponsiveNav'; 
import NewsletterSignup from '@/components/Home/NewsletterSignup/NewsletterSignup';

const RoomsPage = () => {
  return (
    <div className="overflow-hidden">
      
      {/* Navigation */}
      {/* <ResponsiveNav /> */}

    {/* ============ HERO SECTION ============ */}
      {/* ✅ FIXED: Changed height to 'h-screen' to take up 100% of the viewport */}
      <div className="relative h-screen flex items-center justify-center">
        
        {/* Background Image */}
        <div className="absolute inset-0 -z-10">
           <Image 
            src="/images/Rooms/IMG_0004.JPG"
            alt="Rooms Hero Sanctuary"
            fill
            priority // ⚡ Loads immediately
            className="object-cover object-center"
            quality={90}
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Hero Text */}
        {/* Optional: You can remove 'pt-[10vh]' if you want the text perfectly centered in the screen. 
            I kept it here to ensure it doesn't clash with your top Navbar. */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-[10vh]">
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