"use client";

import { HotelDetails } from "@/data/hotelInfo";
import {
  X,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
// Using react-icons/fa for correct brand icons
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

const PRIMARY_GREEN = "#007326";

type Props = {
  showNav: boolean;
  closeNav: () => void;
};

const MobileNav: React.FC<Props> = ({ showNav, closeNav }) => {
  return (
    <AnimatePresence>
      {showNav && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/60 z-[1001] backdrop-blur-[2px]"
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
            transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
            className="
              fixed top-0 right-0 h-full 
              w-[85%] max-w-sm
              bg-white
              shadow-2xl
              z-[1050]
              flex flex-col
              p-6
            "
          >
            {/* Header: Brand & Close */}
            <div className="flex items-center justify-between mb-8 mt-4">
               <div className="flex flex-col">
                  <div className="flex items-baseline leading-none">
                    <span className="text-2xl font-semibold text-[#003b14]">Scenic</span>
                    <span className="ml-1 text-sm text-[#007326]">Cottage</span>
                  </div>
                  <span className="text-[0.5rem] tracking-[0.4em] text-[#003b14] mt-1 ml-0.5">SIGIRIYA</span>
               </div>

               <div 
                 onClick={closeNav}
                 className="p-2 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
               >
                 <X className="w-6 h-6 text-gray-600" />
               </div>
            </div>

            {/* --- CONTENT SECTION --- */}
            <div className="flex flex-col space-y-6">
              
              {/* Contact Information */}
              <div>
                <h3 className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-4">Contact Us</h3>
                <div className="space-y-3">
                  {/* Phone */}
                  <div className="flex items-center space-x-3 p-3 rounded-xl bg-green-50/50 border border-green-100">
                    <div className="p-2 bg-white rounded-full shadow-sm text-[#007326] shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Call us anytime</p>
                      <p className="text-sm font-semibold text-gray-800">{HotelDetails.contact || "+94 123 456 789"}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center space-x-3 p-3 rounded-xl bg-green-50/50 border border-green-100">
                    <div className="p-2 bg-white rounded-full shadow-sm text-[#007326] shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500">Send an email</p>
                      {/* break-all prevents overflow */}
                      <p className="text-sm font-semibold text-gray-800 break-all leading-tight">
                        {HotelDetails.email || "info@sceniccottage.com"}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center space-x-3 p-3 rounded-xl bg-green-50/50 border border-green-100">
                    <div className="p-2 bg-white rounded-full shadow-sm text-[#007326] shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Visit us</p>
                      <p className="text-sm font-semibold text-gray-800">Sigiriya, Sri Lanka</p>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Social Media Links */}
              <div>
                <h3 className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-4">Follow Us</h3>
                <div className="grid grid-cols-3 gap-3">
                  {/* Facebook */}
                  <a href="https://www.facebook.com/profile.php?id=61584030851166" className="flex flex-col items-center justify-center p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 transition-colors group">
                    <FaFacebookF className="w-5 h-5 text-blue-600 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-[0.65rem] font-medium text-gray-600">Facebook</span>
                  </a>

                  {/* Instagram */}
                  <a href="https://www.instagram.com/sceniccottage?igsh=MWVjN3RnejJybWs4Ng==" className="flex flex-col items-center justify-center p-3 rounded-2xl bg-pink-50 hover:bg-pink-100 transition-colors group">
                    <FaInstagram className="w-5 h-5 text-pink-600 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-[0.65rem] font-medium text-gray-600">Instagram</span>
                  </a>

                  {/* TikTok */}
                  <a href="https://vm.tiktok.com/ZSHTowswjEYM7-r5jAk/" className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-colors group">
                    <FaTiktok className="w-5 h-5 text-black mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-[0.65rem] font-medium text-gray-600">TikTok</span>
                  </a>
                </div>
              </div>

            </div>
            
            {/* Bottom Decoration */}
            <div className="mt-auto pt-6">
               <p className="text-center text-[0.6rem] text-gray-300">© 2025 Scenic Cottage Sigiriya</p>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileNav;