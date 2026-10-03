/**
 * Place at: frontend/src/components/AdminPropertiesTable.tsx
 */
import { Link } from "react-router-dom";
import type { PropertyListItem } from "../lib/types";
import { formatPriceINR, formatSqft } from "../lib/format";
import { StatusPill } from "./StatusPill";

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
      <div className="text-center py-16 border border-stone">
        <p className="text-ink font-display text-lg">No properties yet</p>
        <p className="text-taupe text-sm mt-1">Add your first listing to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-stone">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone text-left text-taupe">
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Location</th>
            <th className="px-4 py-3 font-medium">Price</th>
            <th className="px-4 py-3 font-medium">Size</th>
            <th className="px-4 py-3 font-medium">Beds</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((p) => (
            <tr key={p.id} className="border-b border-stone last:border-0">
              <td className="px-4 py-3 text-ink">
                <Link to={`/properties/${p.id}`} className="hover:text-brass">
                  {p.name}
                </Link>
              </td>
              <td className="px-4 py-3 text-taupe">{p.location}</td>
              <td className="px-4 py-3 text-ink">{formatPriceINR(p.price)}</td>
              <td className="px-4 py-3 text-taupe">{formatSqft(p.size_sqft)}</td>
              <td className="px-4 py-3 text-taupe">{p.bedrooms}</td>
              <td className="px-4 py-3">
                <StatusPill status={p.status} />
              </td>
              <td className="px-4 py-3 text-right whitespace-nowrap">
                <Link
                  to={`/admin/properties/${p.id}/edit`}
                  className="text-brass hover:underline underline-offset-2 mr-4"
                >
                  Edit
                </Link>
                <button
                  onClick={() => onDelete(p.id)}
                  disabled={deletingId === p.id}
                  className="text-brick hover:underline underline-offset-2 disabled:opacity-50"
                >
                  {deletingId === p.id ? "Deleting…" : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}