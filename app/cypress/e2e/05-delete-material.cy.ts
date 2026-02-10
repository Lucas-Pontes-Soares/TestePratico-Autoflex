describe('delete-material', () => {
    beforeEach(() => {
        cy.visit('/login');
        cy.get('input[type="email"]').type('teste.cypress@gmail.com');
        cy.get('input[type="password"]').type('senha123');
        cy.get('button[type="submit"]').click();

        cy.url().should('include', '/products');
    });

    it('Should allow deleting material', () => {
        cy.visit('/raw-materials');

        cy.contains('td', 'Madeira de Carvalho')
        .parent('tr')
        .find('button')
        .last() 
        .click();

        cy.contains('button', /Excluir/i).click();

        cy.contains('Madeira de Carvalho').should('not.exist');
    });
});