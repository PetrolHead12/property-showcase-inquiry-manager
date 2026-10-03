/**
 * Place at: frontend/src/components/FilterBar.tsx
 */

import type { PropertyFilters } from "../lib/types";

interface FilterBarProps {
  filters: PropertyFilters;
  onChange: (filters: PropertyFilters) => void;
}

const BEDROOM_OPTIONS = [1, 2, 3, 4, 5];

export function FilterBar({ filters, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-end gap-4 py-6 border-b border-stone">
      <div className="flex flex-col gap-1">
        <label htmlFor="location" className="text-sm text-taupe">
          Location
        </label>
        <input
          id="location"
          type="text"
          placeholder="e.g. Whitefield"
          value={filters.location ?? ""}
          onChange={(e) => onChange({ ...filters, location: e.target.value || undefined })}
          className="border border-stone bg-paper px-3 py-2 text-sm w-48 focus:outline-none focus-visible:outline-2 focus-visible:outline-brass"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="bedrooms" className="text-sm text-taupe">
          Bedrooms
        </label>
        <select
          id="bedrooms"
          value={filters.bedrooms ?? ""}
          onChange={(e) =>
            onChange({
              ...filters,
              bedrooms: e.target.value ? Number(e.target.value) : undefined,
            })
          }
          className="border border-stone bg-paper px-3 py-2 text-sm w-32 focus:outline-none focus-visible:outline-2 focus-visible:outline-brass"
        >
          <option value="">Any</option>
          {BEDROOM_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n} BHK
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="sort" className="text-sm text-taupe">
          Sort by
        </label>
        <select
          id="sort"
          value={`${filters.sortBy ?? "created_at"}_${filters.sortDir ?? "desc"}`}
          onChange={(e) => {
            const [sortBy, sortDir] = e.target.value.split("_") as [
              PropertyFilters["sortBy"],
              PropertyFilters["sortDir"]
            ];
            onChange({ ...filters, sortBy, sortDir });
          }}
          className="border border-stone bg-paper px-3 py-2 text-sm w-48 focus:outline-none focus-visible:outline-2 focus-visible:outline-brass"
        >
          <option value="created_at_desc">Newest first</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
          <option value="size_sqft_desc">Size: largest first</option>
        </select>
      </div>

      {(filters.location || filters.bedrooms) && (
        <button
          onClick={() => onChange({ sortBy: filters.sortBy, sortDir: filters.sortDir })}
          className="text-sm text-taupe hover:text-brass underline underline-offset-2 pb-2"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}