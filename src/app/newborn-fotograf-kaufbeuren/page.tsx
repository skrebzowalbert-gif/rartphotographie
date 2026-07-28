import type { Metadata } from "next";
import ShootingLandingPage, {
  type ShootingLandingContent,
} from "@/components/sections/ShootingLandingPage";

export const metadata: Metadata = {
  title: "Newborn Fotograf Kaufbeuren – Babyfotos in den ersten Wochen",
  description:
    "Newborn Shooting in Kaufbeuren ab 250 €: 3 Stunden, 40 bearbeitete Bilder. Bester Zeitpunkt, Ablauf, Sicherheit und wie du einen Termin sicherst.",
  alternates: { canonical: "/newborn-fotograf-kaufbeuren" },
  openGraph: {
    title: "Newborn Fotograf Kaufbeuren – Babyfotos in den ersten Wochen",
    description:
      "Newborn Shooting in Kaufbeuren ab 250 €. Bester Zeitpunkt, Ablauf, Sicherheit.",
    url: "/newborn-fotograf-kaufbeuren",
  },
};

const content: ShootingLandingContent = {
  path: "/newborn-fotograf-kaufbeuren",
  heading: "Newborn Fotograf in Kaufbeuren",
  intro:
    "Die ersten Tage sind schnell vorbei und lassen sich nicht wiederholen. Ein Newborn-Shooting braucht vor allem eines: Zeit und Ruhe, die sich nach dem Baby richtet.",
  serviceName: "Newbornshooting Kaufbeuren",
  serviceDescription:
    "Newborn- und Babyfotografie in Kaufbeuren und im Ostallgäu. 3 Stunden, 40 bearbeitete Bilder, ab 250 €.",
  requestValue: "Newbornshooting",
  price: "ab 250 €",
  duration: "etwa 3 Stunden",
  included: "40 bearbeitete Bilder",
  image: {
    src: "/images/newborn/newborn-1.jpg",
    alt: "Newborn Shooting in Kaufbeuren: schlafendes Neugeborenes wird in den Händen der Eltern gehalten",
  },
  secondaryImage: {
    src: "/images/newborn/newborn-2.jpg",
    alt: "Newborn-Shooting in Kaufbeuren: Neugeborenes in den ersten Lebenstagen",
  },
  facts: [
    { label: "Dauer", value: "Etwa 3 Stunden, inklusive Pausen" },
    { label: "Preis", value: "250 €, keine versteckten Kosten" },
    { label: "Enthalten", value: "40 bearbeitete Bilder als digitale Dateien" },
    { label: "Bester Zeitpunkt", value: "In den ersten 5 bis 14 Lebenstagen" },
  ],
  sections: [
    {
      heading: "Warum drei Stunden für ein Baby",
      paragraphs: [
        "Ein Neugeborenes funktioniert nicht nach Zeitplan. Es wird hungrig, wenn es hungrig ist, und wach, wenn es wach ist. Deshalb ist ein Newborn-Termin bei mir auf etwa drei Stunden angelegt – nicht, weil drei Stunden fotografiert wird, sondern weil Stillen, Wickeln, Trösten und Einschlafen dazugehören.",
        "Diese Pausen sind eingeplant und nicht geduldet. Wer ein Baby in 45 Minuten durchfotografieren will, bekommt am Ende angespannte Bilder – und angespannte Eltern.",
        "Für dich heißt das: Du musst nichts vorbereiten und nichts beschleunigen. Wenn dein Baby zwischendurch eine Dreiviertelstunde trinkt und schläft, ist das kein verlorener Termin, sondern der normale Ablauf.",
      ],
    },
    {
      heading: "Der beste Zeitpunkt",
      paragraphs: [
        "Für die klassischen, ruhig zusammengerollten Aufnahmen liegt das beste Fenster zwischen dem 5. und dem 14. Lebenstag. In dieser Zeit schlafen die meisten Babys noch sehr tief und lassen sich gut in weiche, natürliche Positionen legen.",
        "Danach werden Neugeborene wacher und strecken sich mehr. Möglich sind Aufnahmen weiterhin – sie sehen nur anders aus, mit mehr offenen Augen und mehr Bewegung. Auch das kann sehr schön sein, es ist nur nicht dasselbe Bild.",
        "Praktischer Rat: Melde dich schon während der Schwangerschaft, am besten im letzten Drittel. Wir halten dann ein Zeitfenster fest statt eines festen Tages und legen den genauen Termin fest, sobald dein Baby da ist. Anders lässt sich ein Zeitraum von zehn Tagen kaum planen.",
      ],
    },
    {
      heading: "Sicherheit und Ablauf",
      paragraphs: [
        "Beim Newborn-Shooting steht die Sicherheit des Babys über jedem Bildeinfall. Positionen, bei denen ein Neugeborenes ohne Unterstützung gehalten oder aufgestützt wird, entstehen nicht als Einzelaufnahme, sondern nur mit sichernden Händen im Bild. Wenn ein Baby eine Position nicht mag, wird sie nicht erzwungen.",
        "Der Raum wird warm gehalten, deutlich wärmer als normal – Neugeborene kühlen schnell aus, und ein frierendes Baby schläft nicht. Bring bitte alles mit, was ihr ohnehin braucht: Wechselkleidung, Windeln, ein zusätzliches Tuch und, falls du abpumpst, eine Flasche.",
        "Geschwisterkinder können dabei sein. Ihre Aufnahmen machen wir dann am besten gleich zu Beginn, solange die Aufmerksamkeitsspanne noch da ist.",
        "Auch Eltern kommen mit aufs Bild, wenn ihr das möchtet. Viele Familien empfinden gerade diese Aufnahmen im Nachhinein als die wichtigsten.",
      ],
    },
    {
      heading: "Wo das Shooting stattfindet",
      paragraphs: [
        "Newborn-Shootings finden in Kaufbeuren und Umgebung statt. Ein Termin bei euch zu Hause hat den Vorteil, dass ihr mit einem wenige Tage alten Baby nicht fahren müsst und alles Vertraute griffbereit ist.",
        "Ich fotografiere im gesamten Ostallgäu, unter anderem in Neugablonz, Marktoberdorf, Buchloe, Biessenhofen, Kempten und Füssen. Weitere Orte nach Absprache, die Anfahrt wird dann individuell berechnet.",
      ],
    },
  ],
  faq: [
    {
      question: "Was kostet ein Newborn Shooting in Kaufbeuren?",
      answer:
        "Ein Newbornshooting kostet 250 €. Enthalten sind etwa drei Stunden inklusive aller Pausen und 40 bearbeitete Bilder als digitale Dateien.",
    },
    {
      question: "Wann sollte das Newborn Shooting stattfinden?",
      answer:
        "Für die klassischen, zusammengerollten Aufnahmen zwischen dem 5. und 14. Lebenstag. Später sind Aufnahmen weiterhin möglich, sehen aber anders aus, weil Babys dann wacher sind und sich mehr strecken.",
    },
    {
      question: "Wie kann ich einen Termin planen, wenn der Geburtstermin unsicher ist?",
      answer:
        "Wir halten während der Schwangerschaft ein Zeitfenster fest statt eines festen Tages. Sobald dein Baby da ist, legen wir den genauen Termin darin fest.",
    },
    {
      question: "Was muss ich mitbringen oder vorbereiten?",
      answer:
        "Wechselkleidung, Windeln, ein zusätzliches Tuch und bei Bedarf eine Flasche. Sonst nichts. Der Raum wird warm gehalten, damit dein Baby entspannt schlafen kann.",
    },
    {
      question: "Können Geschwister und Eltern mit aufs Bild?",
      answer:
        "Ja, ohne Aufpreis. Aufnahmen mit Geschwisterkindern entstehen am besten zu Beginn des Termins.",
    },
    {
      question: "Werden riskante Posen fotografiert?",
      answer:
        "Nein. Positionen, bei denen ein Neugeborenes ohne Unterstützung gehalten würde, entstehen nur mit sichernden Händen im Bild. Was das Baby nicht mag, wird nicht erzwungen.",
    },
  ],
  related: [
    { href: "/babybauch-shooting-kaufbeuren", label: "Babybauch Shooting Kaufbeuren" },
    { href: "/familienfotograf-kaufbeuren", label: "Familienshooting Kaufbeuren" },
    { href: "/gutscheine", label: "Als Gutschein verschenken" },
    { href: "/galerie", label: "Galerie ansehen" },
  ],
};

export default function NewbornKaufbeurenPage() {
  return <ShootingLandingPage content={content} />;
}
