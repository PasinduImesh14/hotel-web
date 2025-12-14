import { placesToVisit } from "@/data/destination";
import PlacesSelector from "./PlacesSelector";

export default function PlacesYouCantMiss() {
  return (
    <section className="w-full bg-white py-16">
      <div className="flex flex-col justify-center items-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-8 text-center">
          Places You Can't Miss
        </h2>
      </div>

      <PlacesSelector places={placesToVisit} />
    </section>
  );
}