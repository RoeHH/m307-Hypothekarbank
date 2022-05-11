/// <reference types="cypress" />

describe("creating new Hypothek", () => {

  before(() => {
    cy.exec('npx prisma db seed')
  })

  beforeEach(() => {
    cy.visit("localhost:3000");
  });

  //5
  it("should return to / when clicking abbrechen", () => {
    cy.get(".hypothek").first().click();
    cy.contains("Abbrechen").click();
    cy.url().should('not.include', '/new');
    cy.url().should('not.include', '/edit');
    cy.url().should('include', '/');
    cy.get(".hypothek").should(
      "have.length",
      2,
    );
  });
  
  //6
  it("should set the status to Bezahlt to 'delete' on the remaining hypothek", () => {
    cy.get(".hypothek").first().click();
    cy.get('select[name="status"').select("Bezahlt");
    cy.get('button[type="submit"]').click();
    cy.get(".hypothek").should(
      "have.length",
      1,
    );
  });

  //7
  it("should set the risk to 'Sehr Hoch' on the remaining hypothek", () => {
    cy.get(".hypothek").first().click();
    cy.get('select[name="risk"').select("Sehr Hoch");
    cy.get('button[type="submit"]').click();
    cy.get(".hypothek").should(
      "have.length",
      1,
    );
    cy.get(".hypothek").first().should("contain", "Risiko: sehrHoch");
    cy.get(".hypothek").first().should("contain", "Bis: 6.1.2023");
  });

  //8
  it("should set the name to CT-5555 on the remaining hypothek", () => {
    cy.get(".hypothek").first().click();
    cy.get('input[name="name"]').clear().type("CT-5555");
    cy.get('input[name="vorname"]').clear().type("Fives");
    cy.get('button[type="submit"]').click();
    cy.get(".hypothek").first().contains("Kunde: CT-5555 Fives");
    cy.get(".hypothek").should(
      "have.length",
      1,
    );
  });

});
