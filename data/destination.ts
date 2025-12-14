// ✅ Places to Visit 
export interface Place {
  id: number;
  name: string;
  image: string;
  lat: number;
  lng: number;
  rating: number;
  reviews: number;
  type: string;
  open: string;
  close: string;
}

export const placesToVisit: Place[] = [

    {
  id: 1,
  name: "Sigiriya Lion Rock",
  image: "/images/Places/Sigiriya.jpeg",
  lat: 7.9571127,
  lng: 80.760257,
  rating: 4.7,
  reviews: 230,
  type: "Rock / Hiking",
  open: "8 AM",
  close: "6 PM"
},

  {
    id: 2,
    name: "Pidurangala Rock",
    image: "/images/Places/pidurangala.jpg",
    lat: 7.9663886,
    lng: 80.7618379,
    rating: 4.7,
    reviews: 230,
    type: "Rock / Hiking",
    open: "8 AM",
    close: "6 PM"
  },
  {
    id: 3,
    name: "Minneriya National Park",
    image: "/images/Places/minneriya.jpg",
    lat: 8.0156443,
    lng: 80.8446703,
    rating: 4.8,
    reviews: 450,
    type: "National Park / Wildlife",
    open: "8 AM",
    close: "5 PM"
  },
  {
    id: 4,
    name: "Dambulla Cave Temple",
    image: "/images/Places/dambulla.jpg",
    lat: 7.8554813,
    lng: 80.6513862,
    rating: 4.6,
    reviews: 320,
    type: "Buddhist Temple",
    open: "8 AM",
    close: "7 PM"
  },
  {
    id: 5,
    name: "Polonnaruwa Ancient City",
    image: "/images/Places/polonnaruwa.jpg",
    lat: 7.9519597,
    lng: 81.0047819,
    rating: 4.7,
    reviews: 410,
    type: "Historical Site",
    open: "8 AM",
    close: "6 PM"
  },
  {
    id: 6,
    name: "Kaudulla National Park",
    image: "/images/Places/kaudulla.jpg",
    lat: 8.1107185,
    lng: 80.8858542,
    rating: 4.5,
    reviews: 220,
    type: "National Park / Wildlife",
    open: "8 AM",
    close: "5 PM"
  },
  {
    id: 7,
    name: "Ritigala Forest Monastery",
    image: "/images/Places/ritigala.jpg",
    lat: 8.1063997,
    lng: 80.6690743,
    rating: 4.6,
    reviews: 180,
    type: "Monastery / Forest",
    open: "8 AM",
    close: "6 PM"
  }
];
