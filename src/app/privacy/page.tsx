export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="mb-8 text-3xl font-bold">Privacy Policy</h1>
        <div className="prose prose-invert space-y-4 text-muted">
          <p>
            SiteForge by ECF Media rispetta la tua privacy. I dati raccolti tramite il
            questionario sono utilizzati esclusivamente per la creazione del tuo sito web
            e per comunicazioni relative al servizio.
          </p>
          <p>
            I pagamenti sono gestiti da Stripe. Non conserviamo i dati della tua carta di
            credito sui nostri server.
          </p>
          <p>
            Per richieste relative ai tuoi dati personali, contattaci a{" "}
            <a href="mailto:info@ecfmedia.it" className="text-primary hover:underline">
              info@ecfmedia.it
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
