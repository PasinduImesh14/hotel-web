"use client";
import React from "react";
import { motion } from "motion/react";
import CarRentalSharpIcon  from '@mui/icons-material/CarRentalSharp';
import SecuritySharpIcon from '@mui/icons-material/SecuritySharp';
import ExploreSharpIcon from '@mui/icons-material/ExploreSharp';
import FireTruckSharpIcon from '@mui/icons-material/FireTruckSharp';
import VolunteerActivismSharpIcon from '@mui/icons-material/VolunteerActivismSharp';

interface Item {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function CoveredSection() {
  const items: Item[] = [
    {
      icon:  <SecuritySharpIcon sx={{ fontSize: 80 }} />,
      title: "Safety First",
      description:
        "Your security is our priority. Stay worry-free with our safe and well-managed environment.",
    },
    {
      icon: <CarRentalSharpIcon sx={{ fontSize: 80 }} />,
      title: "Vehicle Rental Support",
      description:
        "Easily rent cars, bikes, or tuk-tuks to explore Sigiriya and surrounding areas.",
    },
    {
      icon: < ExploreSharpIcon sx={{ fontSize: 80 }} />,
      title: "Guide Support",
      description:
        "Local guides available to help you discover hidden gems and cultural experiences.",
    },
    {
      icon: < FireTruckSharpIcon sx={{ fontSize: 80 }}  />,
      title: "Additional Support",
      description:
        "From luggage help to on-demand assistance, we’re here to make your stay smooth and comfortable.",
    },
    {
      icon: <VolunteerActivismSharpIcon sx={{ fontSize: 80 }} />,
      title: "Friendly Environment",
      description:
        "Experience warm Sri Lankan hospitality with a welcoming and relaxed atmosphere.",
    },
  ];

  return (
    <section className="bg-[#003B14] text-white py-16 px-6 md:px-16 text-center">
      <h2 className="text-3xl md:text-6xl mb-12">
        We've Got You Covered
      </h2>

      {/* First Row (3 Items) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 justify-items-center">
        {items.slice(0, 3).map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.15 }}
            whileHover={{ y: -10 }}
            className="flex flex-col items-center max-w-xs text-center space-y-4 cursor-pointer "
          >
            <motion.div
              whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="text-white"
            >
              {item.icon}
            </motion.div>
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 + 0.2 }}
              className=" text-white text-4xl"
            >
              {item.title}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 + 0.3 }}
              className="text-gray-300 text-m"
            >
              {item.description}
            </motion.p>
          </motion.div>
        ))}
      </div>

      {/* Second Row (2 Items) */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-12 justify-items-center">
        {items.slice(3).map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.15 + 0.15 }}
            whileHover={{ y: -10 }}
            className="flex flex-col items-center max-w-xs text-center space-y-4 cursor-pointer"
          >
            <motion.div
              whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="text-white"
            >
              {item.icon}
            </motion.div>
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 + 0.25 }}
              className=" text-4xl"
            >
              {item.title}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 + 0.35 }}
              className="text-gray-300 text-m"
            >
              {item.description}
            </motion.p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
