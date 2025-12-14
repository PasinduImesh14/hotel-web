"use client";

import { navLinks } from "@/constant/navLinks";
import { usePathname, useRouter } from "next/navigation";
import { HotelDetails } from "@/data/hotelInfo";

import {
  X,
  Home,
  BedDouble,
  Settings,
  MapPin,
  Info,
  Calendar,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import React from "react";

const PRIMARY_GREEN = "#007326";

const iconMap: Record<string, React.ReactNode> = {
  Home: <Home className="w-5 h-5" style={{ color: PRIMARY_GREEN }} />,
  Rooms: <BedDouble className="w-5 h-5" style={{ color: PRIMARY_GREEN }} />,
  Services: <Settings className="w-5 h-5" style={{ color: PRIMARY_GREEN }} />,
  Places: <MapPin className="w-5 h-5" style={{ color: PRIMARY_GREEN }} />,
  "About Us": <Info className="w-5 h-5" style={{ color: PRIMARY_GREEN }} />,
  Booking: <Calendar className="w-5 h-5" style={{ color: PRIMARY_GREEN }} />,
};

type Props = {
  showNav: boolean;
  closeNav: () => void;
};

const MobileNav: React.FC<Props> = ({ showNav, closeNav }) => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <AnimatePresence>
      {showNav && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/80 z-[1001]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeNav}
          />

          {/* Slide Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="
              fixed top-0 right-0 h-full 
              w-3/4 max-w-sm
              bg-black/50
              border-l border-gray-800
              z-[1050]
              flex flex-col
              p-8 pt-20 pb-10
              backdrop-blur-sm
            "
          >
            {/* Brand */}
            <div className="absolute top-6 left-8 flex items-baseline">
              <span className="text-white text-3xl font-semibold">Scenic</span>
              <span
                className="ml-1 font-normal text-base"
                style={{ color: PRIMARY_GREEN }}
              >
                Cottage
              </span>
            </div>

            {/* Close Button */}
            <X
              onClick={closeNav}
              className="absolute top-6 right-6 w-8 h-8 cursor-pointer hover:rotate-90 transition-all duration-300"
              style={{ color: PRIMARY_GREEN }}
            />

            {/* Navigation Items */}
            <div className="mt-20 flex flex-col space-y-3 overflow-y-auto">
              {navLinks.map((link) => {
                const isActive = pathname === link.url;

                return (
                  <motion.div
                    key={link.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      router.push(link.url);
                      closeNav();
                    }}
                    className={`
                      flex items-center space-x-4
                      rounded-xl py-3.5 px-4 cursor-pointer
                      transition-all duration-200
                      ${
                        isActive
                          ? "bg-[#1a1a1a] ring-2"
                          : "bg-[#0d0d0d] border border-gray-800 hover:bg-[#1a1a1a]"
                      }
                    `}
                    style={isActive ? { borderColor: PRIMARY_GREEN } : {}}
                  >
                    <div
                      className="
                        w-10 h-10 rounded-full 
                        bg-[#161616]
                        border border-gray-700
                        flex items-center justify-center
                      "
                    >
                      {iconMap[link.label]}
                    </div>

                    <p
                      className={`text-lg font-medium ${
                        isActive ? "text-white" : "text-gray-300"
                      }`}
                    >
                      {link.label}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="mt-auto text-center pt-10 border-t border-gray-800">
              <p className="text-gray-400 text-sm tracking-wide">
                Ready to book?
              </p>
              <p
                className="mt-1 tracking-widest text-base font-semibold"
                style={{ color: PRIMARY_GREEN }}
              >
                {HotelDetails.email}
                <br />
                {HotelDetails.contact}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileNav;
