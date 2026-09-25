/** Current home: wheel reads each screen before flying to the next object. Contact is mocked. */
module.exports = async function checkJourney(page) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("http://localhost:3117/#inicio");
  await page.reload();
  await page.locator('[data-office-tour][data-render-state="ready"]').waitFor();
  await page.mouse.move(720, 480);
  await page.mouse.wheel(0, 180);
  await page.locator('[data-intro="office"]').waitFor({ timeout: 15000 });
  await page.waitForTimeout(900);
  await page.mouse.wheel(0, 180);
  const arrived = (index) =>
    page
      .locator(
        `[data-office-tour][data-phase="reading"][data-destination="${index}"]`,
      )
      .waitFor({ timeout: 12000 });
  await arrived(0);
  if (!page.url().endsWith("#como-trabajamos"))
    throw Error("First destination hash is wrong");
  await page.waitForTimeout(900);
  await page.mouse.move(1050, 500);
  await page.mouse.wheel(0, 220);
  await page.waitForFunction(
    () => document.querySelector('[data-office-panel="0"]').scrollTop > 0,
  );
  if (
    (await page
      .locator("[data-office-tour]")
      .getAttribute("data-destination")) !== "0"
  )
    throw Error("Reading started another flight");
  for (let index = 0; index < 3; index++) {
    await page.waitForTimeout(900);
    await page.mouse.wheel(0, 6000);
    await page.waitForFunction((index) => {
      const panel = document.querySelector(`[data-office-panel="${index}"]`);
      return panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 2;
    }, index);
    await page.waitForTimeout(220);
    await page.mouse.wheel(0, 180);
    await arrived(index + 1);
  }
  await page.getByLabel("Tu nombre", { exact: true }).fill("Prueba oficina");
  await page
    .getByRole("button", { name: "Ver la oficina", exact: true })
    .click();
  await page.locator('[data-office-tour][data-phase="office"]').waitFor();
  await page
    .getByRole("button", { name: "Entrar en Hablemos", exact: true })
    .click();
  await arrived(3);
  if (
    (await page.getByLabel("Tu nombre", { exact: true }).inputValue()) !==
    "Prueba oficina"
  )
    throw Error("Contact draft lost");
  await page.route("**/api/contact", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        message: "Consulta simulada. No se ha enviado correo.",
      }),
    }),
  );
  await page
    .getByLabel("Tu correo", { exact: true })
    .fill("prueba@example.com");
  await page
    .locator('textarea[name="message"]')
    .fill(
      "Prueba automatizada del recorrido de la oficina sin enviar correo real.",
    );
  await page.locator('input[name="consent"]').check();
  await page
    .getByRole("button", { name: "Enviar consulta", exact: true })
    .click();
  await page.getByText("Consulta simulada. No se ha enviado correo.").waitFor();
  return {
    scrollReading: "passed",
    threeScreens: "passed",
    envelope: "passed",
    draft: "passed",
    mockedContact: "passed",
  };
};
