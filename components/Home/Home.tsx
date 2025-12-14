import React from 'react'
import Hero from './Hero/Hero'
import RoomCarousel from './RoomCarousel/RoomCarousel'
import PlacesYouCantMiss from './PlaceYouCantMiss/PlacesYouCantMiss'
import CoveredSection from './CoverwsSection/CoveredSection'
import AboutSection from './AboutSection/AboutSection'
import NewsletterSignup from './NewsletterSignup/NewsletterSignup'

const Home = () => {
  return (
    <div className='overflow-hidden '>

      <Hero />
      <RoomCarousel />
      <PlacesYouCantMiss />
      <CoveredSection />
      <AboutSection />
      <NewsletterSignup />
     
    </div>
  )
}

export default Home
