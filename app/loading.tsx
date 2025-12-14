import React from "react";
import Image from "next/image";

// 1. UPDATED IMPORT: Pointing to the new SVG file
import icon from "./fav.svg"; 

export default function Loading() {
  return (
    /* Background changed to dark (neutral-900) */
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-neutral-900">
      
      {/* Animated Icon Wrapper */}
      <div className="relative mb-4">
        {/* Ping animation */}
        <div className="absolute inset-0 animate-ping rounded-full bg-green-500 opacity-20"></div>
        
        {/* Icon Circle */}
        <div className="relative bg-neutral-800 p-4 rounded-full shadow-lg border-2 border-green-600">
           
           {/* Image Component using the imported SVG */}
           <Image 
             src={icon} 
             alt="Loading Icon" 
             className="w-10 h-10 object-contain animate-pulse" 
             width={40}
             height={40}
             priority={true} // Optional: Loads image faster since it's above the fold
           />
           
        </div>
      </div>

      {/* Title Text */}
      <h2 className="text-2xl font-serif font-bold text-green-500 mb-2 animate-pulse">
        Scenic Cottage
      </h2>
      
      {/* Subtitle Text */}
      <p className="text-white text-sm tracking-widest uppercase">
        Preparing your sanctuary...
      </p>

      {/* Progress Bar */}
      <div className="w-48 h-1 bg-neutral-700 rounded-full mt-6 overflow-hidden">
        <div className="h-full bg-green-500 animate-[loading_1.5s_ease-in-out_infinite]"></div>
      </div>
    </div>
  );
}