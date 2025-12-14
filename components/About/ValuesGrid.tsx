"use client";
import React from "react";
import { aboutData } from "@/data/about";
import { motion } from "framer-motion";

const ValuesGrid = () => {
  return (
    <section className="py-24 bg-white">
      <div className="w-[90%] md:w-[85%] xl:w-[75%] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {aboutData.values.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="text-center group"
            >
              <div className="w-16 h-16 mx-auto bg-gray-50 rounded-full flex items-center justify-center text-[#007326] text-2xl mb-6 group-hover:bg-[#007326] group-hover:text-white transition-colors duration-500">
                <item.icon />
              </div>
              <h3 className="text-2xl font-serif text-gray-900 mb-4">{item.title}</h3>
              <p className="text-gray-500 leading-relaxed font-light">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesGrid;