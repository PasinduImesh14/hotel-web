"use client";

import { navLinks } from "@/constant/navLinks";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaBed } from "react-icons/fa";
import { HiBars3BottomRight } from "react-icons/hi2";
import { motion } from "motion/react";
import svgPaths from "./svgpath";

type Props = {
  openNav: () => void;
};

const Nav = ({ openNav }: Props) => {
  const [scrolled, setScrolled] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  const bookingLink =
    navLinks.find((link) => link.url === "/booking")?.url || "/booking";

  const navBackground =
    windowWidth < 1023 && scrolled ? "bg-white" : "bg-transparent";

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Detect window width (SSR-SAFE)
  useEffect(() => {
    const updateWidth = () => setWindowWidth(window.innerWidth);

    updateWidth();
    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Responsive font sizes
  const getLinkFontSize = () => {
    if (windowWidth > 1600) return "0.9rem";
    if (windowWidth > 1400) return "0.8rem";
    if (windowWidth > 1254) return "0.7rem";
    if (windowWidth > 1030) return "0.55rem";
    if (windowWidth > 768) return "0.5rem";
    return "0.75rem";
  };

  const linkTextClass = scrolled ? "text-[#003b14]" : "text-white";

  const linkHoverClass = scrolled
    ? "border-[#003b14] text-[#003b14] hover:bg-[#003b14] hover:text-white"
    : "border-white text-white hover:bg-white hover:text-black";

  return (
    <motion.div
      className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-300 ${navBackground}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="relative z-10 flex items-center justify-between h-[10vh] sm:h-[12vh] w-[92%] md:w-[88%] xl:w-[80%] mx-auto transition-colors duration-300">
        {/* Logo */}
        <motion.div
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold flex items-baseline cursor-pointer"
          whileHover={{ scale: 1.05 }}
        >
          <span className={linkTextClass}>Scenic</span>
          <span
            className={`ml-1 font-normal text-sm sm:text-base md:text-xl lg:text-2xl ${linkTextClass}`}
          >
            Cottage
          </span>
        </motion.div>

        {/* Desktop Nav Links */}
       <div
  className="hidden lg:flex items-center justify-center absolute left-1/2 -translate-x-1/2"
  style={{
    gap:
      windowWidth >= 1536
        ? scrolled
          ? "3rem"
          : "2rem"
        : windowWidth >= 1280
        ? scrolled
          ? "2.2rem"
          : "1.4rem"
        : scrolled
        ? "1.4rem"
        : "1rem", // Important: keeps gap small for 1024–1280px
    maxWidth:
      windowWidth >= 1536
        ? "900px"
        : windowWidth >= 1280
        ? "750px"
        : "620px", // prevents overflow into logo
    width: "100%",
    transition: "gap 0.8s ease",
  }}
>
          {navLinks.map((link) => (
            <Link href={link.url} key={link.id} className="group">
              <p
                className={`relative font-medium cursor-pointer transition-all duration-[1200ms] ${linkTextClass}
                  after:block after:content-[''] after:absolute after:-bottom-[3px] after:left-0
                  after:h-[2px] after:bg-[#007326] after:w-0 after:transition-all after:duration-300
                  group-hover:after:w-full whitespace-nowrap`}
                style={{
                  fontSize: getLinkFontSize(),
                }}
              >
                {link.label}
              </p>
            </Link>
          ))}
        </div>

        {/* Book Now + Mobile Menu */}
        <div className="flex items-center space-x-3 sm:space-x-5">
         <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
  <Link
    href={bookingLink}
    className={`flex items-center justify-center gap-2 border-2 
      rounded-full transition-colors duration-200 
      text-[0.7rem] sm:text-[0.8rem] md:text-[0.9rem] lg:text-[1rem]
      px-3 sm:px-4 md:px-6 py-1 sm:py-1.5 md:py-2
      min-w-[80px] sm:min-w-[100px] md:min-w-[120px]
      ${linkHoverClass}`}
  >
    Book Now <FaBed className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5"/>
  </Link>
</motion.div>


          <HiBars3BottomRight
            onClick={openNav}
            className={`w-7 h-7 sm:w-8 sm:h-8 cursor-pointer 
              ${linkTextClass}
              lg:hidden
              max-[1254px]:block
              min-[1255px]:block`}
          />
        </div>
      </div>

      {/* Curved SVG Background */}
      <div className="absolute top-0 left-0 w-full overflow-visible -z-50 pointer-events-none hidden lg:block">
        <svg
          className="hidden 
            lg:block 
            max-[1254px]:hidden
            min-[1255px]:hidden
            absolute top-0 left-0 w-full overflow-visible -z-50 pointer-events-none"
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            width: scrolled ? "250%" : "40%",
            height:
              windowWidth >= 1536
                ? scrolled
                  ? "105px"
                  : "100px"
                : windowWidth >= 1280
                ? scrolled
                  ? "110px"
                  : "95px"
                : windowWidth >= 1024
                ? scrolled
                  ? "108px"
                  : "80px"
                : scrolled
                ? "20px"
                : "10px",
            transition: "width 1200ms ease, height 1200ms ease",
          }}
          viewBox="0 0 1007 108"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d={svgPaths.p1c2d4700}
            fill={scrolled ? "#ffffff" : "rgba(255,255,255,0.1)"}
            className="transition-all duration-500 ease-in-out"
          />
        </svg>
      </div>
    </motion.div>
  );
};

export default Nav;
