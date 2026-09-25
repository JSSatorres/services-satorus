/** End-to-end: the monitor is a real entry into the existing applications section. */
module.exports = async function checkMonitor(page) {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("http://localhost:3117/#herramientas");
  await page.locator('[data-render-state="ready"]').waitFor();
  await page.reload();
  await page.locator('[data-render-state="ready"]').waitFor();
  const entry = page.getByRole("button", {
    name: "Entrar en la pantalla",
    exact: true,
  });
  await entry.click({ timeout: 5000 });
  const dialog = page.getByRole("dialog", { name: "Aplicaciones a medida" });
  await dialog.locator("[data-screen-content]").waitFor({ timeout: 10000 });
  await dialog
    .getByRole("heading", { name: "Una herramienta a tu manera." })
    .waitFor();
  await dialog.getByRole("button", { name: "Equipo", exact: true }).click();
  await dialog.getByText("Cada persona sabe qué le toca.").waitFor();
  for (let index = 0; index < 12; index++) {
    await page.keyboard.press("Tab");
    if (
      !(await dialog.evaluate((element) =>
        element.contains(document.activeElement),
      ))
    ) {
      throw new Error("Focus escaped the monitor");
    }
  }
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "hidden" });
  if (
    (await page.locator("[data-world-stage]").getAttribute("data-chapter")) !==
    "3"
  )
    throw new Error("Return changed chapter");
  if (!(await entry.evaluate((el) => el === document.activeElement)))
    throw new Error("Focus was not restored");
  await entry.click();
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "hidden" });
  await entry.click();
  await dialog.locator("[data-screen-content]").waitFor();
  await dialog
    .getByRole("button", { name: "Hablemos de tu herramienta" })
    .click();
  await dialog.waitFor({ state: "hidden" });
  await page.locator('[data-world-stage][data-chapter="7"]').waitFor();
  return {
    entry: "passed",
    content: "passed",
    examples: "passed",
    escape: "passed",
    cancelEntry: "passed",
    focus: "passed",
    focusTrap: "passed",
    contact: "passed",
  };
};
