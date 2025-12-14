import React from 'react';

const Hero = () => {
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/Places/places.jpg')" }} // 👈 change path if needed
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Centered Text */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-[10vh]">

        {/* Sub-Heading */}
        <p className="text-white/90 text-sm sm:text-base font-sfpro font-bold uppercase tracking-[0.3em] mb-6">
          Discover Wonders Around Sigiriya
        </p>

        {/* Main Heading */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-medium leading-tight drop-shadow-lg font-serif">
          Explore Nature & History
        </h1>

        {/* Optional Sub Text (if you want like your previous right-side text) */}
        <p className="mt-6 text-white/80 text-base sm:text-lg md:text-xl max-w-2xl mx-auto drop-shadow">
          Explore the best attractions and hidden gems around Sigiriya for locals and tourists alike.
        </p>

      </div>

    </div>
  );
};

export default Hero;
