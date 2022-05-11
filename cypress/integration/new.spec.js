/// <reference types="cypress" />

describe("creating new Hypothek", () => {

  before(() => {
    cy.exec('npx prisma db seed')
  })

  beforeEach(() => {
    cy.visit("localhost:3000");
  });

  //1
  it("should create new hypothek", () => {
    cy.get("#new").click();
    cy.get('input[name="name"]').type("Test");
    cy.get('input[name="vorname"]').type("Test");
    cy.get('input[name="email"]').type("a@b.ch");
    cy.get('input[name="phone"]').type("774449393");
    cy.get('input[name="wert"]').type("10030303030");
    cy.get('button[type="submit"]').click();
    cy.get(".hypothek").should(
      "have.length",
      3,
    );
    cy.contains("Zu bezahlen: 10030303030");
    cy.contains("Bis: 28.8.2024");
    cy.contains("Risiko: sehrTief");
    cy.contains("Kunde: Test Test");
  });

  //2
  it("should create new hypothek with risk high", () => {
    cy.get("#new").click();
    cy.get('input[name="name"]').type("Test2");
    cy.get('input[name="vorname"]').type("Test2");
    cy.get('input[name="email"]').type("a@b.ch");
    cy.get('input[name="phone"]').type("774449393");
    cy.get('input[name="wert"]').type("23");
    cy.get('select[name="risk"').select("Hoch");
    cy.get('button[type="submit"]').click();
    cy.get(".hypothek").should(
      "have.length",
      4,
    );
    cy.contains("Zu bezahlen: 23");
    cy.contains("Bis: 6.5.2023");
    cy.contains("Risiko: hoch");
    cy.contains("Kunde: Test2 Test2");
  });

  //3
  it("should create new hypothek with LIBOR 12M", () => {
    cy.get("#new").click();
    cy.get('input[name="name"]').type("Test3");
    cy.get('input[name="vorname"]').type("Test3");
    cy.get('input[name="email"]').type("a@b.ch");
    cy.get('input[name="phone"]').type("2343434");
    cy.get('input[name="wert"]').type("959");
    cy.get('select[name="risk"').select("Tief");
    cy.get('select[name="paket"').select("LIBOR 12M | 0.71 %");
    cy.get('button[type="submit"]').click();
    cy.get(".hypothek").should(
      "have.length",
      5,
    );
    cy.contains("Zu bezahlen: 959");
    cy.contains("Bis: 6.5.2023");
    cy.contains("Risiko: tief");
    cy.contains("Kunde: Test3 Test3").click();
    cy.get("select[name='paket']").contains("LIBOR 12M | 0.71 %");
  });

  //4
  it("should return to / when clicking abbrechen", () => {
    cy.get("#new").click();
    cy.contains("Abbrechen").click();
    cy.url().should('not.include', '/new');
    cy.url().should('not.include', '/edit');
    cy.url().should('include', '/');
    cy.get(".hypothek").should(
      "have.length",
      5,
    );
  });

});