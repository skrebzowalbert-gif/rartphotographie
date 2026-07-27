import type { Metadata } from "next";
import ShootingLandingPage, {
  type ShootingLandingContent,
} from "@/components/sections/ShootingLandingPage";

export const metadata: Metadata = {
  title: "Familienfotograf Kaufbeuren – Familienshooting ab 250 €",
  description:
    "Familienshooting in Kaufbeuren ab 250 €: 2 Stunden, 40 bearbeitete Bilder. Ablauf mit Kindern, Kleidung, beste Tageszeit und Termine im Ostallgäu.",
  alternates: { canonical: "/familienfotograf-kaufbeuren" },
  openGraph: {
    title: "Familienfotograf Kaufbeuren – Familienshooting ab 250 €",
    description:
      "Familienshooting in Kaufbeuren ab 250 €. Ablauf mit Kindern, Kleidung, Termine.",
    url: "/familienfotograf-kaufbeuren",
  },
};

const content: ShootingLandingContent = {
  path: "/familienfotograf-kaufbeuren",
  heading: "Familienfotograf in Kaufbeuren",
  intro:
    "Familienbilder, auf denen ihr euch wiedererkennt. Ohne Kommando, ohne stillsitzen müssen – und mit genug Zeit, dass Kinder Kinder sein dürfen.",
  serviceName: "Familienshooting Kaufbeuren",
  serviceDescription:
    "Familienfotografie in Kaufbeuren und im Ostallgäu. 2 Stunden, 40 bearbeitete Bilder, ab 250 €.",
  requestValue: "Familienshooting",
  price: "ab 250 €",
  duration: "2 Stunden",
  included: "40 bearbeitete Bilder",
  image: {
    src: "/images/family/family-2.jpg",
    alt: "Familienshooting in Kaufbeuren: Familie in entspannter, natürlicher Aufnahme von R.ArtPhotographie",
  },
  facts: [
    { label: "Dauer", value: "Etwa 2 Stunden, ohne Zeitdruck" },
    { label: "Preis", value: "250 €, unabhängig von der Personenzahl" },
    { label: "Enthalten", value: "40 bearbeitete Bilder als digitale Dateien" },
    { label: "Beste Tageszeit", value: "Späte Nachmittagsstunden, weiches Licht" },
  ],
  sections: [
    {
      heading: "Warum zwei Stunden mit Kindern realistisch sind",
      paragraphs: [
        "Mit Kindern lässt sich ein Shooting nicht durchtakten. Kleine Kinder brauchen zwanzig Minuten, bis sie eine fremde Person und eine Kamera akzeptiert haben – und genau danach entstehen die guten Bilder. Deshalb sind zwei Stunden angesetzt, nicht dreißig Minuten.",
        "In dieser Zeit gibt es Pausen, Trinken, Herumlaufen und Phasen, in denen gar nicht fotografiert wird. Das ist kein Verlust, sondern die Voraussetzung dafür, dass die Aufnahmen später entspannt aussehen.",
        "Ein ehrlicher Hinweis für Eltern: Der häufigste Grund für angespannte Familienbilder sind nicht die Kinder, sondern die Ermahnungen zwischendurch. Je seltener „Guck mal in die Kamera“ und „Steh gerade“ gesagt wird, desto besser werden die Bilder. Diesen Teil übernehme ich.",
      ],
    },
    {
      heading: "Die richtige Tageszeit",
      paragraphs: [
        "Draußen ist das Licht in der letzten Stunde vor Sonnenuntergang am weichsten und schmeichelhaftesten. Im Sommer heißt das später Abend, im Winter schon früher Nachmittag – das lässt sich mit Kinderschlafzeiten nicht immer vereinbaren.",
        "Deshalb gilt in der Praxis: Der beste Zeitpunkt ist der, an dem eure Kinder ausgeschlafen und satt sind. Ein müdes Kind im perfekten Licht ergibt schlechtere Bilder als ein aufgewecktes Kind bei bedecktem Himmel. Bedeckter Himmel ist übrigens keine schlechte Nachricht: Er wirkt wie ein riesiger Diffusor und vermeidet harte Schatten.",
      ],
    },
    {
      heading: "Was ziehen wir an?",
      paragraphs: [
        "Am besten funktionieren aufeinander abgestimmte, aber nicht identische Farben. Wählt zwei bis drei ruhige Grundtöne, an denen sich alle orientieren – zum Beispiel Beige, Creme und ein gedecktes Blau. Der klassische Fehler sind einheitliche weiße Hemden mit Jeans: Das wirkt auf Bildern schnell wie eine Uniform.",
        "Vermeidet große Schriftzüge, auffällige Logos und kleinteilige Muster. Sie ziehen den Blick auf sich und lenken von den Gesichtern ab.",
        "Wichtig bei Kindern: Kleidung, in der sie sich bewegen, hinsetzen und herumtoben können. Ein Kind, das den ganzen Termin über an einem kratzigen Kragen zupft, sieht man auf jedem Bild.",
        "Wenn ihr unsicher seid, schickt mir vorher ein Foto der geplanten Kleidung. Das kostet nichts und erspart Ärger am Termin.",
      ],
    },
    {
      heading: "Wo wir fotografieren",
      paragraphs: [
        "Familienshootings finden draußen in der Natur, an einem für euch bedeutsamen Ort oder bei euch zu Hause statt. Gerade mit kleinen Kindern hat ein Termin zu Hause Vorteile: vertraute Umgebung, kurze Wege, alles Nötige griffbereit.",
        "Ich fotografiere in Kaufbeuren, Neugablonz, Marktoberdorf, Buchloe, Biessenhofen, Kempten, Füssen und im gesamten Ostallgäu. Weitere Orte nach Absprache, die Anfahrt wird dann individuell berechnet.",
        "Der Preis ist unabhängig von der Personenzahl. Ob ihr zu dritt oder zu acht kommt und ob Großeltern dazustoßen, ändert nichts am Betrag.",
      ],
    },
  ],
  faq: [
    {
      question: "Was kostet ein Familienshooting in Kaufbeuren?",
      answer:
        "Ein Familienshooting kostet 250 €. Enthalten sind etwa zwei Stunden und 40 bearbeitete Bilder als digitale Dateien. Der Preis ist unabhängig von der Anzahl der Personen.",
    },
    {
      question: "Was ist, wenn unsere Kinder nicht mitmachen?",
      answer:
        "Das ist der Normalfall und eingeplant. Zwei Stunden sind gerade deshalb angesetzt, weil Kinder Zeit brauchen, bis sie auftauen. Es wird nichts erzwungen, und es gibt Pausen.",
    },
    {
      question: "Wann ist die beste Tageszeit?",
      answer:
        "Draußen die letzte Stunde vor Sonnenuntergang. In der Praxis ist aber wichtiger, dass die Kinder ausgeschlafen und satt sind. Bedeckter Himmel ist für Fotos oft besser als greller Sonnenschein.",
    },
    {
      question: "Was sollen wir anziehen?",
      answer:
        "Zwei bis drei aufeinander abgestimmte, ruhige Grundtöne, aber nicht alle dasselbe. Große Logos und kleinteilige Muster vermeiden. Kinder brauchen Kleidung, in der sie sich frei bewegen können.",
    },
    {
      question: "Können Großeltern mit aufs Bild?",
      answer:
        "Ja. Der Preis ändert sich durch zusätzliche Personen nicht.",
    },
    {
      question: "Was passiert bei schlechtem Wetter?",
      answer:
        "Wir prüfen gemeinsam, ob ein anderer Ort, ein Termin bei euch zu Hause oder ein neuer Termin sinnvoll ist. Ein verregneter Tag kostet euch nichts.",
    },
  ],
  related: [
    { href: "/babybauch-shooting-kaufbeuren", label: "Babybauch Shooting Kaufbeuren" },
    { href: "/newborn-fotograf-kaufbeuren", label: "Newborn Shooting Kaufbeuren" },
    { href: "/gutscheine", label: "Als Gutschein verschenken" },
    { href: "/galerie", label: "Galerie ansehen" },
  ],
};

export default function FamilienfotografKaufbeurenPage() {
  return <ShootingLandingPage content={content} />;
}
