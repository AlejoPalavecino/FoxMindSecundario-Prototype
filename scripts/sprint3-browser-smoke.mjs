import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const BASE_URL = process.env.SMOKE_BASE_URL ?? "http://localhost:3000";
const EVIDENCE_DIR = "Documentacion/Evidencias/Sprint-3";

async function main() {
  await mkdir(EVIDENCE_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    await context.addCookies([
      { name: "foxmind_access_token", value: "smoke-token", url: BASE_URL },
      { name: "foxmind_role", value: "DOCENTE", url: BASE_URL }
    ]);

    await page.goto(`${BASE_URL}/interno/evidencias/sprint3`, { waitUntil: "domcontentloaded" });

    await page.locator("#docente-create-activity").screenshot({
      path: `${EVIDENCE_DIR}/01-docente-crea-actividad.png`
    });
    await page.locator("#alumno-submit-activity").screenshot({
      path: `${EVIDENCE_DIR}/02-alumno-entrega-actividad.png`
    });
    await page.locator("#docente-grade-submission").screenshot({
      path: `${EVIDENCE_DIR}/03-docente-corrige-entrega.png`
    });
    await page.locator("#alumno-view-feedback").screenshot({
      path: `${EVIDENCE_DIR}/04-alumno-visualiza-feedback.png`
    });
  } finally {
    await context.close();
    await browser.close();
  }
}

main().catch((error) => {
  console.error("Sprint 3 browser smoke failed", error);
  process.exit(1);
});
