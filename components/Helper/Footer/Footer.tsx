"use client";

import React from "react";
import { FaPhoneAlt, FaTiktok, FaFacebookF, FaInstagram } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation"; 
import { navLinks } from "@/constant/navLinks";
import { socialLinks } from "@/constant/socialLinks";

const Footer: React.FC = () => {
  const pathname = usePathname();
  const hideFooter = pathname.startsWith("/admin"); // hide footer on admin pages

  if (hideFooter) return null; // <-- hide footer

  return (
    <footer className="bg-white w-full py-16">
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-4xl md:text-5xl font-bold text-center text-[#003b14]"
      >
        Scenic Cottage
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center text-lg md:text-xl text-gray-600 mt-2"
      >
        Where nature, comfort, and warm Sri Lankan hospitality meet.
      </motion.p>

      {/* Contact Info */}
      <div className="flex flex-col items-center justify-center gap-4 text-[#007326] text-sm md:text-lg mt-6">
        <div className="flex items-center gap-2">
          <IoLocationSharp />
          <span>Sigiriya Road, Inamaluwa, 21124 Sigiriya, Sri Lanka</span>
        </div>
        <div className="flex items-center gap-2">
          <FaPhoneAlt />
          <span>+9474 055 8858</span>
        </div>
      </div>

      {/* Bottom Divider */}
      <div className="w-10/12 mx-auto h-[1px] bg-gray-300 my-6"></div>

      {/* Bottom Row */}
<div className="flex flex-col md:flex-row items-center justify-between w-10/12 mx-auto text-sm md:text-base text-gray-600 gap-4 md:gap-0">

  {/* Social Icons */}
<div className="flex gap-3 order-1 md:order-3">
  {socialLinks.map((social) => {
    const Icon = social.Icon;
    return (
      <motion.a
        key={social.id}
        href={social.url}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.2, y: -2 }}
        className="p-2 border border-gray-200 rounded-full cursor-pointer"
      >
        <Icon className="text-[#007326]" />
      </motion.a>
    );
  })}
</div>

  {/* Links */}
  <div className="flex gap-6 text-[#007326] order-2 md:order-2 ">
    {navLinks.slice(0, 5).map((link) => (
      <motion.a
        key={link.id}
        href={link.url}
        whileHover={{ y: -2, color: "#005a1b" }}
        className="cursor-pointer transition-colors"
      >
        {link.label}
      </motion.a>
    ))}
  </div>

  {/* Copyright + Credits */}
  <div className="py-6 text-center text-gray-600 text-sm md:text-base order-3 md:order-1">
 <p>
  © 2026 Scenic Cottage.<br />
  All rights reserved.
</p>

    <p className="mt-1 text-xs sm:text-sm text-gray-500">
      Crafted with care by{" "}
      <a
        href="https://pentarixlabs.com"
        target="_blank"
        className="underline hover:text-[#005a1b] transition-colors"
      >
        Pentarix Labs
      </a>
    </p>
  </div>

</div>

    </footer>
  );
};

export default Footer;
