
import type { PropertyFilters } from "../lib/types";

interface FilterBarProps {
  filters: PropertyFilters;
  onChange: (filters: PropertyFilters) => void;
}

const BEDROOM_OPTIONS = [1, 2, 3, 4, 5];
export function FilterBar({ filters, onChange }: FilterBarProps) {
  const hasActiveFilters = Boolean(filters.location || filters.bedrooms);

  return (
    <div className="filter-panel flex flex-wrap items-center gap-4 rounded-[1.75rem] border border-stone bg-[#faf5ee] p-4 shadow-[0_18px_38px_rgba(23,36,31,0.04)] sm:p-5">
      <label className="flex items-center gap-2 rounded-full border border-stone bg-white px-3 py-2.5 text-sm text-ink shadow-sm">
        <span className="text-taupe">Location</span>
        <input
          type="text"
          placeholder="Any"
          value={filters.location ?? ""}
          onChange={(e) => onChange({ ...filters, location: e.target.value || undefined })}
          className="w-28 bg-transparent px-0.5 py-1 text-ink placeholder:text-taupe/60 focus:outline-none"
        />
      </label>

      <label className="flex items-center gap-2 rounded-full border border-stone bg-white px-3 py-2.5 text-sm text-ink shadow-sm">
        <span className="text-taupe">Bedrooms</span>
        <select
          value={filters.bedrooms ?? ""}
          onChange={(e) =>
            onChange({
              ...filters,
              bedrooms: e.target.value ? Number(e.target.value) : undefined,
            })
          }
          className="bg-transparent px-0.5 py-1 text-ink focus:outline-none"
        >
          <option value="">Any</option>
          {BEDROOM_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n} BHK
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 rounded-full border border-stone bg-white px-3 py-2.5 text-sm text-ink shadow-sm">
        <span className="text-taupe">Sort</span>
        <select
          value={`${filters.sortBy ?? "created_at"}_${filters.sortDir ?? "desc"}`}
          onChange={(e) => {
            const [sortBy, sortDir] = e.target.value.split("_") as [
              PropertyFilters["sortBy"],
              PropertyFilters["sortDir"]
            ];
            onChange({ ...filters, sortBy, sortDir });
          }}
          className="bg-transparent px-0.5 py-1 text-ink focus:outline-none"
        >
          <option value="created_at_desc">Newest first</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
          <option value="size_sqft_desc">Size: largest first</option>
        </select>
      </label>

      {hasActiveFilters && (
        <button
          onClick={() => onChange({ sortBy: filters.sortBy, sortDir: filters.sortDir })}
          className="ml-auto rounded-full border border-stone bg-transparent px-3 py-2 text-sm text-taupe transition-colors hover:border-[#1f5a4a] hover:text-[#1f5a4a]"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}