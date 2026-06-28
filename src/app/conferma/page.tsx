import { CheckCircle, Clock, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { getStripe } from "@/lib/stripe";
import { getOrder } from "@/lib/orders";
import { PACKAGES } from "@/lib/constants";

interface PageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function ConfermaPage({ searchParams }: PageProps) {
  const { session_id } = await searchParams;

  let businessName = "";
  let packageName = "";
  let orderId = "";
  let email = "";
  let isPaid = false;

  if (session_id) {
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(session_id);
      orderId =
        session.metadata?.orderId ||
        session.client_reference_id ||
        "";

      if (orderId) {
        const order = await getOrder(orderId);
        if (order) {
          businessName = order.formData.businessName;
          email = order.formData.email;
          packageName = PACKAGES[order.packageId].name;
          isPaid = order.status === "paid";
        }
      }
    } catch {
      // Session retrieval failed — show generic waiting message
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <div className="mb-8 flex justify-center">
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-full ${
              isPaid ? "bg-primary/20" : "bg-accent/10"
            }`}
          >
            {isPaid ? (
              <CheckCircle className="h-10 w-10 text-primary" />
            ) : (
              <Loader2 className="h-10 w-10 animate-spin text-accent" />
            )}
          </div>
        </div>

        <h1 className="mb-4 text-3xl font-bold md:text-4xl">
          {isPaid ? "Pagamento confermato!" : "Pagamento in elaborazione"}
        </h1>
        <p className="mb-8 text-lg text-muted">
          {isPaid && businessName ? (
            <>
              Grazie <strong className="text-foreground">{businessName}</strong>!
              Il tuo ordine per il pacchetto{" "}
              <strong className="text-foreground">{packageName}</strong> è stato confermato.
            </>
          ) : isPaid ? (
            "Il tuo pagamento è stato confermato con successo."
          ) : (
            <>
              Stiamo verificando il tuo pagamento con Stripe.
              {businessName && (
                <>
                  {" "}
                  Grazie <strong className="text-foreground">{businessName}</strong>!
                </>
              )}{" "}
              Riceverai un&apos;email di conferma entro pochi minuti.
            </>
          )}
        </p>

        <div className="mb-10 space-y-4 rounded-2xl border border-border bg-surface p-8 text-left">
          {!isPaid && (
            <div className="flex items-start gap-4">
              <Loader2 className="mt-0.5 h-5 w-5 shrink-0 animate-spin text-accent" />
              <div>
                <p className="font-medium">Attendi la conferma</p>
                <p className="text-sm text-muted">
                  Non chiudere questa pagina. La conferma definitiva arriva via email
                  non appena Stripe completa la transazione.
                </p>
              </div>
            </div>
          )}
          <div className="flex items-start gap-4">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <div>
              <p className="font-medium">Prossimi passi</p>
              <p className="text-sm text-muted">
                {isPaid
                  ? "Il team ECF Media inizierà a lavorare al tuo sito entro 24 ore lavorative. Ti contacteremo per eventuali chiarimenti."
                  : "Una volta confermato il pagamento, il team ECF Media inizierà a lavorare al tuo sito entro 24 ore lavorative."}
              </p>
            </div>
          </div>
          {orderId && (
            <div className="border-t border-border pt-4">
              <p className="text-sm text-muted">
                ID Ordine: <span className="font-mono text-foreground">{orderId}</span>
              </p>
              {email && isPaid && (
                <p className="mt-1 text-sm text-muted">
                  Conferma inviata a{" "}
                  <span className="text-foreground">{email}</span>
                </p>
              )}
            </div>
          )}
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          Torna alla home
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
