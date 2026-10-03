/**
 * Place at: frontend/src/components/AdminInquiriesTable.tsx
 */
import type { InquiryWithProperty } from "../lib/types";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function AdminInquiriesTable({ inquiries }: { inquiries: InquiryWithProperty[] }) {
  if (inquiries.length === 0) {
    return (
      <div className="text-center py-16 border border-stone">
        <p className="text-ink font-display text-lg">No inquiries yet</p>
        <p className="text-taupe text-sm mt-1">
          Buyer inquiries submitted from property pages will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-stone">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone text-left text-taupe">
            <th className="px-4 py-3 font-medium">Received</th>
            <th className="px-4 py-3 font-medium">Property</th>
            <th className="px-4 py-3 font-medium">Buyer</th>
            <th className="px-4 py-3 font-medium">Contact</th>
            <th className="px-4 py-3 font-medium">Message</th>
          </tr>
        </thead>
        <tbody>
          {inquiries.map((inq) => (
            <tr key={inq.id} className="border-b border-stone last:border-0 align-top">
              <td className="px-4 py-3 text-taupe whitespace-nowrap">
                {formatDate(inq.created_at)}
              </td>
              <td className="px-4 py-3 text-ink">
                {inq.property_name}
                <div className="text-taupe text-xs">{inq.property_location}</div>
              </td>
              <td className="px-4 py-3 text-ink whitespace-nowrap">{inq.name}</td>
              <td className="px-4 py-3 text-taupe">
                <div>{inq.email}</div>
                <div>{inq.phone}</div>
              </td>
              <td className="px-4 py-3 text-ink max-w-xs">{inq.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}