import type { Metadata } from "next";
import ShootingLandingPage, {
  type ShootingLandingContent,
} from "@/components/sections/ShootingLandingPage";

export const metadata: Metadata = {
  title: "Babybauch Shooting Kaufbeuren – Preise, Ablauf & Termine",
  description:
    "Babybauchshooting in Kaufbeuren ab 200 €: 1 Stunde, 40 bearbeitete Bilder. Bester Zeitraum, Kleidung, Ablauf – und wie du einen Termin bekommst.",
  alternates: { canonical: "/babybauch-shooting-kaufbeuren" },
  openGraph: {
    title: "Babybauch Shooting Kaufbeuren – Preise, Ablauf & Termine",
    description:
      "Babybauchshooting in Kaufbeuren ab 200 €. Bester Zeitraum, Kleidung, Ablauf.",
    url: "/babybauch-shooting-kaufbeuren",
  },
};

const content: ShootingLandingContent = {
  path: "/babybauch-shooting-kaufbeuren",
  heading: "Babybauch Shooting in Kaufbeuren",
  intro:
    "Schwangerschaftsfotos, die nach euch aussehen und nicht nach Katalog. Ruhig begleitet, mit genug Zeit und ohne Posen, die sich unnatürlich anfühlen.",
  serviceName: "Babybauchshooting Kaufbeuren",
  serviceDescription:
    "Babybauch- und Schwangerschaftsfotografie in Kaufbeuren und im Ostallgäu. 1 Stunde, 40 bearbeitete Bilder, ab 200 €.",
  requestValue: "Babybauchshooting",
  price: "ab 200 €",
  duration: "1 Stunde",
  included: "40 bearbeitete Bilder",
  image: {
    src: "/images/babybauch/babybauch-1.jpg",
    alt: "Babybauchshooting in Kaufbeuren: werdende Eltern halten Babyschuhe vor dem Bauch",
  },
  facts: [
    { label: "Dauer", value: "Etwa 1 Stunde, ohne Zeitdruck" },
    { label: "Preis", value: "200 €, keine versteckten Kosten" },
    { label: "Enthalten", value: "40 bearbeitete Bilder als digitale Dateien" },
    { label: "Bester Zeitraum", value: "Zwischen der 30. und 36. Woche" },
  ],
  sections: [
    {
      heading: "Wann ist der richtige Zeitpunkt?",
      paragraphs: [
        "Der günstigste Zeitraum für ein Babybauchshooting liegt zwischen der 30. und der 36. Schwangerschaftswoche. Vorher ist der Bauch auf Fotos oft noch nicht deutlich zu erkennen, danach werden längeres Stehen, Bücken und Positionswechsel für viele Schwangere anstrengend.",
        "Wer zu Zwillingen oder Drillingen erwartet, sollte früher planen – hier passen häufig die Wochen 26 bis 30 besser, weil der Bauch schneller wächst und die Beschwerden früher einsetzen.",
        "Praktisch heißt das: Melde dich am besten schon im zweiten Drittel der Schwangerschaft. Dann lässt sich ein Termin finden, der zeitlich passt, statt kurzfristig irgendetwas zu nehmen. Wenn du unsicher bist, schreib mir einfach deinen errechneten Termin, und ich schlage ein Zeitfenster vor.",
      ],
    },
    {
      heading: "Was ziehe ich an?",
      paragraphs: [
        "Am besten funktionieren Kleidungsstücke, die den Bauch zeigen oder eng anliegen: ein schlichtes, figurbetontes Kleid, ein enges Oberteil mit hoher Hose, oder ein fließender Stoff, der Bewegung zulässt. Große Muster, auffällige Logos und weite, kastige Schnitte lenken vom Bauch ab.",
        "Ruhige, gedeckte Farben wirken auf Bildern meist hochwertiger als kräftige Signalfarben. Wenn dein Partner oder ältere Geschwisterkinder mit aufs Bild sollen: Stimmt die Farbfamilie grob ab, ohne dass alle dasselbe tragen.",
        "Ein praktischer Hinweis, den viele übersehen: Enge Bündchen, BH-Träger und Socken hinterlassen Abdrücke auf der Haut, die auf Fotos deutlich sichtbar sind. Zieh die betreffenden Sachen am besten schon eine Stunde vor dem Termin aus oder komm in weiter Kleidung und wechsle vor Ort.",
        "Wir besprechen Kleidung und Farben vor dem Termin. Du musst dir das nicht allein überlegen.",
      ],
    },
    {
      heading: "Wie läuft das Shooting ab?",
      paragraphs: [
        "Wir starten mit ein paar Minuten Ankommen und Reden, nicht sofort mit der Kamera. Danach leite ich dich Schritt für Schritt an: wohin mit den Händen, wie du stehst, in welche Richtung du schaust. Du musst vorher nichts können und dir keine Posen überlegen.",
        "Zwischendurch gibt es Pausen. Eine Stunde klingt kurz, ist im dritten Trimester aber für viele genau richtig – lieber konzentriert und entspannt als lang und erschöpfend.",
        "Dein Partner und ältere Geschwisterkinder können dabei sein. Gerade Bilder, auf denen ein größeres Kind den Bauch berührt, gehören später oft zu den liebsten Aufnahmen.",
        "Nach dem Termin sichte und bearbeite ich die Aufnahmen. Du bekommst 40 bearbeitete Bilder als digitale Dateien über eine Online-Galerie.",
      ],
    },
    {
      heading: "Wo wird fotografiert?",
      paragraphs: [
        "Babybauchshootings finden in Kaufbeuren und Umgebung statt – drinnen in ruhiger, gleichmäßiger Lichtsituation oder draußen in der Natur, je nachdem, welche Stimmung du dir wünschst. Auch bei dir zu Hause ist ein Shooting möglich, wenn dir die vertraute Umgebung lieber ist.",
        "Ich fotografiere im gesamten Ostallgäu, unter anderem in Neugablonz, Marktoberdorf, Buchloe, Biessenhofen, Kempten und Füssen. Weitere Orte sind nach Absprache möglich, die Anfahrt wird dann individuell berechnet.",
      ],
    },
  ],
  faq: [
    {
      question: "Was kostet ein Babybauch Shooting in Kaufbeuren?",
      answer:
        "Ein Babybauchshooting kostet 200 €. Enthalten sind etwa eine Stunde Shootingzeit und 40 bearbeitete Bilder als digitale Dateien. Es gibt keine versteckten Zusatzkosten.",
    },
    {
      question: "In welcher Schwangerschaftswoche sollte ich das Shooting machen?",
      answer:
        "Zwischen der 30. und 36. Schwangerschaftswoche. Bei Mehrlingen sind die Wochen 26 bis 30 meist passender, weil der Bauch schneller wächst.",
    },
    {
      question: "Kann mein Partner mitkommen?",
      answer:
        "Ja. Partner und ältere Geschwisterkinder können ohne Aufpreis dabei sein und mit aufs Bild.",
    },
    {
      question: "Was soll ich anziehen?",
      answer:
        "Enganliegende oder bauchbetonende Kleidung in ruhigen Farben. Vermeide enge Bündchen kurz vor dem Termin, weil sie Abdrücke auf der Haut hinterlassen. Wir besprechen die Kleidung vorher gemeinsam.",
    },
    {
      question: "Wie schnell bekomme ich die Bilder?",
      answer:
        "Du bekommst vorab eine realistische Einschätzung, die vom jeweiligen Auftragsaufkommen abhängt. Die Auslieferung erfolgt digital über eine Online-Galerie.",
    },
    {
      question: "Kann ich das Shooting verschenken?",
      answer:
        "Ja. Ein Wertgutschein ist online erhältlich und kann für ein Babybauchshooting eingesetzt werden.",
    },
  ],
  related: [
    { href: "/newborn-fotograf-kaufbeuren", label: "Newborn Shooting Kaufbeuren" },
    { href: "/familienfotograf-kaufbeuren", label: "Familienshooting Kaufbeuren" },
    { href: "/gutscheine", label: "Als Gutschein verschenken" },
    { href: "/galerie", label: "Galerie ansehen" },
  ],
};

export default function BabybauchKaufbeurenPage() {
  return <ShootingLandingPage content={content} />;
}
