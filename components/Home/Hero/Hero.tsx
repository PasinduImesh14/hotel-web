"use client";
import React from "react";
import { motion } from "motion/react";
import BookingForm from "./BookingForm";

const Hero = () => {
  return (
    <div className="relative w-full h-[120vh] sm:h-[100vh] overflow-hidden pt-[10vh]">
      <video
        src="/video/hero.mp4"
        autoPlay
        muted
        loop
        preload="metadata"
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black/50" />

      <div className="relative z-10 flex flex-col justify-start h-full px-4 py-8 sm:px-6 md:px-12 lg:px-20 xl:px-32 text-white">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-sfpro font-medium text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-snug bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text drop-shadow-[0_4px_5px_rgba(0,0,0,0.3)]"
        >
          Your Perfect Getaway <br /> Awaits in Sigiriya
        </motion.h1>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "125px" }}
          transition={{ duration: 1, delay: 0.5 }}
          className="h-1 bg-green-500 mt-4 mb-6 lg:mb-0"
        />

        <motion.div
          className="mt-6 lg:mt-0 lg:absolute lg:right-20 lg:bottom-24 max-w-md flex items-start"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
        >
<motion.div
  className="
    w-1 
    sm:w-1 
    lg:w-1.3 
    bg-green-500 
    mr-3 sm:mr-4 
    origin-bottom 
    h-13 
    sm:h-13
    md:h-13 
    lg:h-25
    xl:h-30
    2xl:h-45 
    flex-shrink-0
  "
  initial={{ scaleY: 0 }}
  animate={{ scaleY: 1 }}
  transition={{ duration: 1, delay: 0.2 }}
/>


          <div className="space-y-3 sm:space-y-4">
            <motion.p
              className="
                font-sfpro font-bold 
                text-[1rem] 
                sm:text-[1.125rem] 
                md:text-[1.25rem] 
                lg:text-[1.5rem] 
                xl:text-[1.75rem] 
                2xl:text-[2rem] 
                leading-snug
              "
            >
              Experience the best cabana lodging near Sigiriya, crafted for your perfect escape.
            </motion.p>

            <motion.p
              className="
                font-sfpro font-medium 
                text-[0.7rem] 
                sm:text-[0.8rem] 
                md:text-[0.9rem] 
                lg:text-[1rem] 
                xl:text-[1.1rem] 
                2xl:text-[1.2rem] 
                leading-relaxed
              "
            >
              No need to worry, your satisfaction is our top priority.
            </motion.p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="
  mt-6         
  sm:mt-8      
  md:mt-10     
  lg:mt-12    
  xl:mt-14  

  md:mb-[50px]


  w-full      
  sm:w-11/12
  md:w-4/5
  lg:w-3/4
  xl:w-3/5
  2xl:w-3.5/4   

  max-w-md    
  sm:max-w-lg
  md:max-w-xl
  lg:max-w-2xl
  xl:max-w-3xl
  2xl:max-w-4xl

  backdrop-blur-[2px] 
  bg-[rgba(29,29,29,0.61)] 
  rounded-[20px] 
  sm:rounded-[25px] 
  md:rounded-[30px]

  p-4          
  sm:p-6
  md:p-8
  lg:p-10
  xl:p-12

  flex flex-col
  gap-4        
  sm:gap-5
  md:gap-6
  lg:gap-7
  xl:gap-8
"

        >
          <BookingForm />
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
