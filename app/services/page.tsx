// path: app/services/page.tsx
import React from 'react';
import Image from 'next/image';
import { servicesData } from '@/data/services';
import ServiceCard from '@/components/Services/ServiceCard';
// import ResponsiveNav from '@/components/Helper/Navbar/ResponsiveNav'; // Uncomment if needed locally
import NewsletterSignup from '@/components/Home/NewsletterSignup/NewsletterSignup';
// ✅ Import the new Amenities Section
import AmenitiesSection from '@/components/Services/AmenitiesSection';

const ServicesPage = () => {
  return (
    <div className="overflow-hidden">
      
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center">
        <Image 
            src="/images/Services/service-hero.jpg"
            alt="Services Hero"
            fill
            priority // ⚡ Loads immediately
            className="object-cover object-center"
            quality={90}
          />
          <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-[10vh]">
          <p className="text-white/90 text-sm sm:text-base font-bold uppercase tracking-[0.3em] mb-6 animate-fadeIn">
            Indulge & Explore
          </p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-white font-medium mb-8 leading-tight drop-shadow-lg">
            Our Premium Services
          </h1>
          <p className="text-white/80 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
            From curated culinary journeys to guided wilderness adventures, 
            experience the very best of Sigiriya hospitality.
          </p>
        </div>
      </div>

      {/* 1. Curated Experiences (Zig-Zag Cards) */}
      <section className="bg-gray-50 py-24 lg:py-32">
        <div className="w-[90%] md:w-[85%] xl:w-[75%] mx-auto flex flex-col gap-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 mb-6">
              Curated Experiences
            </h2>
            <div className="w-24 h-1 bg-[#007326] mx-auto rounded-full"></div>
          </div>
          {servicesData.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </section>

      {/* 2. ✅ NEW: Detailed Amenities Section */}
      <AmenitiesSection />


      {/* 4. Newsletter */}
      <NewsletterSignup />

    </div>
  );
};

export default ServicesPage;