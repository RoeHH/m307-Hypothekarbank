/// <reference types="cypress" />

describe("creating new Hypothek", () => {
  beforeEach(() => {
    cy.visit("localhost:3000");
  });

  it("should create new hypothek", () => {
    cy.get("button").then(($el) => {
      cy.get("#new").click();
      cy.get('input[name="name"]').type("Test");
      cy.get('input[name="vorname"]').type("Test");
      cy.get('input[name="email"]').type("a@b.ch");
      cy.get('input[name="phone"]').type("774449393");
      cy.get('input[name="wert"]').type("10030303030");
      cy.get('button[type="submit"]').click();
      cy.get("button").should(
        "have.length",
        Cypress.dom.unwrap($el).length + 1,
      );
    });
  });
});
