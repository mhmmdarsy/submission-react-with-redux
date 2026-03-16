/*
 * Skenario Pengujian:
 * - Pengguna berhasil login dari halaman /login dan diarahkan ke halaman utama.
 */

describe("Login flow", () => {
  it("should login successfully and show authenticated navigation", () => {
    cy.intercept("POST", "https://forum-api.dicoding.dev/v1/login", {
      statusCode: 200,
      body: {
        status: "success",
        message: "ok",
        data: {
          token: "token-123",
        },
      },
    }).as("loginRequest");

    cy.intercept("GET", "https://forum-api.dicoding.dev/v1/users/me", {
      statusCode: 200,
      body: {
        status: "success",
        message: "ok",
        data: {
          user: {
            id: "user-1",
            name: "Dicoding Tester",
            email: "tester@example.com",
            avatar: "https://example.com/avatar.png",
          },
        },
      },
    }).as("profileRequest");

    cy.visit("/login");

    cy.get("#email").type("tester@example.com");
    cy.get("#password").type("123456");
    cy.contains("button", "Login").click();

    cy.wait("@loginRequest");
    cy.wait("@profileRequest");

    cy.url().should("eq", "http://127.0.0.1:3000/");
    cy.contains("Dicoding Tester").should("be.visible");
    cy.contains("button", "Logout").should("be.visible");
  });
});
