import { Resend } from "resend";
import type { Order, FormData } from "./constants";
import { PACKAGES, FORM_SECTIONS } from "./constants";

const DELIVERY_TIMES: Record<Order["packageId"], string> = {
  base: "5 giorni lavorativi",
  pro: "3 giorni lavorativi",
  elite: "48 ore (express)",
};

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function getFromEmail() {
  return process.env.EMAIL_FROM || "SiteForge <onboarding@resend.dev>";
}

function getAdminEmail() {
  return process.env.ADMIN_EMAIL || "sir.totila@gmail.com";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatValue(value: string | undefined): string {
  const trimmed = value?.trim();
  if (!trimmed) return '<span style="color:#94a3b8">—</span>';
  return escapeHtml(trimmed).replace(/\n/g, "<br>");
}

function emailLayout(title: string, content: string): string {
  return `<!DOCTYPE html>
<html lang="it">
  <body style="margin:0;font-family:Arial,sans-serif;background:#0a0a0f;color:#f1f5f9;padding:40px 20px;">
    <div style="max-width:640px;margin:0 auto;background:#12121a;border-radius:12px;padding:40px;border:1px solid #2a2a3a;">
      <p style="margin:0 0 8px;color:#6366f1;font-size:13px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;">SiteForge by ECF Media</p>
      <h1 style="margin:0 0 24px;color:#f1f5f9;font-size:24px;">${title}</h1>
      ${content}
      <p style="color:#94a3b8;font-size:13px;margin-top:32px;border-top:1px solid #2a2a3a;padding-top:20px;">
        SiteForge by ECF Media · <a href="mailto:info@ecfmedia.it" style="color:#6366f1;">info@ecfmedia.it</a>
      </p>
    </div>
  </body>
</html>`;
}

function buildFormSectionsHtml(formData: FormData): string {
  return FORM_SECTIONS.map((section) => {
    const rows = section.fields
      .map((field) => {
        const value = formData[field.name as keyof FormData];
        return `<tr>
          <td style="padding:8px 12px 8px 0;color:#94a3b8;vertical-align:top;width:40%;">${escapeHtml(field.label)}</td>
          <td style="padding:8px 0;color:#f1f5f9;vertical-align:top;">${formatValue(value)}</td>
        </tr>`;
      })
      .join("");

    return `
      <div style="margin-bottom:24px;">
        <h3 style="margin:0 0 12px;color:#22d3ee;font-size:16px;">${escapeHtml(section.title)}</h3>
        <table style="width:100%;border-collapse:collapse;">${rows}</table>
      </div>`;
  }).join("");
}

export async function sendOrderConfirmationEmail(order: Order): Promise<boolean> {
  const resend = getResend();
  if (!resend) {
    console.warn("RESEND_API_KEY non configurata — email cliente non inviata");
    return false;
  }

  const pkg = PACKAGES[order.packageId];
  const { formData } = order;
  const deliveryTime = DELIVERY_TIMES[order.packageId];
  const featuresList = pkg.features
    .map((f) => `<li style="margin-bottom:6px;">${escapeHtml(f)}</li>`)
    .join("");

  const content = `
    <p style="color:#cbd5e1;line-height:1.6;">Ciao <strong>${escapeHtml(formData.businessName)}</strong>,</p>
    <p style="color:#cbd5e1;line-height:1.6;">
      Abbiamo ricevuto il tuo pagamento per il pacchetto <strong>${escapeHtml(pkg.name)}</strong>
      (${escapeHtml(pkg.priceLabel)}). Il tuo ordine è confermato!
    </p>

    <div style="background:#1a1a26;border-radius:8px;padding:20px;margin:24px 0;">
      <h3 style="margin:0 0 12px;color:#22d3ee;font-size:16px;">Riepilogo pacchetto</h3>
      <p style="margin:0 0 8px;color:#f1f5f9;"><strong>${escapeHtml(pkg.name)}</strong> — ${escapeHtml(pkg.priceLabel)}</p>
      <p style="margin:0 0 16px;color:#94a3b8;font-size:14px;">${escapeHtml(pkg.description)}</p>
      <ul style="margin:0;padding-left:20px;color:#cbd5e1;font-size:14px;">${featuresList}</ul>
    </div>

    <div style="background:#1a1a26;border-radius:8px;padding:20px;margin:24px 0;">
      <h3 style="margin:0 0 12px;color:#22d3ee;font-size:16px;">Tempi di consegna</h3>
      <p style="margin:0;color:#f1f5f9;font-size:18px;font-weight:bold;">${escapeHtml(deliveryTime)}</p>
      <p style="margin:8px 0 0;color:#94a3b8;font-size:14px;">
        Il team ECF Media inizierà a lavorare al tuo sito entro 24 ore lavorative.
      </p>
    </div>

    <div style="background:#1a1a26;border-radius:8px;padding:20px;margin:24px 0;">
      <h3 style="margin:0 0 12px;color:#22d3ee;font-size:16px;">Dettagli ordine</h3>
      <p style="margin:4px 0;color:#cbd5e1;"><strong>Attività:</strong> ${escapeHtml(formData.businessName)}</p>
      <p style="margin:4px 0;color:#cbd5e1;"><strong>Email:</strong> ${escapeHtml(formData.email)}</p>
      <p style="margin:4px 0;color:#cbd5e1;"><strong>Telefono:</strong> ${escapeHtml(formData.phone)}</p>
      <p style="margin:4px 0;color:#94a3b8;font-size:13px;"><strong>ID Ordine:</strong> ${escapeHtml(order.id)}</p>
    </div>

    <p style="color:#cbd5e1;line-height:1.6;">
      Per qualsiasi domanda rispondi a questa email o scrivici a
      <a href="mailto:info@ecfmedia.it" style="color:#6366f1;">info@ecfmedia.it</a>.
    </p>`;

  const { error } = await resend.emails.send({
    from: getFromEmail(),
    to: formData.email,
    subject: `Conferma ordine SiteForge — Pacchetto ${pkg.name}`,
    html: emailLayout("Grazie per il tuo ordine!", content),
  });

  if (error) {
    console.error("Errore email cliente:", error);
    return false;
  }
  return true;
}

export async function sendAdminNotificationEmail(order: Order): Promise<boolean> {
  const resend = getResend();
  if (!resend) {
    console.warn("RESEND_API_KEY non configurata — email admin non inviata");
    return false;
  }

  const pkg = PACKAGES[order.packageId];
  const { formData } = order;
  const deliveryTime = DELIVERY_TIMES[order.packageId];

  const content = `
    <div style="background:#1a1a26;border-radius:8px;padding:20px;margin-bottom:24px;">
      <h3 style="margin:0 0 12px;color:#22d3ee;font-size:16px;">Ordine</h3>
      <p style="margin:4px 0;color:#f1f5f9;"><strong>ID:</strong> ${escapeHtml(order.id)}</p>
      <p style="margin:4px 0;color:#f1f5f9;"><strong>Pacchetto:</strong> ${escapeHtml(pkg.name)} — ${escapeHtml(pkg.priceLabel)}</p>
      <p style="margin:4px 0;color:#f1f5f9;"><strong>Consegna prevista:</strong> ${escapeHtml(deliveryTime)}</p>
      <p style="margin:4px 0;color:#94a3b8;font-size:13px;"><strong>Pagato il:</strong> ${escapeHtml(order.paidAt || new Date().toISOString())}</p>
      ${order.stripeSessionId ? `<p style="margin:4px 0;color:#94a3b8;font-size:13px;"><strong>Stripe Session:</strong> ${escapeHtml(order.stripeSessionId)}</p>` : ""}
    </div>

    <h3 style="margin:0 0 16px;color:#22d3ee;font-size:16px;">Questionario cliente (22 risposte)</h3>
    ${buildFormSectionsHtml(formData)}`;

  const { error } = await resend.emails.send({
    from: getFromEmail(),
    to: getAdminEmail(),
    subject: `🆕 Nuovo ordine — ${formData.businessName} (${pkg.name} ${pkg.priceLabel})`,
    html: emailLayout(`Nuovo ordine: ${formData.businessName}`, content),
  });

  if (error) {
    console.error("Errore email admin:", error);
    return false;
  }
  return true;
}

export async function sendOrderEmails(order: Order): Promise<void> {
  const [customerOk, adminOk] = await Promise.all([
    sendOrderConfirmationEmail(order),
    sendAdminNotificationEmail(order),
  ]);

  if (!customerOk || !adminOk) {
    console.error("Invio email parziale fallito", { customerOk, adminOk, orderId: order.id });
  }
}
