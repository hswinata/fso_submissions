const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    // Empty the test database.
    await request.post("http://localhost:3003/api/testing/reset");

    //Add a new user.
    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "testuser",
        username: "testuser",
        password: "testuser",
      },
    });

    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    const headerText = await page.getByText("log in to application");
    await expect(headerText).toBeVisible();

    const username = await page.getByText("username");
    await expect(username).toBeVisible();

    const password = await page.getByText("password");
    await expect(password).toBeVisible();
  });

  describe("Login", () => {
    test("Login succeeds with correct credentials", async ({ page }) => {
      await page.getByTestId("username-input").fill("testuser");
      await page.getByTestId("password-input").fill("testuser");
      await page.getByRole("button", { name: "login" }).click();

      await expect(
        page.getByText("testuser has succesfully logged in")
      ).toBeVisible();
    });

    test("Login fails with wrong credentials", async ({ page }) => {
      await page.getByTestId("username-input").fill("wrong user");
      await page.getByTestId("password-input").fill("wrong password");
      await page.getByRole("button", { name: "login" }).click();

      await expect(
        page.getByText("invalid username or password")
      ).toBeVisible();
    });
  });
});
