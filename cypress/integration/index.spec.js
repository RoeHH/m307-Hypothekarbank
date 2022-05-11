/// <reference types="cypress" />

describe("creating new Hypothek", () => {

  before(() => {
    cy.exec('npx prisma db seed')
  })

  beforeEach(() => {
    cy.visit("localhost:3000");
  });

  //9
  it("should be the first element with a warning light emoji and the second with the money emoji", () => {
    cy.get(".hypothek").first().should("contain", "🚨");
    cy.get(".hypothek").eq(1).should("contain", "💸");
  });

  //10
  it("should be the first element with the corect text", () => {
    cy.get(".hypothek").first()
    .should("contain", "Kunde: nnamretsuM xaM")
    .and("contain", "Risiko: sehrTief")
    .and("contain", "Zu bezahlen: 1")
    .and("contain", "Bis: 11.5.2022");
});


});
