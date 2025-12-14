"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../dashboard/Sidebar"; // adjust path if needed

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
  capacity: string;
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

// ---------------------- MAIN COMPONENT ----------------------
export default function AddRoomPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormState>({
    name: "",
    cost: "",
    offer: "",
    size: "",
    capacity: "",
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

  const [hasBedrooms, setHasBedrooms] = useState(true);
  const [hasBathrooms, setHasBathrooms] = useState(true);
  const [hasKitchen, setHasKitchen] = useState(false);

  const [bedrooms, setBedrooms] = useState<Bedroom[]>([{ bedType: "SINGLE", count: 1 }]);
  const [bathrooms, setBathrooms] = useState<Bathroom[]>([
    { shower: "YES", slipper: "YES", soap: "YES", bidet: "NO", towels: "YES", toiletPaper: "YES", hotWater: "YES", privateBathroom: "YES" },
  ]);
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // ---------------- INPUT HANDLERS ------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).slice(0, 4);

    previewImages.forEach((u) => URL.revokeObjectURL(u));

    setImages(files);
    setPreviewImages(files.map((f) => URL.createObjectURL(f)));
  };

  useEffect(() => {
    return () => {
      previewImages.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [previewImages]);

  const fileToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
    });

  // ---------------- DYNAMIC LIST HANDLERS ------------------
  const addBedroom = () => setBedrooms((b) => [...b, { bedType: "SINGLE", count: 1 }]);
  const removeBedroom = (idx: number) => setBedrooms((b) => b.filter((_, i) => i !== idx));
  const updateBedroomType = (idx: number, val: string) => setBedrooms((b) => { const copy = [...b]; copy[idx].bedType = val; return copy; });
  const updateBedroomCount = (idx: number, val: number) => setBedrooms((b) => { const copy = [...b]; copy[idx].count = val; return copy; });

  const addBathroom = () =>
    setBathrooms((b) => [
      ...b,
      { shower: "YES", slipper: "YES", soap: "YES", bidet: "NO", towels: "YES", toiletPaper: "YES", hotWater: "YES", privateBathroom: "YES" },
    ]);
  const removeBathroom = (idx: number) => setBathrooms((b) => b.filter((_, i) => i !== idx));
  const updateBathroomField = (idx: number, key: keyof Bathroom, val: YesNo) =>
    setBathrooms((b) => {
      const copy = [...b];
      copy[idx] = { ...copy[idx], [key]: val };
      return copy;
    });

  // ---------------- SUBMIT --------------------------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

      const imagesBase64: Record<string, string> = {};
      for (let i = 0; i < images.length; i++) {
        imagesBase64[`img${i + 1}`] = await fileToBase64(images[i]);
      }

      const kitchenHasAnyYes = Object.values(kitchen).some((v) => v === "YES");
      const kitchenPayload = hasKitchen && kitchenHasAnyYes ? kitchen : undefined;

      const acEnum = formData.ac === "YES" ? "AC" : "NonAC";

      const payload = {
        name: formData.name,
        cost: Number(formData.cost || 0),
        offer: formData.offer ? Number(formData.offer) : null,
        size: formData.size,
        capacity: Number(formData.capacity || 0),
        ac: acEnum,
        wifi: formData.wifi,
        fan: formData.fan,
        balcony: formData.balcony,
        gardenView: formData.gardenView,
        tv: formData.tv,
        iron: formData.iron,
        locker: formData.locker,
        parking: formData.parking,
        sittingArea: formData.sittingArea,
        dryingRack: formData.dryingRack,
        clothRack: formData.clothRack,
        bedrooms: hasBedrooms ? bedrooms : [],
        bathrooms: hasBathrooms ? bathrooms : [],
        kitchen: kitchenPayload,
        ...imagesBase64,
      };

      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message = (data && (data.error || data.message)) || "Failed to create room";
        throw new Error(message);
      }

      setSuccessMessage("Room created successfully! Redirecting...");
      // ✅ FIX: absolute path
      setTimeout(() => router.push("/admin/rooms/view"), 700);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- RENDER --------------------------
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-3xl font-bold mb-4">Add New Room</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md max-w-5xl mx-auto flex flex-col gap-6">
          {error && <div className="text-red-600 bg-red-50 p-3 rounded">{error}</div>}
          {successMessage && <div className="text-green-700 bg-green-50 p-3 rounded">{successMessage}</div>}

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Room Name" name="name" value={formData.name} onChange={handleChange} />
            <Input type="number" label="Cost (LKR)" name="cost" value={formData.cost} onChange={handleChange} />
            <Input type="number" label="Offer (%)" name="offer" value={formData.offer} onChange={handleChange} />
            <Input label="Room Size" name="size" value={formData.size} onChange={handleChange} />
            <Input type="number" label="Capacity" name="capacity" value={formData.capacity} onChange={handleChange} />
            <div>
              <label className="font-semibold">AC</label>
              <select name="ac" value={formData.ac} onChange={handleChange} className="border p-2 rounded w-full">
                <option value="YES">YES</option>
                <option value="NO">NO</option>
              </select>
            </div>
          </div>

          {/* Amenities */}
          <div className="border-t pt-4">
            <h2 className="text-xl font-semibold mb-2">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(
                ["wifi","fan","balcony","gardenView","tv","iron","locker","parking","sittingArea","dryingRack","clothRack"] as (keyof FormState)[]
              ).map((key) => (
                <SelectYesNo key={key} label={toLabel(key)} name={key} value={formData[key]} onChange={handleChange} />
              ))}
            </div>
          </div>

          {/* Bedrooms */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Bedrooms</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Has bedrooms?</span>
                <SelectYesNo label="" name="hasBedrooms" value={hasBedrooms ? "YES" : "NO"} onChange={(e) => setHasBedrooms(e.target.value === "YES")} />
              </div>
            </div>
            {hasBedrooms && (
              <>
                {bedrooms.map((b, i) => (
                  <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-3 border p-3 rounded items-end">
                    <div>
                      <label className="font-semibold">Bed Type</label>
                      <select value={b.bedType} onChange={(e) => updateBedroomType(i, e.target.value)} className="border p-2 rounded w-full">
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
                    <div>
                      <label className="font-semibold">Count</label>
                      <input type="number" min={1} value={b.count} onChange={(e) => updateBedroomCount(i, Number(e.target.value || 1))} className="border p-2 rounded w-full" />
                    </div>
                    <div className="md:col-span-2 flex justify-end gap-2">
                      <button type="button" className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => removeBedroom(i)}>Remove</button>
                    </div>
                  </div>
                ))}
                <div className="mt-3">
                  <button type="button" onClick={addBedroom} className="bg-blue-600 text-white px-4 py-2 rounded">+ Add Bedroom</button>
                </div>
              </>
            )}
          </div>

          {/* Bathrooms */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Bathrooms</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Has bathrooms?</span>
                <SelectYesNo label="" name="hasBathrooms" value={hasBathrooms ? "YES" : "NO"} onChange={(e) => setHasBathrooms(e.target.value === "YES")} />
              </div>
            </div>
            {hasBathrooms && (
              <>
                {bathrooms.map((b, i) => (
                  <div key={i} className="grid grid-cols-2 md:grid-cols-8 gap-2 border p-3 rounded">
                    {(Object.keys(b) as (keyof Bathroom)[]).map((key) => (
                      <div key={key} className="md:col-span-1">
                        <label className="font-semibold text-sm">{toLabel(key)}</label>
                        <select value={b[key]} onChange={(e) => updateBathroomField(i, key, e.target.value as YesNo)} className="border p-2 rounded w-full">
                          <option value="YES">YES</option>
                          <option value="NO">NO</option>
                        </select>
                      </div>
                    ))}
                    <div className="md:col-span-1 flex items-center justify-end gap-2">
                      <button type="button" className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => removeBathroom(i)}>Remove</button>
                    </div>
                  </div>
                ))}
                <div className="mt-3">
                  <button type="button" onClick={addBathroom} className="bg-blue-600 text-white px-4 py-2 rounded">+ Add Bathroom</button>
                </div>
              </>
            )}
          </div>

          {/* Kitchen */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Kitchen</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Has kitchen?</span>
                <SelectYesNo label="" name="hasKitchen" value={hasKitchen ? "YES" : "NO"} onChange={(e) => setHasKitchen(e.target.value === "YES")} />
              </div>
            </div>
            {hasKitchen && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                {(Object.keys(kitchen) as (keyof Kitchen)[]).map((key) => (
                  <SelectYesNo key={key} label={toLabel(key)} name={key} value={kitchen[key]} onChange={(e) => setKitchen({ ...kitchen, [key]: e.target.value as YesNo })} />
                ))}
              </div>
            )}
          </div>

          {/* Images */}
          <div className="border-t pt-4">
            <label className="font-semibold">Upload Images (max 4)</label>
            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="block mt-2" />
            <div className="flex gap-2 mt-3">
              {previewImages.map((src, i) => (
                <div key={i} className="relative">
                  <img src={src} alt={`preview-${i}`} className="w-28 h-20 rounded object-cover border" />
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded text-lg" disabled={loading}>
              {loading ? "Saving..." : "Create Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------------------- REUSABLE UI ----------------------
interface InputProps {
  label: string;
  name?: string;
  value: any;
  type?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
}

function Input({ label, name, value, onChange, type = "text" }: InputProps) {
  return (
    <div className="flex flex-col">
      <label className="font-semibold">{label}</label>
      <input type={type} name={name} value={value} onChange={onChange as any} className="border p-2 rounded" />
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
      {label && <label className="font-semibold">{label}</label>}
      <select name={name} value={value} onChange={onChange as any} className="border p-2 rounded">
        <option value="YES">YES</option>
        <option value="NO">NO</option>
      </select>
    </div>
  );
}

// ---------------------- HELPERS ----------------------
function toLabel(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase());
}
