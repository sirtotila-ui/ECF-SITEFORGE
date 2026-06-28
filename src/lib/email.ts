import { Resend } from "resend";
import type { Order } from "./constants";
import { PACKAGES } from "./constants";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export async function sendOrderConfirmationEmail(order: Order): Promise<boolean> {
  const resend = getResend();
  if (!resend) {
    console.warn("RESEND_API_KEY non configurata — email non inviata");
    return false;
  }

  const pkg = PACKAGES[order.packageId];
  const { formData } = order;
  const fromEmail = process.env.EMAIL_FROM || "SiteForge <onboarding@resend.dev>";

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: formData.email,
    subject: `Conferma ordine SiteForge — Pacchetto ${pkg.name}`,
    html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; background: #0a0a0f; color: #f1f5f9; padding: 40px 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: #12121a; border-radius: 12px; padding: 40px; border: 1px solid #2a2a3a;">
            <h1 style="color: #6366f1; margin-top: 0;">Grazie per il tuo ordine!</h1>
            <p>Ciao <strong>${formData.businessName}</strong>,</p>
            <p>Abbiamo ricevuto il tuo pagamento per il pacchetto <strong>${pkg.name} (${pkg.priceLabel})</strong>.</p>
            <p>Il team ECF Media inizierà a lavorare al tuo sito web entro 24 ore lavorative.</p>
            
            <div style="background: #1a1a26; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <h3 style="margin-top: 0; color: #22d3ee;">Riepilogo ordine</h3>
              <p><strong>Pacchetto:</strong> ${pkg.name}</p>
              <p><strong>Attività:</strong> ${formData.businessName}</p>
              <p><strong>Settore:</strong> ${formData.businessSector}</p>
              <p><strong>Email:</strong> ${formData.email}</p>
              <p><strong>Telefono:</strong> ${formData.phone}</p>
              <p><strong>ID Ordine:</strong> ${order.id}</p>
            </div>

            <p>Ti contatteremo a <strong>${formData.email}</strong> per eventuali chiarimenti.</p>
            <p style="color: #94a3b8; font-size: 14px; margin-top: 32px;">
              — Il team SiteForge by ECF Media<br>
              <a href="mailto:info@ecfmedia.it" style="color: #6366f1;">info@ecfmedia.it</a>
            </p>
          </div>
        </body>
      </html>
    `,
  });

  if (error) {
    console.error("Errore invio email:", error);
    return false;
  }
  return true;
}

export async function sendAdminNotificationEmail(order: Order): Promise<boolean> {
  const resend = getResend();
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!resend || !adminEmail) return false;

  const pkg = PACKAGES[order.packageId];
  const { formData } = order;
  const fromEmail = process.env.EMAIL_FROM || "SiteForge <onboarding@resend.dev>";

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: adminEmail,
    subject: `Nuovo ordine SiteForge — ${formData.businessName} (${pkg.name})`,
    html: `
      <h2>Nuovo ordine pagato</h2>
      <p><strong>ID:</strong> ${order.id}</p>
      <p><strong>Pacchetto:</strong> ${pkg.name} — ${pkg.priceLabel}</p>
      <p><strong>Attività:</strong> ${formData.businessName}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Telefono:</strong> ${formData.phone}</p>
      <p><strong>Settore:</strong> ${formData.businessSector}</p>
    `,
  });

  return !error;
}
