
import { useState } from "react";
import type { PropertyImage } from "../lib/types";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80";

export function ImageGallery({ images, propertyName }: { images: PropertyImage[]; propertyName: string }) {
  const sorted = [...images].sort((a, b) => a.display_order - b.display_order);
  const [activeIndex, setActiveIndex] = useState(0);
  const active = sorted[activeIndex];

  return (
    <div>
      <div className="bg-stone aspect-[16/10] overflow-hidden">
        <img
          src={active?.image_url || FALLBACK_IMAGE}
          alt={propertyName}
          className="w-full h-full object-cover"
        />
      </div>

      {sorted.length > 1 && (
        <div className="flex gap-2 mt-3">
          {sorted.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              aria-label={`Show image ${i + 1} of ${sorted.length}`}
              aria-current={i === activeIndex}
              className={`w-20 aspect-[4/3] overflow-hidden border-2 transition-colors ${
                i === activeIndex ? "border-brass" : "border-transparent"
              }`}
            >
              <img src={img.image_url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}