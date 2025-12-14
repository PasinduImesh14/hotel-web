"use client";

import Link from "next/link";
import React, { useState } from "react";
import PlaceMapCard from "./PlaceMapCard";
import { Place } from "./PlaceMap";

interface Props {
  places: Place[];
}

export default function PlacesSelector({ places }: Props) {
  const [activePlace, setActivePlace] = useState<Place>(places[0]);

  return (
    <div className="flex flex-col lg:flex-row items-start justify-center gap-12 px-6 md:px-16 py-16 max-w-7xl mx-auto">
      
      {/* Left Side: Clean Text List */}
      <div className="w-full lg:w-1/3 flex flex-col gap-1">
        {places.map((place) => {
          const isActive = activePlace.id === place.id;
          
          return (
            <button
              key={place.id}
              onClick={() => setActivePlace(place)}
              className={`text-left w-full py-3 px-4 transition-all duration-200 border-l-4 text-lg ${
                isActive
                  ? "border-green-600 text-green-800 font-bold pl-6" // Active: Bold + Indent
                  : "border-transparent text-gray-500 hover:text-green-600 hover:pl-6 font-medium" // Inactive: Grey
              }`}
            >
              {place.name}
            </button>
          );
        })}

        <Link
          href="/places"
          className="mt-8 ml-4 text-green-700 font-bold text-lg hover:underline hover:text-green-900 transition-colors w-fit"
        >
          Explore More Locations ➝
        </Link>
      </div>

      {/* Right Side: Map + Card (Unchanged) */}
      <div className="w-full lg:w-2/3 sticky top-8">
        <PlaceMapCard place={activePlace} />
      </div>
    </div>
  );
}