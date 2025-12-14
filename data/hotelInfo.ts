export interface HotelInfo {
  name: string;
  location: string;
  contact: string;
  email: string;
  image: string;
  description: string;
  rating: number;
  checkIn: string;
  checkOut: string;
  facilities: string[];
  address: string;
  website?: string;
  whatsapp?: string;
}

export const HotelDetails: HotelInfo = {
  name: "The Grand Resort",
  location: "Colombo, Sri Lanka",
  contact: "+94 740558858",
  email: "sceniccottagesigiriya@gmail.com",
  image: "/images/Rooms/R5.png",

  description:
    "The Grand Resort is a luxury property located in the heart of Colombo offering modern rooms, ocean views, fine dining, and world-class hospitality.",

  rating: 4.8,

  checkIn: "2:00 PM",
  checkOut: "11:00 AM",

  facilities: [
    "Free WiFi",
    "Swimming Pool",
    "Spa & Wellness Center",
    "Air Conditioning",
    "Room Service",
    "Gym Access",
    "Restaurant & Bar",
    "Free Parking",
  ],

  address: "123 Marine Drive, Colombo 03, Sri Lanka",

  website: "https://www.sceniccottage.com",
  whatsapp: "+94 740558858",
};
