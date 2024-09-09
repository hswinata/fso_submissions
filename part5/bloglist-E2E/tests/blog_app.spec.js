const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("Blog app", () => {
  beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    const headerText = await page.getByText("log in to application");
    expect(headerText).toBeVisible();

    const username = await page.getByText("username");
    expect(username).toBeVisible();

    const password = await page.getByText("password");
    expect(password).toBeVisible();
  });
});
