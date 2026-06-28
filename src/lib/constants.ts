export type PackageId = "base" | "pro" | "elite";

export interface Package {
  id: PackageId;
  name: string;
  price: number;
  priceLabel: string;
  description: string;
  features: string[];
  popular?: boolean;
}

export const PACKAGES: Record<PackageId, Package> = {
  base: {
    id: "base",
    name: "Base",
    price: 9700,
    priceLabel: "97€",
    description: "Perfetto per iniziare la tua presenza online",
    features: [
      "Sito web responsive fino a 5 pagine",
      "Design personalizzato con i tuoi colori",
      "Modulo contatti integrato",
      "Ottimizzazione SEO di base",
      "Consegna in 5 giorni lavorativi",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: 29700,
    priceLabel: "297€",
    description: "La scelta ideale per attività in crescita",
    features: [
      "Tutto del pacchetto Base",
      "Fino a 10 pagine + blog",
      "Integrazione Google Maps e recensioni",
      "SEO avanzata e analytics",
      "Modulo prenotazioni",
      "Consegna in 3 giorni lavorativi",
    ],
    popular: true,
  },
  elite: {
    id: "elite",
    name: "Elite",
    price: 69700,
    priceLabel: "697€",
    description: "Soluzione completa per massimizzare i risultati",
    features: [
      "Tutto del pacchetto Pro",
      "Pagine illimitate + e-commerce base",
      "Copywriting professionale incluso",
      "Integrazione social e newsletter",
      "Supporto prioritario 30 giorni",
      "Consegna express in 48 ore",
    ],
  },
};

export function getStripePaymentLink(packageId: PackageId): string {
  const links: Record<PackageId, string | undefined> = {
    base: process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_BASE,
    pro: process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_PRO,
    elite: process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_ELITE,
  };
  return links[packageId] || `/ordine?pacchetto=${packageId}`;
}

export interface FormData {
  // Sezione 1 - Dati Azienda
  businessName: string;
  businessSector: string;
  vatNumber: string;
  foundingYear: string;
  // Sezione 2 - Contatti
  email: string;
  phone: string;
  address: string;
  cityZip: string;
  // Sezione 3 - Brand & Identità
  tagline: string;
  preferredColors: string;
  hasLogo: string;
  logoUrl: string;
  // Sezione 4 - Contenuti
  businessDescription: string;
  mainServices: string;
  openingHours: string;
  serviceAreas: string;
  // Sezione 5 - Presenza Online
  currentWebsite: string;
  socialLinks: string;
  wantsBlog: string;
  // Sezione 6 - Extra
  specialFeatures: string;
  referenceWebsites: string;
  additionalNotes: string;
}

export interface Order {
  id: string;
  packageId: PackageId;
  formData: FormData;
  status: "pending" | "paid";
  createdAt: string;
  paidAt?: string;
  stripeSessionId?: string;
}

export const FORM_SECTIONS = [
  {
    id: 1,
    title: "Dati Azienda",
    description: "Informazioni base sulla tua attività",
    fields: [
      { name: "businessName", label: "Nome dell'attività", type: "text", required: true, placeholder: "Es. Ristorante Da Mario" },
      { name: "businessSector", label: "Settore / Categoria", type: "text", required: true, placeholder: "Es. Ristorazione, Parrucchiere, Studio medico..." },
      { name: "vatNumber", label: "Partita IVA o Codice Fiscale", type: "text", required: true, placeholder: "IT12345678901" },
      { name: "foundingYear", label: "Anno di fondazione", type: "text", required: false, placeholder: "Es. 2010" },
    ],
  },
  {
    id: 2,
    title: "Contatti",
    description: "Come possiamo raggiungerti",
    fields: [
      { name: "email", label: "Email", type: "email", required: true, placeholder: "nome@attivita.it" },
      { name: "phone", label: "Telefono", type: "tel", required: true, placeholder: "+39 333 1234567" },
      { name: "address", label: "Indirizzo sede", type: "text", required: true, placeholder: "Via Roma 1" },
      { name: "cityZip", label: "Città e CAP", type: "text", required: true, placeholder: "Milano, 20100" },
    ],
  },
  {
    id: 3,
    title: "Brand & Identità",
    description: "L'immagine che vuoi trasmettere",
    fields: [
      { name: "tagline", label: "Slogan o tagline", type: "text", required: false, placeholder: "Es. La tradizione dal 1985" },
      { name: "preferredColors", label: "Colori preferiti", type: "text", required: false, placeholder: "Es. Blu scuro e oro" },
      { name: "hasLogo", label: "Hai già un logo?", type: "select", required: true, options: ["Sì", "No, ne ho bisogno"] },
      { name: "logoUrl", label: "Link al logo (se disponibile)", type: "url", required: false, placeholder: "https://..." },
    ],
  },
  {
    id: 4,
    title: "Contenuti",
    description: "Cosa raccontare sul tuo sito",
    fields: [
      { name: "businessDescription", label: "Descrizione dell'attività", type: "textarea", required: true, placeholder: "Raccontaci la storia e i valori della tua attività..." },
      { name: "mainServices", label: "Servizi o prodotti principali", type: "textarea", required: true, placeholder: "Elenca i servizi che offri..." },
      { name: "openingHours", label: "Orari di apertura", type: "text", required: true, placeholder: "Lun-Ven 9:00-18:00, Sab 9:00-13:00" },
      { name: "serviceAreas", label: "Zone servite", type: "text", required: false, placeholder: "Es. Milano e hinterland" },
    ],
  },
  {
    id: 5,
    title: "Presenza Online",
    description: "La tua attuale presenza digitale",
    fields: [
      { name: "currentWebsite", label: "Sito web attuale (se esiste)", type: "url", required: false, placeholder: "https://..." },
      { name: "socialLinks", label: "Link social media", type: "textarea", required: false, placeholder: "Instagram, Facebook, LinkedIn..." },
      { name: "wantsBlog", label: "Vuoi una sezione blog/notizie?", type: "select", required: true, options: ["Sì", "No"] },
    ],
  },
  {
    id: 6,
    title: "Extra",
    description: "Dettagli finali per personalizzare il progetto",
    fields: [
      { name: "specialFeatures", label: "Funzionalità speciali richieste", type: "textarea", required: false, placeholder: "Prenotazioni online, menu digitale, galleria foto..." },
      { name: "referenceWebsites", label: "Siti di riferimento che ti piacciono", type: "textarea", required: false, placeholder: "Incolla link o descrivi siti che ti ispirano..." },
      { name: "additionalNotes", label: "Note aggiuntive", type: "textarea", required: false, placeholder: "Qualsiasi altra informazione utile..." },
    ],
  },
] as const;

export const EMPTY_FORM_DATA: FormData = {
  businessName: "",
  businessSector: "",
  vatNumber: "",
  foundingYear: "",
  email: "",
  phone: "",
  address: "",
  cityZip: "",
  tagline: "",
  preferredColors: "",
  hasLogo: "",
  logoUrl: "",
  businessDescription: "",
  mainServices: "",
  openingHours: "",
  serviceAreas: "",
  currentWebsite: "",
  socialLinks: "",
  wantsBlog: "",
  specialFeatures: "",
  referenceWebsites: "",
  additionalNotes: "",
};
