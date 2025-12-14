// path: data/about.ts
import { FaLeaf, FaHandHoldingHeart, FaGlobeAsia } from "react-icons/fa";

export const aboutData = {
  hero: {
    title: "Rooted in Nature",
    subtitle: "A sanctuary built not just on the land, but of the land.",
    image: "/images/AboutUs/about-hero.JPG", // Ensure this image exists
  },
  mission: {
    title: "Our Purpose",
    text: "Scenic Cottage was born from a simple belief: that luxury shouldn't whisper, it should breathe. We didn't want to build a hotel that blocks the view; we wanted to build one that becomes part of it. Located in the shadow of Sigiriya, we are a tribute to the raw beauty of Sri Lanka's cultural triangle.",
    quote: "We borrow from nature, we do not take.",
  },
  values: [
    {
      id: 1,
      title: "Sustainability First",
      description: "We operate with a zero-plastic policy and maintain the greenary environment of our property.",
      icon: FaLeaf,
    },
    {
      id: 2,
      title: "Community Heart",
      description: "From our chefs to our guides, we hire locally to uplift the Sigiriya village economy.",
      icon: FaHandHoldingHeart,
    },
    {
      id: 3,
      title: "Mindful Living",
      description: "Our spaces are designed to help you disconnect from the digital world and reconnect with yourself.",
      icon: FaGlobeAsia,
    },
  ],
  stats: [
    { id: 1, value: "5", label: "Private Cottages" },
    { id: 2, value: "160+", label: "Bird Species Nearby" },
    { id: 3, value: "100%", label: "Organic Garden" },
    { id: 4, value: "0", label: "Single-Use Plastic" },
  ],
  // "The Experience" section (Image + Text ZigZag)
  philosophy: {
    title: "Designed by Nature",
    description: "Every beam of wood and stone in our cottage has a story. We utilized reclaimed timber from old colonial houses and natural stone from the surrounding quarries to ensure our footprint remained light, while our aesthetic remained timeless.",
    image: "/images/AboutUs/philosophy.JPG", 
  }
};