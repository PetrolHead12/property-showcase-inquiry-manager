
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { fetchProperty, createProperty, updateProperty } from "../lib/api";
import type { PropertyStatus, PropertyImageInput } from "../lib/types";

interface FormState {
  name: string;
  location: string;
  price: string;
  size_sqft: string;
  bedrooms: string;
  description: string;
  status: PropertyStatus;
  images: PropertyImageInput[];
}

const EMPTY_FORM: FormState = {
  name: "",
  location: "",
  price: "",
  size_sqft: "",
  bedrooms: "",
  description: "",
  status: "available",
  images: [{ image_url: "", is_primary: true, display_order: 0 }],
};

export function PropertyFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchProperty(id).then((p) => {
      setForm({
        name: p.name,
        location: p.location,
        price: String(p.price),
        size_sqft: String(p.size_sqft),
        bedrooms: String(p.bedrooms),
        description: p.description,
        status: p.status,
        images: p.images.length
          ? p.images.map((img) => ({
              image_url: img.image_url,
              is_primary: img.is_primary,
              display_order: img.display_order,
            }))
          : EMPTY_FORM.images,
      });
      setLoading(false);
    });
  }, [id]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateImage(index: number, url: string) {
    setForm((prev) => ({
      ...prev,
      images: prev.images.map((img, i) => (i === index ? { ...img, image_url: url } : img)),
    }));
  }

  function setPrimaryImage(index: number) {
    setForm((prev) => ({
      ...prev,
      images: prev.images.map((img, i) => ({ ...img, is_primary: i === index })),
    }));
  }

  function addImageRow() {
    setForm((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        { image_url: "", is_primary: false, display_order: prev.images.length },
      ],
    }));
  }

  function removeImageRow(index: number) {
    setForm((prev) => {
      const next = prev.images.filter((_, i) => i !== index);
      // Keep exactly one primary image if the removed row was primary.
      if (prev.images[index]?.is_primary && next.length > 0) {
        next[0] = { ...next[0], is_primary: true };
      }
      return { ...prev, images: next };
    });
  }

  function validate(): Record<string, string> {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (!form.location.trim()) next.location = "Location is required.";
    if (!form.description.trim()) next.description = "Description is required.";

    const price = Number(form.price);
    if (!form.price || Number.isNaN(price) || price <= 0) {
      next.price = "Price must be a positive number.";
    }

    const size = Number(form.size_sqft);
    if (!form.size_sqft || Number.isNaN(size) || size <= 0) {
      next.size_sqft = "Size must be a positive number.";
    }

    const bedrooms = Number(form.bedrooms);
    if (form.bedrooms === "" || Number.isNaN(bedrooms) || bedrooms < 0) {
      next.bedrooms = "Bedrooms must be zero or a positive whole number.";
    }

    const validImages = form.images.filter((img) => img.image_url.trim());
    if (validImages.length === 0) {
      next.images = "At least one image URL is required.";
    } else if (
      validImages.some((img) => !img.image_url.startsWith("http://") && !img.image_url.startsWith("https://"))
    ) {
      next.images = "Image URLs must start with http:// or https://";
    }

    return next;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const validImages = form.images
      .filter((img) => img.image_url.trim())
      .map((img, i) => ({ ...img, display_order: i }));

    const payload = {
      name: form.name.trim(),
      location: form.location.trim(),
      price: Number(form.price),
      size_sqft: Number(form.size_sqft),
      bedrooms: Number(form.bedrooms),
      description: form.description.trim(),
      status: form.status,
      images: validImages,
    };

    setSaving(true);
    try {
      if (isEdit && id) {
        await updateProperty(id, payload);
      } else {
        await createProperty(payload);
      }
      navigate("/admin");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Couldn't save property.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="max-w-2xl mx-auto px-6 py-16 text-taupe">Loading…</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <Link to="/admin" className="text-sm text-taupe hover:text-brass">
        ← Back to dashboard
      </Link>

      <h1 className="font-display text-3xl text-ink mt-4">
        {isEdit ? "Edit property" : "Add a property"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5 mt-8">
        <Field label="Name" htmlFor="name" error={errors.name}>
          <input
            id="name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Location" htmlFor="location" error={errors.location}>
          <input
            id="location"
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
            className={inputClass}
            placeholder="e.g. Whitefield, Bengaluru"
          />
        </Field>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Price (₹)" htmlFor="price" error={errors.price}>
            <input
              id="price"
              type="number"
              min="1"
              step="any"
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="Size (sq ft)" htmlFor="size_sqft" error={errors.size_sqft}>
            <input
              id="size_sqft"
              type="number"
              min="1"
              value={form.size_sqft}
              onChange={(e) => update("size_sqft", e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="Bedrooms" htmlFor="bedrooms" error={errors.bedrooms}>
            <input
              id="bedrooms"
              type="number"
              min="0"
              value={form.bedrooms}
              onChange={(e) => update("bedrooms", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Status" htmlFor="status">
          <select
            id="status"
            value={form.status}
            onChange={(e) => update("status", e.target.value as PropertyStatus)}
            className={inputClass}
          >
            <option value="available">Available</option>
            <option value="under_offer">Under offer</option>
            <option value="sold">Sold</option>
          </select>
        </Field>

        <Field label="Description" htmlFor="description" error={errors.description}>
          <textarea
            id="description"
            rows={4}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            className={inputClass}
          />
        </Field>

        <div>
          <p className="text-sm text-taupe mb-2">Image URLs</p>
          <div className="space-y-2">
            {form.images.map((img, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="primary-image"
                  checked={img.is_primary}
                  onChange={() => setPrimaryImage(i)}
                  aria-label={`Set image ${i + 1} as primary`}
                  title="Primary image"
                />
                <input
                  value={img.image_url}
                  onChange={(e) => updateImage(i, e.target.value)}
                  placeholder="https://…"
                  className={`${inputClass} flex-1`}
                />
                {form.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageRow(i)}
                    className="text-taupe hover:text-brick text-sm px-2"
                    aria-label={`Remove image ${i + 1}`}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addImageRow}
            className="text-sm text-brass hover:underline underline-offset-2 mt-2"
          >
            + Add another image
          </button>
          {errors.images && <p className="text-brick text-sm mt-2">{errors.images}</p>}
          <p className="text-xs text-taupe mt-1">
            Select the radio button next to the image that should appear in the showcase grid.
          </p>
        </div>

        {submitError && <p className="text-brick text-sm">{submitError}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-ink text-paper text-sm hover:bg-brass transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : isEdit ? "Save changes" : "Add property"}
          </button>
          <Link
            to="/admin"
            className="px-6 py-2.5 border border-stone text-ink text-sm hover:border-taupe transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={htmlFor} className="text-sm text-taupe">
        {label}
      </label>
      {children}
      {error && <p className="text-brick text-xs">{error}</p>}
    </div>
  );
}

const inputClass =
  "border border-stone bg-paper px-3 py-2 text-sm focus:outline-none focus-visible:outline-2 focus-visible:outline-brass w-full";