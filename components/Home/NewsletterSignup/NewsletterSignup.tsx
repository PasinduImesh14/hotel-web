"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { NewslwtterSignup } from "@/data/NewslwtterSignup";
import svgPaths from "../../Helper/Navbar/svgpath";

const NewsletterSignup: React.FC = () => {
  const scenicImg = NewslwtterSignup[0]?.image;

  return (
    <section className="relative bg-[#001106] text-white w-full overflow-hidden py-60 px-6 md:px-16 lg:px-24">
      {/* Top Curve SVG */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[60px] w-full flex justify-center items-center overflow-visible z-20">
        <div className="flex-none overflow-visible">
          <div className="relative h-[60px] w-full max-w-[1057px] flex justify-center items-center overflow-visible">
            <svg
              className="block w-full h-full overflow-visible"
              viewBox="0 0 1057 49"
              fill="none"
              preserveAspectRatio="none"
            >
              <path d={svgPaths.p3e25ed70} fill="#FFFFFF" />
            </svg>
          </div>
        </div>
      </div>

      {/* Header */}
      <motion.div
        className="relative z-10 max-w-3xl ml-6 md:ml-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.2 } }
        }}
      >
        {/* Heading */}
        <motion.h2
          className="text-5xl md:text-6xl font-normal mb-8"
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
          }}
        >
          Stay in the Loop
        </motion.h2>

        {/* Paragraph */}
        <motion.p
          className="text-gray-300 text-xl md:text-2xl mb-10 leading-relaxed font-light"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
          }}
        >
          Sign up to hear from us! Get exclusive offers, updates, and insider tips for your perfect Sigiriya getaway.
        </motion.p>

        {/* Email Form */}
        <motion.form
          className="flex flex-col sm:flex-row gap-4 mb-6"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
          }}
        >
          <motion.input
            type="email"
            placeholder="Your email address"
            className="w-full sm:flex-1 sm:max-w-[520px] px-6 py-5 bg-[#e8e8e8] text-[#6c6c6c] placeholder-gray-500 rounded-2xl outline-none text-xl font-light transition-all hover:bg-white focus:bg-white"
            required
            whileFocus={{ scale: 1.01 }}
          />
          <motion.button
            type="submit"
            className="bg-[#4cff88] hover:bg-[#3ee878] text-[#1a1a1a] font-medium px-12 py-5 rounded-2xl text-xl transition-all shadow-lg"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            Subscribe
          </motion.button>
        </motion.form>

        {/* Note */}
        <motion.p
          className="text-base text-[#b3a897] font-light"
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
          }}
        >
          You can opt out anytime. See our{" "}
          <a href="/privacy" className="underline text-[#4cff88] hover:text-[#3ee878] transition-colors">
            privacy statement.
          </a>
        </motion.p>
      </motion.div>

      {/* Rotated Decorative Image */}
      {scenicImg && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="absolute flex items-center justify-center right-[-150px] top-[85%] -translate-y-1/2"
          style={{
            width: "calc(1px * ((var(--transform-inner-width) * 0.9327710866928101) + (var(--transform-inner-height) * 0.36046934127807617)))",
            height: "calc(1px * ((var(--transform-inner-width) * 0.36046934127807617) + (var(--transform-inner-height) * 0.9327710866928101)))",
            "--transform-inner-width": "500",
            "--transform-inner-height": "500"
          } as React.CSSProperties}
        >
          <div className="flex-none rotate-[-25deg] relative">
            {/* Overlay Layer */}
            <div 
              className="absolute inset-0 pointer-events-none rounded-[40px] z-10" 
              style={{ backgroundColor: "rgba(0, 17, 6, 0.5)" }} 
            />

            {/* Image Container */}
            <div className="relative opacity-90 overflow-hidden rounded-[40px]" style={{ width: "1300px", height: "1300px" }}>
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <Image
                  src={scenicImg}
                  alt="Scenic Cottage"
                  fill
                  className="object-cover max-w-none"
                  priority
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Bottom Curve SVG */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[60px] w-full flex justify-center items-center overflow-visible">
        <div className="flex-none rotate-[180deg] overflow-visible">
          <div className="relative h-[60px] w-full max-w-[1057px] flex justify-center items-center overflow-visible">
            <svg
              className="block w-full h-full overflow-visible"
              viewBox="0 0 1057 49"
              fill="none"
              preserveAspectRatio="none"
            >
              <path d={svgPaths.p3e25ed70} fill="#FFFFFF" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;