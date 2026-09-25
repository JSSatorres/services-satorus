/** Current monitor regression: reverse scroll, direct links and retained interaction. */
module.exports = async function checkMonitors(page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("http://localhost:3117/#como-trabajamos");
  await page.reload();
  await page.locator('[data-phase="reading"][data-destination="0"]').waitFor();
  await page
    .getByRole("button", {
      name: "Ver paso 3: Construimos y probamos contigo",
      exact: true,
    })
    .click();
  const selected = await page
    .getByRole("button", {
      name: "Ver paso 3: Construimos y probamos contigo",
      exact: true,
    })
    .getAttribute("aria-pressed");
  if (selected !== "true") throw Error("Process illustration did not change");
  await page.locator('[data-office-panel="0"]').focus();
  await page.keyboard.press("Escape");
  await page.locator('[data-phase="office"]').waitFor();
  await page
    .getByRole("button", { name: "Entrar en Proyectos", exact: true })
    .click();
  await page.locator('[data-phase="reading"][data-destination="2"]').waitFor();
  await page
    .getByRole("link", {
      name: "Mira algunos de nuestros proyectos",
      exact: true,
    })
    .click();
  await page.waitForURL("**/productos");
  await page.goBack();
  await page.locator('[data-phase="reading"][data-destination="2"]').waitFor();
  await page.goto("http://localhost:3117/#preguntas");
  await page.locator('[data-phase="reading"][data-destination="3"]').waitFor();
  await page
    .getByText("¿Puedo empezar por una parte pequeña?", { exact: true })
    .click();
  const answer = page.getByText(
    "Sí. Podemos plantear una primera fase centrada en una necesidad concreta y valorar después qué merece la pena ampliar.",
    { exact: true },
  );
  await answer.waitFor();
  return {
    process: "passed",
    escape: "passed",
    physicalMarkers: "passed",
    projectHistory: "passed",
    faqAnchor: "passed",
  };
};
