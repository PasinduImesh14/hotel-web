export interface Kitchen {
  id: number;
  roomId: number;
  diningTable: "YES" | "NO";
  gasCooker: "YES" | "NO";
  riceCooker: "YES" | "NO";
  woodStove: "YES" | "NO";
  fridge: "YES" | "NO";
  electricKettle: "YES" | "NO";
  waterBottle: "YES" | "NO";
}

export interface Bedroom {
  id: number;
  roomId: number;
  bedType: string;
  count: number;
}

export interface Bathroom {
  id: number;
  roomId: number;
  shower: "YES" | "NO";
  slipper: "YES" | "NO";
  soap: "YES" | "NO";
  bidet: "YES" | "NO";
  towels: "YES" | "NO";
  toiletPaper: "YES" | "NO";
  hotWater: "YES" | "NO";
  privateBathroom: "YES" | "NO";
}

export interface BackendRoom {
  id: number;
  name: string;
  cost: number;
  offer: number;
  size: string;
  capacity: number; // ✅ added capacity
  ac: "YES" | "AC" | "NO";
  wifi: "YES" | "NO";
  fan: "YES" | "NO";
  balcony: "YES" | "NO";
  gardenView: "YES" | "NO";
  tv: "YES" | "NO";
  iron: "YES" | "NO";
  locker: "YES" | "NO";
  parking: "YES" | "NO";
  sittingArea: "YES" | "NO";
  dryingRack: "YES" | "NO";
  clothRack: "YES" | "NO";
  img1: string | null;
  img2: string | null;
  img3: string | null;
  img4: string | null;
  bedrooms: Bedroom[];
  bathrooms: Bathroom[];
  kitchen: Kitchen | null; // ✅ Single object, can be null
}
