"use client";

import { navLinks } from "@/constant/navLinks";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaBed } from "react-icons/fa";
import { HiBars3BottomRight } from "react-icons/hi2";
import { motion } from "motion/react";
import svgPaths from "./svgpath";
import { Home, BedDouble, Settings, MapPin, Info, Calendar } from "lucide-react";
import { usePathname } from "next/navigation";

// --- Configuration ---
const PRIMARY_GREEN = "#007326";
const DARK_GREEN = "#003b14";

const iconMap: Record<string, React.ReactNode> = {
  Home: <Home className="w-3.5 h-3.5" />,
  Rooms: <BedDouble className="w-3.5 h-3.5" />,
  Services: <Settings className="w-3.5 h-3.5" />,
  Places: <MapPin className="w-3.5 h-3.5" />,
  "About Us": <Info className="w-3.5 h-3.5" />,
  Booking: <Calendar className="w-3.5 h-3.5" />,
};

type Props = {
  openNav: () => void;
};

const Nav = ({ openNav }: Props) => {
  const [scrolled, setScrolled] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const pathname = usePathname();

  const bookingLink = navLinks.find((link) => link.url === "/booking")?.url || "/booking";

  const isMobile = windowWidth < 1024;
  const navBackground = isMobile 
    ? "bg-white shadow-sm"  
    : scrolled 
      ? "bg-white"          
      : "bg-transparent";   

  const linkTextClass = (isMobile || scrolled) ? "text-[#003b14]" : "text-white";
  const linkHoverClass = (isMobile || scrolled)
    ? "border-[#003b14] text-[#003b14] hover:bg-[#003b14] hover:text-white"
    : "border-white text-white hover:bg-white hover:text-black";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateWidth = () => setWindowWidth(window.innerWidth);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const getLinkFontSize = () => {
    if (windowWidth > 1600) return "0.9rem";
    if (windowWidth > 1400) return "0.8rem";
    if (windowWidth > 1254) return "0.7rem";
    if (windowWidth > 1030) return "0.55rem";
    if (windowWidth > 768) return "0.5rem";
    return "0.75rem";
  };

  return (
    <motion.div
      className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-300 ${navBackground}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* UPDATED: Changed lg:h-[12vh] to lg:h-[10vh] to reduce desktop height */}
      <div className="relative z-10 flex flex-col justify-center w-[92%] md:w-[88%] xl:w-[80%] mx-auto transition-colors duration-300 pt-2 pb-1 lg:pt-2 lg:pb-2 lg:h-[10vh]">
        
        {/* ============ TOP ROW ============ */}
        <div className="flex items-center justify-between w-full mb-1 lg:mb-0">
          
          {/* Logo Section */}
          <motion.div className="flex flex-col items-center justify-center cursor-pointer" whileHover={{ scale: 1.05 }}>
            <div className="flex items-baseline leading-none">
              <span className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold ${linkTextClass}`}>
                Scenic
              </span>
              <span className={`ml-1 font-normal text-xs sm:text-sm md:text-lg lg:text-xl ${linkTextClass}`}>
                Cottage
              </span>
            </div>
            <div className={`w-full flex justify-between ${linkTextClass} mt-[1px] sm:mt-[2px]`}>
              {["S", "I", "G", "I", "R", "I", "Y", "A"].map((letter, i) => (
                <span key={i} className="text-[0.4rem] sm:text-[0.5rem] md:text-[0.6rem] lg:text-[0.75rem] font-medium">
                  {letter}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Desktop Links */}
          <div
            className="hidden lg:flex items-center justify-center absolute left-1/2 -translate-x-1/2"
            style={{
              gap: windowWidth >= 1536 ? (scrolled ? "3rem" : "2rem") : windowWidth >= 1280 ? (scrolled ? "2.2rem" : "1.4rem") : (scrolled ? "1.4rem" : "1rem"),
              maxWidth: windowWidth >= 1536 ? "900px" : windowWidth >= 1280 ? "750px" : "620px",
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
                  style={{ fontSize: getLinkFontSize() }}
                >
                  {link.label}
                </p>
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            <motion.div className="hidden lg:block" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href={bookingLink}
                className={`flex items-center justify-center gap-2 border-2 rounded-full px-6 py-2 text-sm font-medium transition-colors duration-200 
                ${linkHoverClass}`}
              >
                Book Now <FaBed className="w-4 h-4" />
              </Link>
            </motion.div>

            <HiBars3BottomRight
              onClick={openNav}
              className={`w-7 h-7 sm:w-8 sm:h-8 cursor-pointer lg:hidden ${linkTextClass}`}
            />
          </div>
        </div>

        {/* ============ MOBILE SCROLL MENU ============ */}
        <div className="lg:hidden w-full overflow-x-auto no-scrollbar pb-0.5">
          <div className="flex space-x-2 whitespace-nowrap px-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.url;
              return (
                <Link href={link.url} key={link.id}>
                   <div 
                     className={`
                       flex items-center space-x-1.5 px-3 py-1 rounded-full border text-xs font-medium transition-all duration-200
                       ${isActive 
                         ? `bg-[${PRIMARY_GREEN}] border-[${PRIMARY_GREEN}] text-white` 
                         : `bg-transparent border-gray-300 text-[${DARK_GREEN}] hover:bg-gray-50`
                       }
                     `}
                   >
                      {iconMap[link.label] && React.cloneElement(iconMap[link.label] as React.ReactElement, {
                          className: `w-3.5 h-3.5 ${isActive ? 'text-white' : `text-[${PRIMARY_GREEN}]`}`
                      })}
                      <span>{link.label}</span>
                   </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* SVG Background (Desktop Only) */}
      <div className="absolute top-0 left-0 w-full overflow-visible -z-50 pointer-events-none hidden lg:block">
        <svg
          className="absolute top-0 left-0 w-full overflow-visible -z-50 pointer-events-none"
          style={{
             left: "50%",
             transform: "translateX(-50%)",
             width: scrolled ? "250%" : "40%",
             // UPDATED: Reduced the SVG height values (from 105px/100px to 90px/85px) 
             // to match the new shorter 10vh navbar height.
             height: windowWidth >= 1536 ? (scrolled ? "90px" : "85px") : (scrolled ? "90px" : "85px"),
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