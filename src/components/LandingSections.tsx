import { ArrowRight, Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { PACKAGES } from "@/lib/constants";

export function Hero() {
  return (
    <section className="hero-glow relative overflow-hidden pt-32 pb-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(34,211,238,0.08),transparent_50%)]" />
      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface-elevated px-4 py-1.5 text-sm text-muted">
          <Sparkles className="h-4 w-4 text-accent" />
          Siti web professionali per attività locali
        </div>
        <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
          Il tuo sito web,{" "}
          <span className="gradient-text">forgiato in automatico</span>
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-muted md:text-xl">
          SiteForge genera siti web moderni e ottimizzati per la tua attività locale.
          Compila il questionario, scegli il pacchetto e ricevi il tuo sito in pochi giorni.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="#pacchetti"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-white transition-all hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/25"
          >
            Scegli il tuo pacchetto
            <ArrowRight className="h-5 w-5" />
          </Link>
          <a
            href="#come-funziona"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface-elevated px-8 py-4 text-base font-medium text-foreground transition-colors hover:border-primary/50"
          >
            Scopri come funziona
          </a>
        </div>
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-muted">
          {["Consegna in 48h–5 giorni", "Design su misura", "SEO inclusa", "Supporto dedicato"].map(
            (item) => (
              <span key={item} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-accent" />
                {item}
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Scegli il pacchetto",
      description: "Base, Pro o Elite — in base alle esigenze della tua attività.",
    },
    {
      step: "02",
      title: "Compila il questionario",
      description: "22 domande in 6 sezioni per raccontarci tutto sulla tua attività.",
    },
    {
      step: "03",
      title: "Paga in sicurezza",
      description: "Checkout Stripe sicuro. Accettiamo carte, Apple Pay e Google Pay.",
    },
    {
      step: "04",
      title: "Ricevi il tuo sito",
      description: "Il nostro team forgia il tuo sito e te lo consegna pronto all'uso.",
    },
  ];

  return (
    <section id="come-funziona" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Come funziona</h2>
          <p className="text-muted">Quattro passi per avere il sito della tua attività</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((item) => (
            <div
              key={item.step}
              className="rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-primary/30"
            >
              <span className="text-3xl font-bold text-primary/40">{item.step}</span>
              <h3 className="mt-4 mb-2 text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Pricing() {
  return (
    <section id="pacchetti" className="bg-surface py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Scegli il tuo pacchetto</h2>
          <p className="text-muted">Prezzi trasparenti, nessun costo nascosto</p>
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          {Object.values(PACKAGES).map((pkg) => (
            <div
              key={pkg.id}
              className={`card-glow relative flex flex-col rounded-2xl border bg-surface-elevated p-8 transition-all ${
                pkg.popular
                  ? "border-primary shadow-lg shadow-primary/10"
                  : "border-border"
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-white">
                  Più popolare
                </span>
              )}
              <h3 className="text-xl font-bold">{pkg.name}</h3>
              <div className="mt-4 mb-2">
                <span className="text-4xl font-bold">{pkg.priceLabel}</span>
                <span className="text-muted"> una tantum</span>
              </div>
              <p className="mb-6 text-sm text-muted">{pkg.description}</p>
              <ul className="mb-8 flex-1 space-y-3">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href={`/ordine?pacchetto=${pkg.id}`}
                className={`block rounded-xl py-3 text-center text-sm font-semibold transition-all ${
                  pkg.popular
                    ? "bg-primary text-white hover:bg-primary-hover"
                    : "border border-border bg-background text-foreground hover:border-primary/50"
                }`}
              >
                Acquista ora
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FAQ() {
  const faqs = [
    {
      q: "Quanto tempo ci vuole per ricevere il sito?",
      a: "Dipende dal pacchetto: da 48 ore (Elite) a 5 giorni lavorativi (Base).",
    },
    {
      q: "Posso modificare il sito dopo la consegna?",
      a: "Sì, tutti i pacchetti includono modifiche minori post-consegna. Il pacchetto Elite include 30 giorni di supporto prioritario.",
    },
    {
      q: "Il pagamento è sicuro?",
      a: "Assolutamente. Utilizziamo Stripe, il leader mondiale nei pagamenti online, con crittografia end-to-end.",
    },
    {
      q: "Cosa succede dopo il pagamento?",
      a: "Riceverai un'email di conferma e il nostro team inizierà a lavorare al tuo progetto entro 24 ore.",
    },
  ];

  return (
    <section id="faq" className="py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Domande frequenti</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-xl border border-border bg-surface p-6 open:border-primary/30"
            >
              <summary className="cursor-pointer font-medium">{faq.q}</summary>
              <p className="mt-3 text-sm text-muted">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTA() {
  return (
    <section className="border-t border-border bg-surface py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
          Pronto a portare la tua attività online?
        </h2>
        <p className="mb-8 text-muted">
          Unisciti a centinaia di attività locali che hanno scelto SiteForge.
        </p>
        <Link
          href="#pacchetti"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 font-semibold text-white transition-all hover:bg-primary-hover"
        >
          Inizia ora
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}
