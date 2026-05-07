import Image from "next/image";
import Link from "next/link";

type AboutPoint = {
  title: string;
  text: string;
};

const leftPoints: AboutPoint[] = [
  {
    title: "Ruhige Begleitung",
    text: "Ich leite dich durch das Shooting, ohne dich zu überfordern. Du bekommst klare Hinweise, aber kein gestelltes Programm.",
  },
  {
    title: "Klare Bildsprache",
    text: "Die Bilder sollen natürlich wirken und trotzdem besonders aussehen: mit ruhigen Farben, sauberem Licht und einem Blick für Details.",
  },
  {
    title: "Persönliche Nähe",
    text: "Mir ist wichtig, dass du dich gesehen fühlst. Viele gute Bilder entstehen erst dann, wenn die Anspannung nachlässt.",
  },
];

const rightPoints: AboutPoint[] = [
  {
    title: "Echte Momente",
    text: "Bei Hochzeiten, Familien und Babybauchshootings achte ich auf kleine Augenblicke, die später oft den größten Wert haben.",
  },
  {
    title: "Hochwertige Wirkung",
    text: "Du bekommst Bilder, die nicht nach Trend aussehen, sondern lange wirken: für dich, deine Familie oder als Erinnerung an einen besonderen Tag.",
  },
  {
    title: "Kaufbeuren & Allgäu",
    text: "Shootings finden in Kaufbeuren, Kempten, Marktoberdorf, Füssen und im gesamten Allgäu statt: im Studio, draußen oder an einem Ort, der zu dir passt.",
  },
];

function PointList({
  points,
  align,
}: {
  points: AboutPoint[];
  align: "left" | "right";
}) {
  const alignment =
    align === "right"
      ? "text-left lg:text-right lg:items-end"
      : "text-left lg:items-start";

  return (
    <div className={`flex flex-col gap-9 ${alignment}`}>
      {points.map((point) => (
        <div key={point.title} className="max-w-sm">
          <h3 className="text-xl font-medium leading-tight text-black md:text-2xl">
            {point.title}
          </h3>
          <p className="mt-3 text-sm leading-7 text-black/62 md:text-[15px] md:leading-8">
            {point.text}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function AboutEditorial() {
  return (
    <section className="overflow-x-hidden bg-[#faf8f3] px-6 py-24 text-black md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm uppercase tracking-[0.32em] text-black/38">
            Über Regina
          </p>

          <h2 className="mt-5 text-4xl font-light leading-[1] md:text-6xl md:leading-[0.98]">
            Du musst vor der Kamera
            <br />
            nichts können
          </h2>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-black/64 md:text-lg md:leading-9">
            Viele Menschen fühlen sich vor der Kamera unsicher. Genau deshalb
            wird jedes Shooting ruhig geführt, ohne Druck, ohne künstliche
            Posen und mit genug Zeit, damit Bilder entstehen können, die sich
            nach dir anfühlen.
          </p>
        </div>

        <div className="mt-24 grid gap-12 lg:mt-32 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.98fr)_minmax(0,1fr)] lg:items-center lg:gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(500px,1fr)_minmax(0,1fr)] xl:gap-12">
          <div className="order-2 lg:order-1">
            <PointList points={leftPoints} align="right" />
          </div>

          <div className="order-1 mx-auto flex w-full justify-center lg:order-2">
            <div className="relative h-[600px] w-[90vw] max-w-[420px] overflow-hidden md:h-[640px] md:w-[82vw] lg:h-[720px] lg:w-full lg:max-w-[500px] xl:h-[760px]">
              <Image
                src="/images/about/regina_about1.jpg"
                alt="Regina von R.ArtPhotographie Fotografin in Kaufbeuren und im Allgäu"
                fill
                sizes="(max-width: 768px) 90vw, (max-width: 1024px) 82vw, 500px"
                className="object-cover object-[center_45%] contrast-[1.02]"
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 w-[45%] bg-[linear-gradient(to_right,rgba(250,248,243,1)_0%,rgba(250,248,243,0.85)_15%,rgba(250,248,243,0.4)_30%,rgba(250,248,243,0)_45%)]" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-[40%] bg-[linear-gradient(to_left,rgba(250,248,243,1)_0%,rgba(250,248,243,0.6)_20%,rgba(250,248,243,0)_40%)]" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[35%] bg-[linear-gradient(to_top,rgba(250,248,243,0.9)_0%,rgba(250,248,243,0.6)_10%,rgba(250,248,243,0.2)_20%,rgba(250,248,243,0)_35%)]" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1/5 bg-[linear-gradient(to_bottom,rgba(250,248,243,0.4)_0%,rgba(250,248,243,0)_20%)]" />
            </div>
          </div>

          <div className="order-3">
            <PointList points={rightPoints} align="left" />
          </div>
        </div>

        <div className="mt-14 flex justify-center lg:mt-10">
          <Link
            href="/kontakt"
            className="inline-flex min-h-[56px] items-center justify-center rounded-full bg-black px-8 py-4 text-sm font-medium text-white transition hover:opacity-90"
            style={{ color: "#ffffff" }}
          >
            Shooting anfragen
          </Link>
        </div>
      </div>
    </section>
  );
}
