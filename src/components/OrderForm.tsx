"use client";

import { useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  FORM_SECTIONS,
  EMPTY_FORM_DATA,
  PACKAGES,
  type FormData,
  type PackageId,
} from "@/lib/constants";

export function OrderForm() {
  const searchParams = useSearchParams();
  const packageParam = (searchParams.get("pacchetto") || "pro") as PackageId;
  const selectedPackage = PACKAGES[packageParam] ? packageParam : "pro";
  const pkg = PACKAGES[selectedPackage];

  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const section = FORM_SECTIONS[currentSection];
  const isLastSection = currentSection === FORM_SECTIONS.length - 1;
  const progress = ((currentSection + 1) / FORM_SECTIONS.length) * 100;

  const updateField = useCallback((name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const validateSection = (): boolean => {
    for (const field of section.fields) {
      if (field.required && !formData[field.name as keyof FormData]?.trim()) {
        setError(`Il campo "${field.label}" è obbligatorio`);
        return false;
      }
    }
    setError("");
    return true;
  };

  const handleNext = () => {
    if (!validateSection()) return;
    if (isLastSection) {
      handleSubmit();
    } else {
      setCurrentSection((s) => s + 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: selectedPackage,
          formData,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Errore durante il checkout");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore imprevisto");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-2xl px-6">
        <Link
          href="/#pacchetti"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Torna ai pacchetti
        </Link>

        <div className="mb-8 rounded-2xl border border-primary/30 bg-surface-elevated p-6">
          <p className="text-sm text-muted">Pacchetto selezionato</p>
          <p className="text-xl font-bold">
            {pkg.name} — <span className="text-primary">{pkg.priceLabel}</span>
          </p>
        </div>

        <div className="mb-8">
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-muted">
              Sezione {currentSection + 1} di {FORM_SECTIONS.length}
            </span>
            <span className="text-muted">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-elevated">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-4 flex gap-2">
            {FORM_SECTIONS.map((s, i) => (
              <div
                key={s.id}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i <= currentSection ? "bg-primary" : "bg-border"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-8">
          <h2 className="mb-1 text-2xl font-bold">{section.title}</h2>
          <p className="mb-8 text-muted">{section.description}</p>

          <div className="space-y-6">
            {section.fields.map((field) => (
              <div key={field.name}>
                <label className="mb-2 block text-sm font-medium">
                  {field.label}
                  {field.required && <span className="text-primary"> *</span>}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    value={formData[field.name as keyof FormData]}
                    onChange={(e) => updateField(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    rows={4}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                ) : field.type === "select" ? (
                  <select
                    value={formData[field.name as keyof FormData]}
                    onChange={(e) => updateField(field.name, e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">Seleziona...</option>
                    {"options" in field &&
                      field.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.name as keyof FormData]}
                    onChange={(e) => updateField(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                )}
              </div>
            ))}
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </p>
          )}

          <div className="mt-8 flex gap-4">
            {currentSection > 0 && (
              <button
                type="button"
                onClick={() => setCurrentSection((s) => s - 1)}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-medium transition-colors hover:border-primary/50 disabled:opacity-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Indietro
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              disabled={loading}
              className="ml-auto flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Reindirizzamento...
                </>
              ) : isLastSection ? (
                <>
                  <Check className="h-4 w-4" />
                  Procedi al pagamento
                </>
              ) : (
                <>
                  Avanti
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
