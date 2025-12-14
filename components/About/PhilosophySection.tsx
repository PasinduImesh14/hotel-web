"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { aboutData } from "@/data/about";
import { motion, useScroll, useTransform } from "framer-motion";

const PhilosophySection = () => {
  // 1. Create a reference to track this specific section
  const sectionRef = useRef(null);

  // 2. Track scroll progress of this section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"], // Animation starts when top of section hits bottom of screen
  });

  // 3. Define Color Transforms based on scroll position (0 to 1)
  
  // Title: Starts Gray -> Turns White (Center) -> Turns Green (End)
  const titleColor = useTransform(
    scrollYProgress,
    [0.2, 0.5, 0.8], 
    ["#6b7280", "#ffffff", "#8fce00"] // Tailwind colors: gray-500 -> white -> green
  );

  // Description: Starts Dark -> Turns Light Gray
  const descColor = useTransform(
    scrollYProgress,
    [0.2, 0.5], 
    ["#374151", "#d1d5db"] // gray-700 -> gray-300
  );

  return (
    <section 
      ref={sectionRef} 
      className="py-20 lg:py-32 bg-gray-900 text-white overflow-hidden relative"
    >
      <div className="w-[90%] md:w-[85%] xl:w-[75%] mx-auto flex flex-col lg:flex-row items-center gap-16">
        
        {/* Text Side */}
        <div className="w-full lg:w-1/2 z-10">
          <motion.p 
            className="text-[#007326] font-bold uppercase tracking-widest text-sm mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Our Architecture
          </motion.p>

          {/* ✅ Animated Title with Scroll Color Change */}
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-serif mb-8 leading-tight transition-colors duration-200"
            style={{ color: titleColor }} // Apply the dynamic color
          >
            {aboutData.philosophy.title}
          </motion.h2>

          {/* ✅ Animated Description with Scroll Color Change */}
          <motion.p 
            className="text-lg leading-relaxed font-light transition-colors duration-200"
            style={{ color: descColor }} // Apply the dynamic color
          >
            {aboutData.philosophy.description}
          </motion.p>
        </div>

        {/* Image Side */}
        <motion.div 
          className="w-full lg:w-1/2 relative h-[500px]"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 border border-white/20 translate-x-4 translate-y-4 rounded-lg z-0"></div>
          <div className="relative w-full h-full rounded-lg overflow-hidden z-10">
           <Image
  src={aboutData.philosophy.image}
  alt="Design Philosophy"
  fill
  className="object-cover"
  quality={90}
  sizes="(max-width: 768px) 100vw, 50vw"
/>

          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default PhilosophySection;