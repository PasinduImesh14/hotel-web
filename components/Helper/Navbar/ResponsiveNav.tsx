"use client";
import React, { useState } from 'react'
import { usePathname } from 'next/navigation' // <-- added
import Nav from './Nav'
import MobileNav from './MobileNav'

const ResponsiveNav = () => {
  const pathname = usePathname()
  const hideNav = pathname.startsWith("/admin") // hide navbar on admin pages

  const [showNav, setShowNav]= useState(false)
  const handleNavShow = ()=>setShowNav(true)
  const handleCloseNav =() => setShowNav(false)

  if (hideNav) return null // <-- hide navbar on admin

  return (
    <div>
      <Nav openNav={handleNavShow} />
      <MobileNav showNav={showNav} closeNav={handleCloseNav} />
    </div>
  )
}

export default ResponsiveNav
