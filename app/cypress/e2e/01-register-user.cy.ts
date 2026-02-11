/// <reference types="cypress" />

describe('register-user', () => {
  it('Should allow you to register a user', () => {
    cy.visit('/register');

    cy.get('input[type="text"]').type('Teste Cypress');
    cy.get('input[type="email"]').type('teste.cypress@gmail.com');
    cy.get('input[id="password"]').type('senha123');
    cy.get('input[id="confirm-password"]').type('senha123');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/products');
  })
})