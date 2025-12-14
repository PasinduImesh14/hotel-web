"use client";
import React from 'react';
import { amenitiesData } from '@/data/amenities';
import { motion } from 'framer-motion';

const AmenitiesSection = () => {
  return (
    // ✅ ADDED id="amenities-section" here
    <section id="amenities-section" className="py-24 bg-white relative overflow-hidden scroll-mt-24">
      {/* Background Pattern */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      <div className="w-[90%] md:w-[85%] xl:w-[75%] mx-auto relative z-10">
        {/* ... rest of your code stays exactly the same ... */}
        <div className="text-center mb-16">
          <p className="text-[#007326] font-bold uppercase tracking-widest text-sm mb-3">
            Everything You Need
          </p>
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6">
            Comprehensive Facilities
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            We have curated every detail to ensure your stay in Sigiriya is as comfortable as it is memorable.
          </p>
        </div>

        {/* Grid code... */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {amenitiesData.map((section, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 border border-gray-100 group"
            >
              {/* Icon Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#D1E7DD] text-[#007326] flex items-center justify-center text-xl group-hover:bg-[#007326] group-hover:text-white transition-colors duration-300">
                  <section.icon />
                </div>
                <h3 className="text-xl font-serif font-bold text-gray-900">
                  {section.category}
                </h3>
              </div>

              {/* List Items */}
              <ul className="space-y-3">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-600 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#007326] mt-2 flex-shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default AmenitiesSection;