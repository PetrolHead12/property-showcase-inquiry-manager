/**
 * Place at: frontend/src/components/PropertyCard.tsx
 */
import { Link } from "react-router-dom";
import { StatusPill } from "./StatusPill";

import type { PropertyListItem } from "../lib/types";
import { formatBedrooms, formatPriceINR, formatSqft } from "../lib/format";
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80";

export function PropertyCard({ property }: { property: PropertyListItem }) {
  return (
    <Link to={`/properties/${property.id}`} className="group block">
      <div className="overflow-hidden bg-stone aspect-[4/3]">
        <img
          src={property.primary_image_url || FALLBACK_IMAGE}
          alt={property.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          loading="lazy"
        />
      </div>

      <div className="pt-4 space-y-1.5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg leading-snug text-ink">
            {property.name}
          </h3>
          <StatusPill status={property.status} />
        </div>

        <p className="text-sm text-taupe">{property.location}</p>

        <p className="text-sm text-taupe">
          {formatBedrooms(property.bedrooms)} · {formatSqft(property.size_sqft)}
        </p>

        <p className="font-display text-brass text-lg pt-1">
          {formatPriceINR(property.price)}
        </p>
      </div>
    </Link>
  );
}