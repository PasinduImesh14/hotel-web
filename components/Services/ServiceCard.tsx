"use client";
import React from 'react';
import Image from 'next/image';
import { FaCheck, FaArrowRight } from 'react-icons/fa';
import { Service } from '@/data/services'; 
import Link from 'next/link'; // ✅ Import Link

type Props = {
  service: Service;
  index: number;
};

const ServiceCard = ({ service, index }: Props) => {
  const isReversed = index % 2 !== 0;

  return (
    <div className="w-full bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 border border-gray-100">
      <div className={`flex flex-col lg:flex-row ${isReversed ? 'lg:flex-row-reverse' : ''} min-h-[450px]`}>
        
        {/* ============ IMAGE SECTION ============ */}
        <div className="w-full lg:w-1/2 relative h-[300px] lg:h-auto overflow-hidden group">
         <Image
  src={service.image}
  alt={service.title}
  fill
  sizes="(max-width: 1024px) 100vw, 50vw"
  quality={90}
  className="object-cover transition-transform duration-700 group-hover:scale-110"
/>

          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500"></div>
        </div>

        {/* ============ CONTENT SECTION ============ */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 lg:p-16 bg-white relative">
          
          <p className="text-6xl font-serif text-gray-100 font-bold absolute top-4 right-6 select-none">
            0{service.id}
          </p>

          <p className="text-[#007326] font-bold uppercase tracking-widest text-xs mb-4">
            Scenic Experiences
          </p>

          <h3 className="text-3xl sm:text-4xl font-serif font-medium text-gray-900 mb-6">
            {service.title}
          </h3>

          <p className="text-gray-500 text-base sm:text-lg leading-relaxed mb-8 font-light">
            {service.description}
          </p>

          {/* Features List */}
          <div className="space-y-3 mb-10">
            {service.features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-gray-600 font-medium text-sm">
                <div className="w-6 h-6 rounded-full bg-[#D1E7DD] flex items-center justify-center text-[#007326]">
                  <FaCheck className="text-[10px]" />
                </div>
                {feature}
              </div>
            ))}
          </div>

          {/* ✅ Changed button to Link pointing to #amenities-section */}
          <Link 
            href="#amenities-section"
            className="self-start flex items-center gap-2 text-gray-900 border-b-2 border-gray-200 pb-1 hover:border-[#007326] hover:text-[#007326] transition-all duration-300 font-semibold text-sm uppercase tracking-wider cursor-pointer"
          >
            Explore More <FaArrowRight className="text-xs" />
          </Link>

        </div>
      </div>
    </div>
  );
};

export default ServiceCard;