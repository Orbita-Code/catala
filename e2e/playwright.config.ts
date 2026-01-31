import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:3000",
    httpCredentials: {
      username: process.env.BASIC_AUTH_USER ?? "catala",
      password: process.env.BASIC_AUTH_PASS ?? "catala2025",
    },
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 30000,
  },
  projects: [
    { name: "smoke", testMatch: "smoke.spec.ts" },
    { name: "la-classe", testMatch: "themes/la-classe.spec.ts" },
    { name: "l-escola", testMatch: "themes/l-escola.spec.ts" },
    { name: "el-cos", testMatch: "themes/el-cos.spec.ts" },
    { name: "la-roba", testMatch: "themes/la-roba.spec.ts" },
    { name: "la-casa", testMatch: "themes/la-casa.spec.ts" },
    { name: "la-familia", testMatch: "themes/la-familia.spec.ts" },
    { name: "les-botigues", testMatch: "themes/les-botigues.spec.ts" },
    { name: "el-menjar", testMatch: "themes/el-menjar.spec.ts" },
    { name: "els-animals", testMatch: "themes/els-animals.spec.ts" },
    { name: "la-ciutat", testMatch: "themes/la-ciutat.spec.ts" },
    { name: "els-vehicles", testMatch: "themes/els-vehicles.spec.ts" },
    { name: "els-oficis", testMatch: "themes/els-oficis.spec.ts" },
  ],
});
