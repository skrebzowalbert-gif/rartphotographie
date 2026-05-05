import { defineConfig, devices } from "playwright/test";

export default defineConfig({
  testDir: "./tests",
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
