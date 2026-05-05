import { Resend } from "resend";
import { publicContactEmail } from "@/lib/site";

export const CONTACT_TO_EMAIL =
  process.env.CONTACT_TO_EMAIL || publicContactEmail;

export function clean(value: unknown, maxLength = 500) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
}

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function formatValue(value: string | number | null | undefined) {
  return value === undefined || value === null || value === ""
    ? "—"
    : String(value);
}

export function row(label: string, value: string | number | null | undefined) {
  return `<p style="margin:0 0 10px;"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(
    formatValue(value)
  )}</p>`;
}

export function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || apiKey === "DEIN_RESEND_KEY" || !fromEmail) {
    return {
      ok: false as const,
      error: "Server-Konfiguration unvollständig.",
    };
  }

  return {
    ok: true as const,
    resend: new Resend(apiKey),
    fromEmail,
    toEmail: CONTACT_TO_EMAIL,
  };
}

export function emailShell(title: string, content: string) {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111;background:#f4efe8;padding:28px;">
      <div style="max-width:680px;margin:0 auto;background:#fff;padding:28px;border-radius:18px;">
        <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#777;">
          R.ArtPhotographie
        </p>
        <h1 style="margin:0 0 24px;font-size:26px;line-height:1.2;">${escapeHtml(title)}</h1>
        ${content}
      </div>
    </div>
  `;
}
