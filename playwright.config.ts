import { readFileSync } from "node:fs";
import { defineConfig, devices } from "playwright/test";

/*
  .env.local in den Testlauf holen.

  Next.js liest die Datei für den Server selbst ein, der Testprozess aber
  nicht. Die Portal-Tests brauchen aber dieselben Werte – etwa das
  Einrichtungs-Token –, sonst prüfen sie an der Anwendung vorbei.
  Bewusst ohne zusätzliche Abhängigkeit und ohne Überschreiben bereits
  gesetzter Variablen.
*/
try {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && process.env[match[1]] === undefined) {
      process.env[match[1]] = match[2];
    }
  }
} catch {
  // Ohne .env.local laufen die Tests der öffentlichen Website weiterhin.
}

export default defineConfig({
  testDir: "./tests",

  /*
    Ein Arbeiter, nicht mehrere.

    Playwright führt Testdateien standardmäßig parallel aus. Die Portal-Tests
    teilen sich aber EINE Datenbank und setzen zu Beginn die Zugänge zurück –
    laufen zwei Dateien gleichzeitig, löscht die eine der anderen unter den
    Händen weg den Passkey. Das Ergebnis sind Fehlschläge, die je nach Timing
    mal auftreten und mal nicht.

    Die Suite braucht seriell rund eine Minute. Das ist der Preis dafür, dass
    ein roter Test etwas bedeutet.
  */
  workers: 1,
  timeout: 30_000,
  expect: {
    timeout: 7_000,
  },
  use: {
    baseURL: "http://localhost:3100",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run start -- --hostname 127.0.0.1 --port 3100",
    url: "http://localhost:3100",
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    {
      name: "mobile-chromium",
      use: {
        ...devices["iPhone 15"],
        /*
          Das Gerätesteckbrief "iPhone 15" bringt defaultBrowserType "webkit"
          mit. Ohne diese Zeile lief auch dieses Projekt auf WebKit – die Suite
          hat Chromium also nie geprüft, obwohl der Name das nahelegt.
          Chromium ist zugleich der Browser der Android-Mehrheit.
        */
        browserName: "chromium",
        viewport: { width: 390, height: 844 },
      },
    },
    {
      name: "mobile-webkit",
      use: {
        ...devices["iPhone 13"],
        viewport: { width: 390, height: 844 },
      },
    },
  ],
});
