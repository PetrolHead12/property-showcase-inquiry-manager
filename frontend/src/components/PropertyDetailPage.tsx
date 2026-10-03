/**
 * Place at: frontend/src/pages/PropertyDetailPage.tsx
 */
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProperty } from "../lib/api";
import type { Property } from "../lib/types";
import { formatPriceINR, formatSqft, formatBedrooms } from "../lib/format";
import { StatusPill } from "../components/StatusPill";
import { ImageGallery } from "../components/ImageGallery";
import { InquiryForm } from "../components/InquiryForm";

export function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchProperty(id)
      .then((data) => {
        if (!cancelled) setProperty(data);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-stone aspect-[16/10] animate-pulse" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-24 text-center">
        <p className="font-display text-xl text-ink">
          {error ? "Couldn't load this property" : "Property not found"}
        </p>
        <Link to="/" className="text-brass underline underline-offset-2 text-sm mt-3 inline-block">
          Back to showcase
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <Link to="/" className="text-sm text-taupe hover:text-brass">
        ← Back to showcase
      </Link>

      <div className="mt-6">
        <ImageGallery images={property.images} propertyName={property.name} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10">
        <div className="lg:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <h1 className="font-display text-3xl text-ink">{property.name}</h1>
            <StatusPill status={property.status} />
          </div>
          <p className="text-taupe mt-1">{property.location}</p>

          <div className="flex gap-6 mt-6 py-4 border-y border-stone text-sm">
            <div>
              <p className="text-taupe">Price</p>
              <p className="font-display text-brass text-lg mt-0.5">
                {formatPriceINR(property.price)}
              </p>
            </div>
            <div>
              <p className="text-taupe">Size</p>
              <p className="text-ink mt-0.5">{formatSqft(property.size_sqft)}</p>
            </div>
            <div>
              <p className="text-taupe">Configuration</p>
              <p className="text-ink mt-0.5">{formatBedrooms(property.bedrooms)}</p>
            </div>
          </div>

          <p className="text-ink leading-relaxed mt-6 max-w-prose">{property.description}</p>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-stone/50 border border-stone p-6">
            <InquiryForm propertyId={property.id} />
          </div>
        </div>
      </div>
    </div>
  );
}