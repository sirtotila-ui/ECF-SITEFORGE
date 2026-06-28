import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getOrder, updateOrder } from "@/lib/orders";
import {
  sendOrderConfirmationEmail,
  sendAdminNotificationEmail,
} from "@/lib/email";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook non configurato" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature error:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true, skipped: "payment not completed" });
    }

    const orderId =
      session.metadata?.orderId || session.client_reference_id || undefined;

    if (orderId) {
      const order = await getOrder(orderId);
      if (order && order.status !== "paid") {
        const updated = await updateOrder(orderId, {
          status: "paid",
          paidAt: new Date().toISOString(),
          stripeSessionId: session.id,
        });
        if (updated) {
          await sendOrderConfirmationEmail(updated);
          await sendAdminNotificationEmail(updated);
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
