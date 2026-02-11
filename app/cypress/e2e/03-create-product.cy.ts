describe('create-product', () => {
    beforeEach(() => {
        cy.visit('/login');
        cy.get('input[type="email"]').type('teste.cypress@gmail.com');
        cy.get('input[type="password"]').type('senha123');
        cy.get('button[type="submit"]').click();

        cy.url().should('include', '/products');
    });

    it('Should allow you to register a new product and view it in the list', () => {
        cy.visit('/products');
        cy.contains('button', /CRIAR/i).click();

        cy.get('input[placeholder*="Ex: Camisa, Calça, Boné..."]').type('Armário de Carvalho');
        cy.get('input[placeholder*="(Ex: 1250 para R$12,50)"]').type('50000');


        cy.get('button[role="combobox"]').click();

        cy.get('[role="option"]', { timeout: 5000 })
        .contains('Madeira de Carvalho')
        .should('be.visible')
        .click({ force: true });

        cy.get('button[role="combobox"]').should('contain', 'Madeira de Carvalho');
        cy.get('input[type="number"]').last().clear().type('10');

        cy.contains('button', /Criar Produto/i).click();

        cy.contains('Armário de Carvalho').should('be.visible');
        cy.contains('500').should('be.visible');
    });
});