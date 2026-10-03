/**
 * Place at: frontend/src/pages/PropertyGridPage.tsx
 */
import { useEffect, useState } from "react";
import { PropertyCard } from "../components/PropertyCard";
import { FilterBar } from "../components/FilterBar";
import type { PropertyFilters, PropertyListItem } from "../lib/types";
import { fetchProperties } from "../lib/api";

export function PropertyGridPage() {
  const [properties, setProperties] = useState<PropertyListItem[]>([]);
  const [filters, setFilters] = useState<PropertyFilters>({
    sortBy: "created_at",
    sortDir: "desc",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchProperties(filters)
      .then((data) => {
        if (!cancelled) setProperties(data);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filters]);

  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="pt-16 pb-4 max-w-2xl">
        <h1 className="font-display text-4xl leading-tight text-ink">
          Bengaluru's finest residences, curated for you
        </h1>
        <p className="text-taupe mt-3">
          A private selection of bespoke homes, each built to measure.
        </p>
      </div>

      <FilterBar filters={filters} onChange={setFilters} />

      <div className="py-10">
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-stone aspect-[4/3]" />
                <div className="h-4 bg-stone mt-4 w-2/3" />
                <div className="h-3 bg-stone mt-2 w-1/2" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-20">
            <p className="text-brick">Couldn't load properties: {error}</p>
          </div>
        )}

        {!loading && !error && properties.length === 0 && (
          <div className="text-center py-20">
            <p className="font-display text-xl text-ink">No properties match these filters</p>
            <p className="text-taupe mt-2">Try widening your search.</p>
          </div>
        )}

        {!loading && !error && properties.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}