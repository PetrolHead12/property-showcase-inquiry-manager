
import { useState, type FormEvent } from "react";
import { submitInquiry } from "../lib/api";

interface InquiryFormProps {
  propertyId: number;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const EMPTY_FORM: FormState = { name: "", email: "", phone: "", message: "" };

export function InquiryForm({ propertyId }: InquiryFormProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await submitInquiry(propertyId, form);
      setSubmitted(true);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-stone p-6">
        <p className="font-display text-lg text-ink">Thank you — we've received your inquiry</p>
        <p className="text-taupe text-sm mt-2">
          A member of our sales team will reach out to you shortly.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-sm text-brass underline underline-offset-2 mt-4"
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-display text-xl text-ink">Enquire about this property</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full name" htmlFor="name">
          <input
            id="name"
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Email" htmlFor="email">
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Phone" htmlFor="phone">
        <input
          id="phone"
          type="tel"
          required
          minLength={7}
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Message" htmlFor="message">
        <textarea
          id="message"
          required
          rows={4}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          className={inputClass}
        />
      </Field>

      {error && <p className="text-brick text-sm">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full sm:w-auto px-6 py-2.5 bg-ink text-paper text-sm hover:bg-brass transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Sending…" : "Send inquiry"}
      </button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={htmlFor} className="text-sm text-taupe">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "border border-stone bg-paper px-3 py-2 text-sm focus:outline-none focus-visible:outline-2 focus-visible:outline-brass";