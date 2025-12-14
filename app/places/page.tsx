"use client";

import React, { useState, useCallback } from "react";
import Location01 from "@/components/Places/Locations/location01";
import Location02 from "@/components/Places/Locations/location02";
import Location03 from "@/components/Places/Locations/location03";
import Location04 from "@/components/Places/Locations/location04";
import Location05 from "@/components/Places/Locations/location05";
import Location06 from "@/components/Places/Locations/location06";
import Location07 from "@/components/Places/Locations/location07";
import Location08 from "@/components/Places/Locations/location08";
import Hero from "@/components/Places/Hero/Hero"; 
import Image from "next/image";

import { ChevronLeft, ChevronRight } from "lucide-react";

//===================== INTERFACES =====================//
interface LocationType {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  images: string[];
  description: string[];
}

interface LocationSliderProps {
  images: string[];
}

interface LocationDetailProps {
  location: LocationType;
}

//===================== COMPONENTS (Slider + Detail) =====================//

function LocationSlider({ images }: LocationSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const prevSlide = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  React.useEffect(() => {
    const timer = setTimeout(nextSlide, 5000);
    return () => clearTimeout(timer);
  }, [currentIndex, nextSlide]);

  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-2xl shadow-2xl group">
      <div
        className="flex h-full transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, idx) => (
          <div key={idx} className="relative w-full h-full flex-shrink-0">
            <Image
              src={img}
              alt="Location View"
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={prevSlide}
          className="bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/40 transition-all hover:scale-110 text-white"
        >
          <ChevronLeft size={32} />
        </button>
        <button
          onClick={nextSlide}
          className="bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/40 transition-all hover:scale-110 text-white"
        >
          <ChevronRight size={32} />
        </button>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all duration-500 ${
              currentIndex === idx ? "w-8 bg-white" : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function LocationDetail({ location }: LocationDetailProps) {
  return (
    <div className="transition-all duration-500 transform opacity-100 translate-y-0">
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight">
          {location.title}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
          {location.subtitle}
        </p>
      </div>

      <LocationSlider images={location.images} />

      <div className="grid md:grid-cols-3 gap-10 mt-16 text-lg text-gray-700 leading-relaxed">
        {location.description.map((p, i) => (
          <p
            key={i}
            className="first-letter:text-5xl first-letter:font-bold first-letter:text-green-600 first-letter:mr-3 first-letter:float-left"
          >
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}

//===================== PLACES PAGE =====================//

export default function PlacesPage() {
  const locations: LocationType[] = [
    Location01,
    Location02,
    Location03,
    Location04,
    Location05,
    Location06,
    Location07,
    Location08,
  ];

  const [activeId, setActiveId] = useState(locations[0].id);
  const activeLocation =
    locations.find((l) => l.id === activeId) || locations[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Hero />

      {/* Sticky navbar */}
      <nav className="bg-white  z-50 mt-10 ">
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap justify-center gap-2 md:gap-4 ">
          {locations.map((l) => (
            <button
              key={l.id}
              onClick={() => setActiveId(l.id)}
              className={`px-2 py-1 md:px-4 md:py-2 font-semibold text-sm md:text-2xl cursor-pointer ${
                activeId === l.id
                  ? "text-green-700"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {l.name}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-12 ">
        <LocationDetail location={activeLocation} />
      </main>
    </div>
  );
}