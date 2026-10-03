
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProperties, fetchInquiries, deleteProperty } from "../lib/api";
import type { PropertyListItem, InquiryWithProperty } from "../lib/types";
import { AdminPropertiesTable } from "../components/AdminPropertiesTable";
import { AdminInquiriesTable } from "../components/AdminInquiresTable";

type Tab = "properties" | "inquiries";

export function AdminDashboardPage() {
  const [tab, setTab] = useState<Tab>("properties");
  const [properties, setProperties] = useState<PropertyListItem[]>([]);
  const [inquiries, setInquiries] = useState<InquiryWithProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function loadData() {
    setLoading(true);
    setError(null);
    Promise.all([fetchProperties({}), fetchInquiries()])
      .then(([props, inqs]) => {
        setProperties(props);
        setInquiries(inqs);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Delete this property? This cannot be undone. Properties with existing inquiries can't be deleted."
    );
    if (!confirmed) return;

    setDeleteError(null);
    setDeletingId(id);
    try {
      await deleteProperty(id);
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Couldn't delete property.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
      <div className="rounded-[2rem] border border-[#eadfce] bg-[#fbf8f4]/90 p-6 shadow-[0_18px_50px_rgba(20,35,30,0.04)] sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#1f5a4a]">
              Portfolio dashboard
            </p>
            <h1 className="mt-2 font-display text-4xl text-ink sm:text-5xl">Admin dashboard</h1>
            <p className="mt-2 text-sm text-taupe">
              Manage listings and review buyer inquiries.
            </p>
          </div>

          <Link
            to="/admin/properties/new"
            className="inline-flex items-center justify-center rounded-full bg-[#183126] px-5 py-3 text-sm font-medium text-[#f8f4ee] shadow-[0_18px_35px_rgba(24,49,38,0.15)] transition-transform hover:-translate-y-0.5"
          >
            Add property
          </Link>
        </div>
      </div>

      <div className="mt-8 rounded-[1.5rem] border border-[#e7ddd1] bg-[#f7f1ea] p-2 shadow-[0_10px_30px_rgba(24,49,38,0.04)]">
        <div className="flex flex-wrap gap-2">
          <TabButton active={tab === "properties"} onClick={() => setTab("properties")}>
            Properties <span className="ml-2 rounded-full bg-white/60 px-2 py-0.5 text-[11px] text-[#183126]">{properties.length}</span>
          </TabButton>
          <TabButton active={tab === "inquiries"} onClick={() => setTab("inquiries")}>
            Inquiries <span className="ml-2 rounded-full bg-white/60 px-2 py-0.5 text-[11px] text-[#183126]">{inquiries.length}</span>
          </TabButton>
        </div>
      </div>

      <div className="mt-6">
        {loading && <p className="text-taupe py-10 text-center">Loading…</p>}

        {!loading && error && (
          <p className="text-brick py-10 text-center">Couldn't load dashboard: {error}</p>
        )}

        {!loading && !error && (
          <>
            {deleteError && (
              <p className="mb-4 rounded-2xl border border-[#e8b5a8] bg-[#fdf1ee] px-4 py-3 text-sm text-[#8f3d2f]">
                {deleteError}
              </p>
            )}
            {tab === "properties" ? (
              <AdminPropertiesTable
                properties={properties}
                onDelete={handleDelete}
                deletingId={deletingId}
              />
            ) : (
              <AdminInquiriesTable inquiries={inquiries} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-[#183126] text-[#f8f4ee] shadow-[0_12px_28px_rgba(17,30,24,0.18)]"
          : "bg-transparent text-[#5e6a62] hover:bg-white hover:text-[#183126]"
      }`}
    >
      {children}
    </button>
  );
}