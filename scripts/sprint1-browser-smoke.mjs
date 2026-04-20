import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const BASE_URL = process.env.SMOKE_BASE_URL ?? "http://localhost:3000";
const EVIDENCE_DIR = "Documentacion/Evidencias/Sprint-1";

async function main() {
  await mkdir(EVIDENCE_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  try {
    await captureUnauthRedirect(browser);
    await captureDocenteDesktop(browser);
    await captureDocenteMobile(browser);
    await captureAlumnoMobile(browser);
    await captureRoleGuardRedirect(browser);
  } finally {
    await browser.close();
  }
}

async function captureUnauthRedirect(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto(`${BASE_URL}/docente`, { waitUntil: "networkidle" });
  await page.waitForURL("**/login");

  await page.screenshot({
    path: `${EVIDENCE_DIR}/01-guard-unauth-docente-desktop.png`,
    fullPage: true
  });

  await context.close();
}

async function captureDocenteDesktop(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await setRoleCookies(context, "DOCENTE");
  const page = await context.newPage();

  await page.goto(`${BASE_URL}/docente`, { waitUntil: "networkidle" });
  await page.waitForURL("**/docente");

  await page.screenshot({
    path: `${EVIDENCE_DIR}/02-docente-dashboard-desktop.png`,
    fullPage: true
  });

  await context.close();
}

async function captureDocenteMobile(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await setRoleCookies(context, "DOCENTE");
  const page = await context.newPage();

  await page.goto(`${BASE_URL}/docente`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Abrir menú de navegación" }).click();
  await page.locator(".role-nav").getByRole("link", { name: "Aulas", exact: true }).click();
  await page.waitForURL("**/docente/aulas");

  await page.screenshot({
    path: `${EVIDENCE_DIR}/03-docente-aulas-mobile.png`,
    fullPage: true
  });

  await context.close();
}

async function captureAlumnoMobile(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await setRoleCookies(context, "ALUMNO");
  const page = await context.newPage();

  await page.goto(`${BASE_URL}/alumno`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Abrir menú de navegación" }).click();
  await page.locator(".role-nav").getByRole("link", { name: "EstudIA", exact: true }).click();
  await page.waitForURL("**/alumno/estudia");

  await page.screenshot({
    path: `${EVIDENCE_DIR}/04-alumno-estudia-mobile.png`,
    fullPage: true
  });

  await context.close();
}

async function captureRoleGuardRedirect(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await setRoleCookies(context, "ALUMNO");
  const page = await context.newPage();

  await page.goto(`${BASE_URL}/docente`, { waitUntil: "networkidle" });
  await page.waitForURL("**/alumno");

  await page.screenshot({
    path: `${EVIDENCE_DIR}/05-guard-role-alumno-to-docente-redirect.png`,
    fullPage: true
  });

  await context.close();
}

async function setRoleCookies(context, role) {
  await context.addCookies([
    {
      name: "foxmind_access_token",
      value: "smoke-token",
      url: BASE_URL,
      httpOnly: false,
      sameSite: "Lax"
    },
    {
      name: "foxmind_role",
      value: role,
      url: BASE_URL,
      httpOnly: false,
      sameSite: "Lax"
    }
  ]);
}

main().catch((error) => {
  console.error("Sprint 1 browser smoke failed", error);
  process.exit(1);
});
