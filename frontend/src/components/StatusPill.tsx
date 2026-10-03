import { STATUS_LABELS } from "../lib/format";
import type { PropertyStatus } from "../lib/types";


const STYLES: Record<PropertyStatus, string> = {
  available: "bg-[#edf8f1] text-[#1d5b4a] ring-1 ring-[#cfe7d6] shadow-[0_6px_18px_rgba(29,91,74,0.12)]",
  under_offer: "bg-[#fff6e8] text-[#8e5a1a] ring-1 ring-[#f0d39b] shadow-[0_6px_18px_rgba(142,90,26,0.12)]",
  sold: "bg-[#fdf0ee] text-[#7d2d2d] ring-1 ring-[#e8b1ac] shadow-[0_6px_18px_rgba(125,45,45,0.12)]",
};

export function StatusPill({ status }: { status: PropertyStatus}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${STYLES[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {STATUS_LABELS[status]}
    </span>
  );
}