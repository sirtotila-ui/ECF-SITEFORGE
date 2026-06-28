import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getStripe } from "@/lib/stripe";
import { saveOrder } from "@/lib/orders";
import { getBaseUrl } from "@/lib/env";
import { PACKAGES, getStripePaymentLink, type PackageId, type FormData } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const packageId = body.packageId as PackageId;
    const formData = body.formData as FormData;

    if (!PACKAGES[packageId]) {
      return NextResponse.json({ error: "Pacchetto non valido" }, { status: 400 });
    }

    if (!formData?.email || !formData?.businessName) {
      return NextResponse.json({ error: "Dati mancanti" }, { status: 400 });
    }

    const orderId = randomUUID();
    const pkg = PACKAGES[packageId];
    const baseUrl = getBaseUrl();

    await saveOrder({
      id: orderId,
      packageId,
      formData,
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    const paymentLink = getStripePaymentLink(packageId);

    if (paymentLink.startsWith("http")) {
      const url = new URL(paymentLink);
      url.searchParams.set("client_reference_id", orderId);
      url.searchParams.set("prefilled_email", formData.email);
      return NextResponse.json({ url: url.toString() });
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: formData.email,
      client_reference_id: orderId,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `SiteForge ${pkg.name}`,
              description: `Sito web professionale — Pacchetto ${pkg.name}`,
            },
            unit_amount: pkg.price,
          },
          quantity: 1,
        },
      ],
      metadata: {
        orderId,
        packageId,
        businessName: formData.businessName.slice(0, 500),
      },
      success_url: `${baseUrl}/conferma?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/ordine?pacchetto=${packageId}`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe non ha restituito un URL di pagamento" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    const stripeMessage =
      err && typeof err === "object" && "message" in err
        ? String((err as { message: string }).message)
        : null;

    const message = stripeMessage?.includes("STRIPE_SECRET_KEY")
      ? "Pagamenti non configurati. Riavvia il server dopo aver salvato .env.local"
      : stripeMessage?.includes("Supabase")
        ? "Database non configurato. Verifica le credenziali Supabase in .env.local"
        : stripeMessage || "Errore durante la creazione del checkout";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
