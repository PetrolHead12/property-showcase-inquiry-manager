/**
 * Place at: frontend/src/components/PropertyCard.tsx
 */
import { Link } from "react-router-dom";
import type { PropertyListItem } from "../lib/types";
import { formatPriceINR, formatSqft, formatBedrooms } from "../lib/format";
import { StatusPill } from "./StatusPill";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80";

export function PropertyCard({ property }: { property: PropertyListItem }) {
  return (
    <Link to={`/properties/${property.id}`} className="group block">
      <div className="relative overflow-hidden rounded-[1.5rem] border border-stone bg-stone shadow-[0_18px_40px_rgba(20,35,30,0.07)] transition-shadow duration-300 group-hover:shadow-[0_24px_55px_rgba(20,35,30,0.12)]">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={property.primary_image_url || FALLBACK_IMAGE}
            alt={property.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            loading="lazy"
          />
        </div>
        <div className="absolute right-3 top-3">
          <StatusPill status={property.status} />
        </div>
      </div>

      <div className="space-y-2 pt-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl leading-snug text-ink transition-colors group-hover:text-[#1f5a4a]">
            {property.name}
          </h3>
          <span className="whitespace-nowrap font-display text-base text-[#b98a3a]">
            From {formatPriceINR(property.price)}
          </span>
        </div>

        <p className="text-sm text-taupe">{property.location}</p>

        <p className="text-sm text-taupe">
          {formatBedrooms(property.bedrooms)} · {formatSqft(property.size_sqft)}
        </p>
      </div>
    </Link>
  );
}