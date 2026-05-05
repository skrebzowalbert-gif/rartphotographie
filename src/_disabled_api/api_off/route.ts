import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  type?: string;
  message?: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ContactPayload;

    const name = body.name?.trim() || "";
    const email = body.email?.trim() || "";
    const phone = body.phone?.trim() || "";
    const type = body.type?.trim() || "";
    const message = body.message?.trim() || "";

    if (!name || !email || !type) {
      return Response.json(
        { error: "Name, E-Mail und Kategorie sind erforderlich." },
        { status: 400 }
      );
    }

    const to = process.env.CONTACT_TO_EMAIL;
    const from = process.env.CONTACT_FROM_EMAIL;

    if (!process.env.RESEND_API_KEY || !to || !from) {
      return Response.json(
        { error: "Server-Konfiguration unvollständig." },
        { status: 500 }
      );
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone || "—");
    const safeType = escapeHtml(type);
    const safeMessage = escapeHtml(message || "—");

    const { data, error } = await resend.emails.send({
      from: `R.ArtPhotographie <${from}>`,
      to: [to],
      subject: `Neue Anfrage: ${type} – ${name}`,
      replyTo: email,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
          <h2>Neue Anfrage über die Website</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>E-Mail:</strong> ${safeEmail}</p>
          <p><strong>Telefon:</strong> ${safePhone}</p>
          <p><strong>Kategorie:</strong> ${safeType}</p>
          <p><strong>Nachricht:</strong></p>
          <p style="white-space: pre-wrap;">${safeMessage}</p>
        </div>
      `,
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ success: true, data });
  } catch {
    return Response.json(
      { error: "Interner Serverfehler." },
      { status: 500 }
    );
  }
}
