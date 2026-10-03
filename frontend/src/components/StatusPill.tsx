import { STATUS_LABELS } from "../lib/format";
import type { PropertyStatus } from "../lib/types";


const STYLES: Record<PropertyStatus, string> = {
  available: "bg-stone text-ink",
  under_offer: "bg-brass/15 text-brass",
  sold: "bg-brick/10 text-brick",
};

export function StatusPill({ status }: { status: PropertyStatus}) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}