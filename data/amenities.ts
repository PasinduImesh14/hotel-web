// path: data/amenities.ts
import { FaWifi, FaTree, FaUtensils, FaShuttleVan, FaShieldAlt, FaBed, FaTv, FaConciergeBell, FaHome } from "react-icons/fa";

export const amenitiesData = [
  {
    category: "Most Popular",
    icon: FaHome, 
    items: ["Tiled floors", "Free Private Parking", "Excellent Breakfast", "Family Rooms", "Tea/Coffee Maker in All Rooms"]
  },
  {
    category: "Outdoors & View",
    icon: FaTree,
    items: ["Lush Garden", "Private Terrace", "Balcony", "Outdoor Furniture", "Garden View", "Scenic Surroundings"]
  },
  {
    category: "Food & Dining",
    icon: FaUtensils,
    items: ["Daily Breakfast Buffet", "Room Service", "Local Specialties", "Dining Area", "Electric Kettle", "Tea/Coffee Maker"]
  },
  {
    category: "Services & Convenience",
    icon: FaConciergeBell,
    items: ["24-Hour Front Desk", "Shuttle Service (Free)", "Daily Housekeeping", "Laundry Service", "Private Check-in/out"]
  },
  {
    category: "Comfort & Living",
    icon: FaBed,
    items: ["Air Conditioning", "Private Bathroom", "Free Toiletries", "Towels", "Ironing Facilities"]
  },
  {
    category: "Safety & Tech",
    icon: FaShieldAlt,
    items: ["Safe Deposit Box", "24-Hour Security", "Flat-screen TV", "Satellite Channels", "No Internet Access Issues"]
  }
];