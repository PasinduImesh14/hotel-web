"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../dashboard/Sidebar";
import { useRouter } from "next/navigation";

interface Bedroom {
  id: number;
  roomId: number;
  bedType: string;
  count: number;
}

interface Bathroom {
  id: number;
  roomId: number;
  shower: string;
  slipper: string;
  soap: string;
  bidet: string;
  towels: string;
  toiletPaper: string;
  hotWater: string;
  privateBathroom: string;
}

interface Kitchen {
  fridge?: string;
  microwave?: string;
  electricKettle?: string;
  diningTable?: string;
}

interface Room {
  id: number;
  name: string;
  cost: number;
  offer: number;
  size: string;
  ac: string;
  wifi: string;
  fan: string;
  balcony: string;
  gardenView: string;
  tv: string;
  iron: string;
  locker: string;
  parking: string;
  sittingArea: string;
  dryingRack: string;
  clothRack: string;

  video?: string | null;
  bedrooms: Bedroom[];
  bathrooms: Bathroom[];
  kitchen: Kitchen | null;
}

export default function ViewRoomsTablePage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchRooms = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("/api/rooms", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch rooms");

      setRooms(data.rooms);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this room?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`/api/rooms?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");

      alert("Room deleted successfully");
      fetchRooms();
    } catch (err: any) {
      alert(err.message || "Unknown error");
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-600 animate-pulse text-lg">Loading rooms...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-500 bg-red-50 px-6 py-3 rounded shadow">{error}</p>
      </div>
    );

  const amenityLabels: Record<string, string> = {
    wifi: "WiFi",
    ac: "AC",
    fan: "Fan",
    balcony: "Balcony",
    gardenView: "Garden View",
    tv: "TV",
    iron: "Iron",
    locker: "Locker",
    parking: "Parking",
    sittingArea: "Sitting Area",
    dryingRack: "Drying Rack",
    clothRack: "Cloth Rack",
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-6 overflow-x-auto">
        <h1 className="text-3xl font-bold mb-6 text-green-700">All Rooms</h1>

        <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
          <thead className="bg-green-100">
            <tr>
              <th className="py-2 px-3 text-left">ID</th>
              <th className="py-2 px-3 text-left">Name</th>
              <th className="py-2 px-3 text-left">Cost</th>
              <th className="py-2 px-3 text-left">Offer</th>
              <th className="py-2 px-3 text-left">Size (m²)</th>
              <th className="py-2 px-3 text-left">Capacity</th>
              <th className="py-2 px-3 text-left">Bedrooms</th>
              <th className="py-2 px-3 text-left">Bathrooms</th>
              <th className="py-2 px-3 text-left">Amenities</th>
              <th className="py-2 px-3 text-left">Kitchen</th>
              <th className="py-2 px-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => {
              const enabledAmenities = Object.entries(amenityLabels)
                .filter(([key]) => (room as any)[key] === "YES")
                .map(([_, label]) => label)
                .join(", ");

              const kitchenItems = room.kitchen
                ? Object.entries(room.kitchen)
                    .filter(([_, val]) => val === "YES")
                    .map(([key]) => key)
                    .join(", ")
                : "None";

              const totalCapacity = room.bedrooms.reduce((sum, b) => sum + b.count, 0);

              return (
                <tr key={room.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-3">{room.id}</td>
                  <td className="py-2 px-3">{room.name}</td>
                  <td className="py-2 px-3">{room.cost}</td>
                  <td className="py-2 px-3">{room.offer}%</td>
                  <td className="py-2 px-3">{room.size}</td>
                  <td className="py-2 px-3">{totalCapacity}</td>
                  <td className="py-2 px-3">
                    {room.bedrooms.map((b) => `${b.bedType}×${b.count}`).join(", ")}
                  </td>
                  <td className="py-2 px-3">
                    {room.bathrooms
                      .map(
                        (b, i) =>
                          `Bathroom ${i + 1}: Shower ${b.shower}, Slipper ${b.slipper}, Soap ${b.soap}, Bidet ${b.bidet}`
                      )
                      .join("; ")}
                  </td>
                  <td className="py-2 px-3">{enabledAmenities || "None"}</td>
                  <td className="py-2 px-3">{kitchenItems}</td>
                  <td className="py-2 px-3 flex gap-2">
                    <button
                      onClick={() => router.push(`/admin/rooms/edit/${room.id}`)}
                      className="bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-700 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(room.id)}
                      className="bg-red-600 text-white py-1 px-2 rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
