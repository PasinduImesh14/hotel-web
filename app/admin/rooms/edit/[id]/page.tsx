"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "../../../dashboard/Sidebar";

// ---------------------- TYPES ----------------------

type YesNo = "YES" | "NO";

interface Bedroom {
  bedType: string;
  count: number;
}

interface Bathroom {
  shower: YesNo;
  slipper: YesNo;
  soap: YesNo;
  bidet: YesNo;
  towels: YesNo;
  toiletPaper: YesNo;
  hotWater: YesNo;
  privateBathroom: YesNo;
}

interface Kitchen {
  diningTable: YesNo;
  gasCooker: YesNo;
  riceCooker: YesNo;
  woodStove: YesNo;
  fridge: YesNo;
  electricKettle: YesNo;
  waterBottle: YesNo;
}

interface FormState {
  name: string;
  cost: string;
  offer: string;
  size: string;
  capacity: string; // ✅ added capacity
  ac: YesNo;
  wifi: YesNo;
  fan: YesNo;
  balcony: YesNo;
  gardenView: YesNo;
  tv: YesNo;
  iron: YesNo;
  locker: YesNo;
  parking: YesNo;
  sittingArea: YesNo;
  dryingRack: YesNo;
  clothRack: YesNo;
}

// ---------------------- COMPONENT ----------------------

export default function EditRoomPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.id;

  const [formData, setFormData] = useState<FormState>({
    name: "",
    cost: "",
    offer: "",
    size: "",
    capacity: "", // ✅ initial value
    ac: "YES",
    wifi: "YES",
    fan: "NO",
    balcony: "NO",
    gardenView: "NO",
    tv: "NO",
    iron: "NO",
    locker: "NO",
    parking: "NO",
    sittingArea: "NO",
    dryingRack: "NO",
    clothRack: "NO",
  });

  const [bedrooms, setBedrooms] = useState<Bedroom[]>([]);
  const [bathrooms, setBathrooms] = useState<Bathroom[]>([]);
  const [kitchen, setKitchen] = useState<Kitchen>({
    diningTable: "NO",
    gasCooker: "NO",
    riceCooker: "NO",
    woodStove: "NO",
    fridge: "NO",
    electricKettle: "NO",
    waterBottle: "NO",
  });

  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---------------- FETCH ROOM DATA ------------------

  useEffect(() => {
    async function fetchRoom() {
      try {
        const res = await fetch(`/api/rooms?id=${roomId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Room not found");

        const room = data.room;

        setFormData({
          name: room.name,
          cost: room.cost.toString(),
          offer: room.offer?.toString() || "",
          size: room.size,
          capacity: room.capacity?.toString() || "", // ✅ fetch capacity
          ac: room.ac === "AC" ? "YES" : "NO",
          wifi: room.wifi,
          fan: room.fan,
          balcony: room.balcony,
          gardenView: room.gardenView,
          tv: room.tv,
          iron: room.iron,
          locker: room.locker,
          parking: room.parking,
          sittingArea: room.sittingArea,
          dryingRack: room.dryingRack,
          clothRack: room.clothRack,
        });

        setBedrooms(room.bedrooms || []);
        setBathrooms(room.bathrooms || []);
        setKitchen(room.kitchen || kitchen);

        setExistingImages([room.img1, room.img2, room.img3, room.img4].filter(Boolean));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchRoom();
  }, [roomId]);

  // ---------------- INPUT HANDLERS ------------------

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).slice(0, 4);
    setImages(files);
    setPreviewImages(files.map((f) => URL.createObjectURL(f)));
  };

  const fileToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
    });

  // ---------------- HANDLE SUBMIT ------------------

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem("adminToken");

      const imagesBase64: Record<string, string> = {};
      for (let i = 0; i < images.length; i++) {
        imagesBase64[`img${i + 1}`] = await fileToBase64(images[i]);
      }

      const kitchenPayload = Object.values(kitchen).some((v) => v === "YES") ? kitchen : undefined;

      const payload = {
        id: Number(roomId),
        ...formData,
        ac: formData.ac === "YES" ? "AC" : "NonAC",
        cost: Number(formData.cost),
        offer: formData.offer ? Number(formData.offer) : null,
        capacity: Number(formData.capacity), // ✅ send capacity
        bedrooms,
        bathrooms,
        kitchen: kitchenPayload,
        ...imagesBase64,
      };

      const res = await fetch("/api/rooms", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update room");

      alert("Room updated successfully!");
      router.push("/admin/rooms/view");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ---------------- RENDER --------------------------

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-100 overflow-auto">

        {/* Title */}
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Edit Room</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-lg max-w-5xl mx-auto flex flex-col gap-10"
        >

          {/* ================= BASIC INFO ================= */}
          <Section title="Basic Information">
            <div className="grid grid-cols-2 gap-6">
              <Input label="Room Name" name="name" value={formData.name} onChange={handleChange} />
              <Input type="number" label="Cost" name="cost" value={formData.cost} onChange={handleChange} />
              <Input type="number" label="Offer (%)" name="offer" value={formData.offer} onChange={handleChange} />
              <Input label="Room Size" name="size" value={formData.size} onChange={handleChange} />
              <Input type="number" label="Capacity" name="capacity" value={formData.capacity} onChange={handleChange} /> {/* ✅ Capacity input */}
            </div>
          </Section>

          {/* ================= AMENITIES ================= */}
          <Section title="Amenities">
            <div className="grid grid-cols-3 gap-6">
              {(
                [
                  "ac", "wifi", "fan", "balcony", "gardenView", "tv", "iron",
                  "locker", "parking", "sittingArea", "dryingRack", "clothRack",
                ] as (keyof FormState)[]
              ).map((key) => (
                <SelectYesNo key={key} label={formatLabel(key)} name={key} value={formData[key]} onChange={handleChange} />
              ))}
            </div>
          </Section>

          {/* ================= BEDROOMS ================= */}
          <Section title="Bedrooms" description="Add different bed types available inside this room.">
            {bedrooms.map((b, i) => (
              <div key={i} className="p-5 rounded-xl border bg-gray-50 mb-4 grid grid-cols-2 gap-6">
                <div>
                  <label className="font-semibold block mb-1">Bed Type</label>
                  <select
                    value={b.bedType}
                    onChange={(e) => {
                      const beds = [...bedrooms];
                      beds[i].bedType = e.target.value;
                      setBedrooms(beds);
                    }}
                    className="border p-2 rounded w-full"
                  >
                    <option value="SINGLE">Single</option>
                    <option value="DOUBLE">Double</option>
                    <option value="QUEEN">Queen</option>
                    <option value="KING">King</option>
                    <option value="TWIN">Twin</option>
                    <option value="DOUBLE_ROOM">Double Room</option>
                    <option value="TRIPLE">Triple</option>
                    <option value="FAMILY">Family</option>
                  </select>
                </div>

                <Input
                  type="number"
                  label="Count"
                  value={b.count}
                  onChange={(e) => {
                    const beds = [...bedrooms];
                    beds[i].count = Number(e.target.value);
                    setBedrooms(beds);
                  }}
                />
              </div>
            ))}

            <AddButton label="Add Bedroom" onClick={() =>
              setBedrooms([...bedrooms, { bedType: "SINGLE", count: 1 }])
            } />
          </Section>

          {/* ================= BATHROOMS ================= */}
          <Section title="Bathrooms" description="Configure bathroom items included in this room.">
            {bathrooms.map((b, i) => (
              <div key={i} className="p-5 rounded-xl border bg-gray-50 mb-4 grid grid-cols-4 gap-4">
                {(Object.keys(b) as (keyof Bathroom)[]).map((key) => (
                  <SelectYesNo
                    key={key}
                    label={formatLabel(key)}
                    name={key}
                    value={b[key]}
                    onChange={(e) => {
                      const list = [...bathrooms];
                      list[i][key] = e.target.value as YesNo;
                      setBathrooms(list);
                    }}
                  />
                ))}
              </div>
            ))}

            <AddButton
              label="Add Bathroom"
              onClick={() =>
                setBathrooms([...bathrooms, {
                  shower: "YES",
                  slipper: "YES",
                  soap: "YES",
                  bidet: "NO",
                  towels: "YES",
                  toiletPaper: "YES",
                  hotWater: "YES",
                  privateBathroom: "YES"
                }])
              }
            />
          </Section>

          {/* ================= KITCHEN ================= */}
          <Section title="Kitchen Items" description="List kitchen-related facilities available.">
            <div className="grid grid-cols-3 gap-6">
              {(Object.keys(kitchen) as (keyof Kitchen)[]).map((key) => (
                <SelectYesNo
                  key={key}
                  label={formatLabel(key)}
                  name={key}
                  value={kitchen[key]}
                  onChange={(e) =>
                    setKitchen({ ...kitchen, [key]: e.target.value as YesNo })
                  }
                />
              ))}
            </div>
          </Section>

          {/* ================= IMAGES ================= */}
          <Section title="Room Images">
            <label className="block font-semibold mb-2">Existing Images</label>
            <div className="flex gap-3 mb-6">
              {existingImages.map((src, i) => (
                <img key={i} src={src} className="w-24 h-24 object-cover rounded-lg border" />
              ))}
            </div>

            <label className="block font-semibold">Upload New Images (max 4)</label>
            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="block mt-2" />

            <div className="flex gap-3 mt-3">
              {previewImages.map((src, i) => (
                <img key={i} src={src} className="w-24 h-24 rounded-lg object-cover border" />
              ))}
            </div>
          </Section>

          {/* ================= SUBMIT ================= */}
          <button
            className="bg-green-600 hover:bg-green-700 transition text-white px-8 py-3 rounded-lg text-lg font-semibold"
            disabled={saving}
          >
            {saving ? "Saving..." : "Update Room"}
          </button>

        </form>
      </div>
    </div>
  );
}

// ---------------------- UI COMPONENTS ----------------------

function Section({ title, description, children }: any) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-1 text-gray-900">{title}</h2>
      {description && <p className="text-gray-500 mb-4">{description}</p>}
      {children}
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className="bg-blue-500 hover:bg-blue-600 transition text-white px-4 py-2 rounded-lg"
      onClick={onClick}
    >
      + {label}
    </button>
  );
}

function formatLabel(key: string) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
}

interface InputProps {
  label: string;
  name?: string;
  value: any;
  type?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

function Input({ label, name, value, onChange, type = "text" }: InputProps) {
  return (
    <div className="flex flex-col">
      <label className="font-semibold mb-1">{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} className="border p-2 rounded" />
    </div>
  );
}

interface SelectProps {
  label: string;
  name: string;
  value: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
}

function SelectYesNo({ label, name, value, onChange }: SelectProps) {
  return (
    <div className="flex flex-col">
      <label className="font-semibold mb-1">{label}</label>
      <select name={name} value={value} onChange={onChange} className="border p-2 rounded">
        <option value="YES">YES</option>
        <option value="NO">NO</option>
      </select>
    </div>
  );
}
