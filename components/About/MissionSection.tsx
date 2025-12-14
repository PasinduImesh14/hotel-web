"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { aboutData } from "@/data/about";

// 1. Helper Component: Handles the animation of a SINGLE word
const Word = ({ children, range, progress }: { children: string; range: [number, number]; progress: MotionValue<number> }) => {
  const color = useTransform(
    progress,
    range,
    ["#d1d5db", "#111827"] // Transitions from Light Gray (gray-300) to Dark Black (gray-900)
  );

  return (
    <motion.span style={{ color }} className="mr-2 inline-block transition-colors duration-200">
      {children}
    </motion.span>
  );
};

// 2. Helper Component: Splits the paragraph and manages the timing
const ScrollRevealParagraph = ({ text }: { text: string }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.5"], // Animation starts when top enters, ends when bottom is at middle
  });

  const words = text.split(" ");

  return (
    <p ref={containerRef} className="text-3xl md:text-5xl lg:text-6xl font-serif leading-tight mb-12 flex flex-wrap justify-center">
      {words.map((word, i) => {
        // Calculate the start and end of the animation for this specific word
        const start = i / words.length;
        const end = start + (1 / words.length);
        
        return (
          <Word key={i} range={[start, end]} progress={scrollYProgress}>
            {word}
          </Word>
        );
      })}
    </p>
  );
};

const MissionSection = () => {
  return (
    <section className="py-24 lg:py-32 bg-[#f4f9f5] text-center px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Title */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[#007326] font-bold uppercase tracking-[0.2em] mb-6 text-sm"
        >
          {aboutData.mission.title}
        </motion.p>

        {/* ✅ THE LINE-BY-LINE REVEAL EFFECT */}
        <ScrollRevealParagraph text={`"${aboutData.mission.text}"`} />

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative inline-block"
        >
          <span className="text-6xl text-green-300 absolute -top-8 -left-8 font-serif">“</span>
          <p className="text-xl md:text-2xl text-gray-600 font-light italic relative z-10">
            {aboutData.mission.quote}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default MissionSection;