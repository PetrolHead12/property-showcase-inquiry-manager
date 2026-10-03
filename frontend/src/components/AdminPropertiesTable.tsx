/**
 * Place at: frontend/src/components/AdminPropertiesTable.tsx
 */
import { Link } from "react-router-dom";
import type { PropertyListItem } from "../lib/types";
import { formatPriceINR, formatSqft, formatBedrooms } from "../lib/format";
import { StatusPill } from "./StatusPill";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80";

function ViewIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Zm10 3.25A3.25 3.25 0 1 0 12 8.5a3.25 3.25 0 0 0 0 6.75Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25ZM14.06 4.19l3.75 3.75M5.25 19.5h13.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        d="M4 7h16M9 7V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V7m-9 0 1.2 12.3A1.8 1.8 0 0 0 8.99 21h6.02a1.8 1.8 0 0 0 1.79-1.7L18 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface AdminPropertiesTableProps {
  properties: PropertyListItem[];
  onDelete: (id: number) => void;
  deletingId: number | null;
}

export function AdminPropertiesTable({
  properties,
  onDelete,
  deletingId,
}: AdminPropertiesTableProps) {
  if (properties.length === 0) {
    return (
      <div className="rounded-[1.75rem] border border-[#e7ddd1] bg-[#fbf8f4] py-16 text-center">
        <p className="font-display text-2xl text-ink">No properties yet</p>
        <p className="mt-2 text-sm text-taupe">Add your first listing to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {properties.map((p) => (
        <article
          key={p.id}
          className="group overflow-hidden rounded-[1.75rem] border border-[#e8dfd2] bg-[#fffdfb] shadow-[0_18px_40px_rgba(20,35,30,0.05)]"
        >
          <div className="relative">
            <img
              src={p.primary_image_url || FALLBACK_IMAGE}
              alt={p.name}
              className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-x-4 top-4 flex items-center justify-between">
              <span className="rounded-full border border-white/40 bg-[#ffffff]/80 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[#183126] backdrop-blur-sm">
                {p.location}
              </span>
              <StatusPill status={p.status} />
            </div>
          </div>

          <div className="space-y-4 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl text-ink">{p.name}</h3>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#5e6a62]">
                  {p.location}
                </p>
              </div>
              <span className="font-display text-lg text-[#bf8f43]">
                {formatPriceINR(p.price)}
              </span>
            </div>

            <div className="flex items-center gap-3 text-sm text-[#5e6a62]">
              <span>{formatBedrooms(p.bedrooms)}</span>
              <span className="h-1 w-1 rounded-full bg-[#bbaf9b]" />
              <span>{formatSqft(p.size_sqft)}</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Link
                to={`/properties/${p.id}`}
                aria-label={`View ${p.name}`}
                title="View"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d8cdb7] bg-[#f7f1ea] text-[#183126] transition-colors hover:bg-[#efe2ce]"
              >
                <ViewIcon />
              </Link>
              <Link
                to={`/admin/properties/${p.id}/edit`}
                aria-label={`Edit ${p.name}`}
                title="Edit"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d8cdb7] bg-white text-[#183126] transition-colors hover:bg-[#f7f1ea]"
              >
                <EditIcon />
              </Link>
              <button
                onClick={() => onDelete(p.id)}
                disabled={deletingId === p.id}
                aria-label={deletingId === p.id ? `Deleting ${p.name}` : `Delete ${p.name}`}
                title={deletingId === p.id ? "Deleting…" : "Delete"}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#e8c5bc] bg-[#fff5f2] text-[#8f3d2f] transition-colors hover:bg-[#fce9e4] disabled:opacity-60"
              >
                {deletingId === p.id ? <span className="text-xs font-semibold">…</span> : <DeleteIcon />}
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}