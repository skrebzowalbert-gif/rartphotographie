import {
  clean,
  emailShell,
  escapeHtml,
  formatValue,
  getResendConfig,
  row,
} from "@/lib/email";

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  type?: string;
  message?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ContactPayload;

    const name = clean(body.name, 120);
    const email = clean(body.email, 180);
    const phone = clean(body.phone, 40);
    const type = clean(body.type, 120);
    const message = clean(body.message, 2000);
    const submittedAt = new Intl.DateTimeFormat("de-DE", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Europe/Berlin",
    }).format(new Date());

    if (!name || !email || !type || !message) {
      return Response.json(
        { error: "Name, E-Mail, Anfrageart und Nachricht sind erforderlich." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { error: "Bitte gib eine gültige E-Mail-Adresse ein." },
        { status: 400 }
      );
    }

    if (phone && !/^[+\d\s()/.-]{5,40}$/.test(phone)) {
      return Response.json(
        { error: "Bitte gib eine gültige Telefonnummer ein." },
        { status: 400 }
      );
    }

    const resendConfig = getResendConfig();

    if (!resendConfig.ok) {
      return Response.json(
        { error: resendConfig.error },
        { status: 500 }
      );
    }

    const html = emailShell(
      "Neue Anfrage über die Webseite",
      `
        ${row("Name", name)}
        ${row("E-Mail", email)}
        ${row("Telefon", phone)}
        ${row("Anfrageart", type)}
        ${row("Datum", submittedAt)}
        <p><strong>Nachricht:</strong></p>
        <p style="white-space: pre-wrap;">${escapeHtml(formatValue(message))}</p>
      `
    );

    const text = [
      "Neue Anfrage Webseite",
      "",
      `Name: ${formatValue(name)}`,
      `E-Mail: ${formatValue(email)}`,
      `Telefon: ${formatValue(phone)}`,
      `Anfrageart: ${formatValue(type)}`,
      `Datum: ${submittedAt}`,
      "",
      "Nachricht:",
      formatValue(message),
    ]
      .filter((line) => line !== "")
      .join("\n");

    const { error } = await resendConfig.resend.emails.send({
      from: `R.ArtPhotographie <${resendConfig.fromEmail}>`,
      to: [resendConfig.toEmail],
      replyTo: email,
      subject: `Neue Anfrage Webseite: ${type} - ${name}`,
      html,
      text,
    });

    if (error) {
      return Response.json({ error: "E-Mail konnte nicht gesendet werden." }, { status: 500 });
    }

    await resendConfig.resend.emails
      .send({
        from: `R.ArtPhotographie <${resendConfig.fromEmail}>`,
        to: [email],
        subject: "Deine Anfrage ist angekommen",
        html: emailShell(
          "Danke für deine Anfrage",
          `
            <p style="margin:0 0 14px;">Hallo ${escapeHtml(name)},</p>
            <p style="margin:0 0 14px;">deine Anfrage ist bei R.ArtPhotographie angekommen. Regina meldet sich schnellstmöglich persönlich bei dir.</p>
            ${row("Anfrageart", type)}
            ${row("Datum", submittedAt)}
          `
        ),
        text: [
          `Hallo ${name},`,
          "",
          "deine Anfrage ist bei R.ArtPhotographie angekommen. Regina meldet sich schnellstmöglich persönlich bei dir.",
          "",
          `Anfrageart: ${type}`,
          `Datum: ${submittedAt}`,
        ].join("\n"),
      })
      .catch(() => null);

    return Response.json({
      success: true,
      message: "Vielen Dank. Deine Anfrage wurde erfolgreich gesendet.",
    });
  } catch {
    return Response.json(
      { error: "Interner Serverfehler." },
      { status: 500 }
    );
  }
}
