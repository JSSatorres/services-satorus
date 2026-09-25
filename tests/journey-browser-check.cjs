/** Run with a Playwright Page against the production preview on port 3117.
 * Regression: focusing an entering sticky panel must not change the chapter.
 * Contact submission is intercepted and never sends mail.
 */
module.exports = async function checkJourney(page) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("http://localhost:3117/");
  await page.locator('[data-render-state="ready"]').waitFor();
  const ids = [
    "inicio",
    "como-trabajamos",
    "diagnostico",
    "herramientas",
    "automatizacion",
    "proyectos",
    "preguntas",
    "contacto",
  ];
  const nav = (id) =>
    page.locator(`nav[aria-label="Capítulos del negocio"] a[href="#${id}"]`);
  for (let index = 0; index < ids.length; index++) {
    await nav(ids[index]).click();
    await page.waitForFunction(
      (index) =>
        document
          .querySelector("[data-world-stage]")
          ?.getAttribute("data-chapter") === String(index),
      index,
    );
  }
  await page.locator('input[name="name"]').fill("Prueba Satorus");
  await nav("preguntas").click();
  await page.locator("aside:not([hidden]) summary").first().click();
  if (
    (await page
      .locator("aside:not([hidden]) details")
      .first()
      .getAttribute("open")) === null
  )
    throw new Error("FAQ did not open");
  await nav("contacto").click();
  if (
    (await page.locator('input[name="name"]').inputValue()) !== "Prueba Satorus"
  )
    throw new Error("Contact draft was lost");
  await page.route("**/api/contact", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ message: "Envío simulado correcto" }),
    }),
  );
  await page.locator('input[name="email"]').fill("prueba@example.com");
  await page
    .locator('textarea[name="message"]')
    .fill("Prueba automatizada del formulario sin enviar correo real.");
  await page.locator('input[name="consent"]').check();
  await page.locator('form button[type="submit"]').click({ timeout: 5000 });
  await page.getByText("Envío simulado correcto").waitFor();
  await nav("proyectos").click();
  await page.getByRole("button", { name: "Enrolla2", exact: true }).click();
  await page
    .locator('aside:not([hidden]) a[href="/proyectos/enrolla2"]')
    .first()
    .click({ timeout: 5000 });
  await page.waitForURL("**/proyectos/enrolla2");
  await page.goBack();
  await page.locator('[data-world-stage][data-chapter="5"]').waitFor();
  if (
    await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)
  )
    throw new Error("Horizontal overflow");
  return {
    chapters: 8,
    faq: "passed",
    contactDraft: "passed",
    mockedSubmit: "passed",
    projectHistory: "passed",
    horizontalOverflow: false,
  };
};
