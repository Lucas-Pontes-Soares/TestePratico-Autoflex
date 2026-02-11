describe('delete-user', () => {
    beforeEach(() => {
        cy.visit('/login');
        cy.get('input[type="email"]').type('teste.cypress@gmail.com');
        cy.get('input[type="password"]').type('senha123');
        cy.get('button[type="submit"]').click();

        cy.url().should('include', '/products');
    });

    it('Should allow deleting user', () => {
        cy.visit('/profile');

        cy.contains('button', /Excluir Conta/i).click();

        cy.get('[role="alertdialog"]')
        .contains('button', /Excluir/i)
        .click({ force: true });

        cy.url().should('include', '/login');
    });
});