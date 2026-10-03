
import { useEffect, useState } from "react";
import { fetchProperties } from "../lib/api";
import type { PropertyListItem, PropertyFilters } from "../lib/types";
import { PropertyCard } from "../components/PropertyCard";
import { FilterBar } from "../components/FilterBar";
import { Hero } from "../components/Hero";

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
    <div>
      <Hero />

      <div id="properties" className="max-w-6xl mx-auto px-6 pb-16 pt-10">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#1f5a4a]">
              Curated collection
            </p>
            <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
              Thoughtful homes, beautifully lived in.
            </h2>
          </div>
          {/* <p className="max-w-lg text-sm text-taupe">
            Thoughtfully selected residences designed for light, comfort, and everyday ease.
          </p> */}
        </div>

        <FilterBar filters={filters} onChange={setFilters} />

        <div className="py-10">
          {loading && (
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-stone aspect-[4/3] rounded-[1.5rem]" />
                  <div className="mt-4 h-4 w-2/3 rounded-full bg-stone" />
                  <div className="mt-2 h-3 w-1/2 rounded-full bg-stone" />
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
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}