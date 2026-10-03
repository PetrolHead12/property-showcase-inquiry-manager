/**
 * Place at: frontend/src/pages/AdminDashboardPage.tsx
 */
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
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink">Admin dashboard</h1>
          <p className="text-taupe mt-1 text-sm">
            Manage listings and review buyer inquiries.
          </p>
        </div>
        <Link
          to="/admin/properties/new"
          className="px-5 py-2.5 bg-ink text-paper text-sm hover:bg-brass transition-colors"
        >
          Add property
        </Link>
      </div>

      <div className="flex gap-6 mt-8 border-b border-stone">
        <TabButton active={tab === "properties"} onClick={() => setTab("properties")}>
          Properties ({properties.length})
        </TabButton>
        <TabButton active={tab === "inquiries"} onClick={() => setTab("inquiries")}>
          Inquiries ({inquiries.length})
        </TabButton>
      </div>

      <div className="mt-6">
        {loading && <p className="text-taupe py-10 text-center">Loading…</p>}

        {!loading && error && (
          <p className="text-brick py-10 text-center">Couldn't load dashboard: {error}</p>
        )}

        {!loading && !error && (
          <>
            {deleteError && (
              <p className="text-brick text-sm mb-4 bg-brick/5 border border-brick/20 px-4 py-3">
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
      className={`pb-3 text-sm border-b-2 -mb-px transition-colors ${
        active ? "border-brass text-ink" : "border-transparent text-taupe hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}