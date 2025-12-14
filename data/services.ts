export interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
  icon: string;
  features: string[];
}

export const servicesData: Service[] = [
  {
    id: 1,
    title: "Comfortable Accomodations",
    description: "Scenic Cottage Sigiriya in Sigiriya offers family rooms with air-conditioning, balconies, and private bathrooms. Each room includes a tea and coffee maker, free toiletries, and a work desk.",
    image: "/images/Services/accomadation.jpg", 
    icon: "spa",
    features: ["Double Rooms", "Family Rooms", "Room Service"],
  },
  {
    id: 2,
    title: "Authentic Dining",
    description: "A breakfast buffet featuring local specialities, juice and fruits is served daily. Room service and a 24-hour front desk enhance the stay.",
    image: "/images/Services/dining.jpg", 
    icon: "dining",
    features: ["Organic Ingredients", "Dining Area", "In-Room Dining"],
  },
  {
    id: 3,
    title: "Wildlife Safaris",
    description: "Embark on a thrilling adventure to nearby Minneriya or Kaudulla National Parks. Witness the gathering of majestic elephants and explore the rich biodiversity of the cultural triangle.",
    image: "/images/Services/safari.jpg", 
    icon: "safari",
    features: ["Private Jeep", "Expert Guide", "Refreshments Included"],
  },
  {
    id: 4,
    title: "Cultural Excursions",
    description: "Discover the ancient secrets of Sigiriya and Pidurangala. We organize guided tours, village walks, and bicycle rentals for you to explore the historic surroundings at your own pace.",
    image: "/images/Services/culture.jpg", 
    icon: "culture",
    features: ["Guided Rock Climb", "Village Walk", "Bicycle Rental"],
  }
];