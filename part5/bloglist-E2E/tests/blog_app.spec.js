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
      const notifDiv = await page.locator(".notification");
      await expect(notifDiv).toContainText(
        "testuser has succesfully logged in"
      );
    });

    test("Login fails with wrong credentials", async ({ page }) => {
      await page.getByTestId("username-input").fill("wrong user");
      await page.getByTestId("password-input").fill("wrong password");
      await page.getByRole("button", { name: "login" }).click();
      const errorDiv = await page.locator(".error");
      await expect(errorDiv).toContainText("invalid username or password");
    });
  });

  describe("When user is logged in", () => {
    beforeEach(async ({ page }) => {
      await page.getByTestId("username-input").fill("testuser");
      await page.getByTestId("password-input").fill("testuser");
      await page.getByRole("button", { name: "login" }).click();
    });

    test("User can create a blog", async ({ page }) => {
      await page.getByRole("button", { name: "new blog" }).click();
      await page.getByTestId("title-input").fill("test title");
      await page.getByTestId("author-input").fill("test author");
      await page.getByTestId("url-input").fill("test url");
      await page.getByRole("button", { name: "create" }).click();
      
      const notifDiv = await page.locator(".notification");
      await expect(notifDiv).toContainText(
        "a new blog test title has been added"
      );

      const newBlog = await page.getByText("test title by test author");
      await expect(newBlog).toBeVisible();
    });
  });
});
