"use client";
import React from "react";
import { aboutData } from "@/data/about";

const StatsSection = () => {
  return (
    <section className="py-20 bg-[#f4f9f5] border-t border-gray-200">
      <div className="w-[90%] md:w-[85%] xl:w-[75%] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-300/50">
          {aboutData.stats.map((stat) => (
            <div key={stat.id} className="px-4">
              <h4 className="text-4xl md:text-5xl font-serif text-gray-900 font-bold mb-2">
                {stat.value}
              </h4>
              <p className="text-sm md:text-base text-gray-500 uppercase tracking-widest font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;