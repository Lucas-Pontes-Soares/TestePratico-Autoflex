describe('delete-product', () => {
    beforeEach(() => {
        cy.visit('/login');
        cy.get('input[type="email"]').type('teste.cypress@gmail.com');
        cy.get('input[type="password"]').type('senha123');
        cy.get('button[type="submit"]').click();

        cy.url().should('include', '/products');
    });

    it('Should allow deleting product', () => {
        cy.visit('/products');

        cy.contains('td', 'Armário de Carvalho')
        .parent('tr')
        .find('button')
        .last() 
        .click();

        cy.contains('button', /Excluir/i).click();

        cy.contains('Armário de Carvalho').should('not.exist');
    });
});