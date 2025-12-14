"use client";

import React from "react";
import Image from "next/image";
import PlaceMap, { Place } from "./PlaceMap";

interface Props {
  place: Place;
}

export default function PlaceMapCard({ place }: Props) {
  return (
    // Main Container - Fixed height 450px
    <div
      className="relative w-[95%] sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[65%] mx-auto rounded-3xl shadow-2xl overflow-hidden border-4 border-white/20 bg-gray-900 group"
      style={{ height: "450px" }}
    >
      
      {/* 1. THE MAP WRAPPER (The Mask)
          - h-[200%]: Make map double height so we have room to shift it
          - -top-[50%]: Shift it up. 
            * Math: Center of 200% is at 100%. If we shift up by 25% of the double height (50% of parent), 
            * the center ends up at 75% of the viewable area (Bottom).
      */}
      <div className="absolute w-full h-[200%] -top-[25%] left-0 z-0">
        <PlaceMap place={place} />
      </div>

      {/* 2. CUSTOM ATTRACTIVE PIN (Overlays the real center)
         - Position: top-[75%] matches the calculated map center
      */}
      <div className="absolute top-[75%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
        <div className="relative flex items-center justify-center">
           {/* Pulsing Effect */}
           <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-green-400 opacity-75"></span>
           {/* The Pin Head */}
           <div className="relative h-10 w-10 bg-gradient-to-br from-green-500 to-green-700 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
              {/* Inner Dot */}
              <div className="h-3 w-3 bg-white rounded-full"></div>
           </div>
           {/* The Pin Needle/Triangle */}
           <div className="absolute -bottom-2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[14px] border-t-green-700"></div>
        </div>
      </div>

      {/* 3. THE FLOATING CARD
         - Positioned at bottom-[28%] to sit JUST above the pin at 75%
      */}
      <div className="absolute bottom-[28%] left-1/2 transform -translate-x-1/2 z-20 w-[280px] drop-shadow-2xl transition-all duration-500 ease-in-out">
        
        {/* Card Body */}
        <div className="bg-white rounded-2xl overflow-hidden relative z-10 shadow-black/30 shadow-xl">
          {/* Image */}
          <div className="relative h-[130px] w-full">
            <Image
              src={place.image}
              alt={place.name}
              fill
              className="object-cover"
              sizes="280px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* Overlay Name on Image */}
            <h3 className="absolute bottom-2 left-3 text-white font-bold text-lg leading-tight shadow-black drop-shadow-md">
              {place.name}
            </h3>
          </div>

          {/* Details */}
          <div className="p-4 bg-white">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-1">
                <span className="text-yellow-500 text-base">★</span>
                <span className="text-gray-800 font-bold text-sm">{place.rating}</span>
                <span className="text-gray-400 text-xs">({place.reviews})</span>
              </div>
              <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                {place.open} - {place.close}
              </span>
            </div>

            <a
              href={`https://maps.google.com/maps?q=${place.lat},${place.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-gray-900 hover:bg-black text-white text-xs font-bold py-3 rounded-xl transition-all active:scale-95"
            >
              <span>Map Directions</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </a>
          </div>
        </div>

        {/* Pointer Arrow pointing to the pin */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 transform z-0"></div>
      </div>

    </div>
  );
}