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
      <div className="rounded-[1.75rem] border border-[#e7ddd1] bg-[#fbf8f4] py-16 text-center">
        <p className="font-display text-2xl text-ink">No inquiries yet</p>
        <p className="mt-2 text-sm text-taupe">
          Buyer inquiries submitted from property pages will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {inquiries.map((inq) => (
        <article
          key={inq.id}
          className="rounded-[1.75rem] border border-[#e8dfd2] bg-white p-5 shadow-[0_18px_40px_rgba(20,35,30,0.04)]"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#1f5a4a]">
                Inquiry
              </p>
              <h3 className="mt-2 font-display text-2xl text-ink">{inq.name}</h3>
            </div>
            <span className="rounded-full border border-[#e6d5b6] bg-[#f7f0e3] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#183126]">
              {formatDate(inq.created_at)}
            </span>
          </div>

          <div className="mt-5 space-y-3 text-sm text-[#5e6a62]">
            <div className="flex justify-between gap-4 border-b border-[#f0e7dd] pb-2">
              <span>Property</span>
              <span className="text-right font-medium text-[#183126]">{inq.property_name}</span>
            </div>
            <div className="flex justify-between gap-4 border-b border-[#f0e7dd] pb-2">
              <span>Location</span>
              <span className="text-right">{inq.property_location}</span>
            </div>
            <div className="flex justify-between gap-4 border-b border-[#f0e7dd] pb-2">
              <span>Email</span>
              <span className="text-right break-all">{inq.email}</span>
            </div>
            <div className="flex justify-between gap-4 border-b border-[#f0e7dd] pb-2">
              <span>Phone</span>
              <span className="text-right">{inq.phone}</span>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-[#f8f4ee] p-4">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#1f5a4a]">
              Message
            </p>
            <p className="mt-2 text-sm leading-6 text-[#183126]">{inq.message}</p>
          </div>
        </article>
      ))}
    </div>
  );
}