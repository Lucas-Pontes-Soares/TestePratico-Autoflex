describe('create-material', () => {
    beforeEach(() => {
        cy.visit('/login');
        cy.get('input[type="email"]').type('teste.cypress@gmail.com');
        cy.get('input[type="password"]').type('senha123');
        cy.get('button[type="submit"]').click();

        cy.url().should('include', '/products');
    });
    
    it('Should allow you to register a new raw material and view it in the list', () => {
        cy.visit('/raw-materials');

        cy.contains('button', /CRIAR/i).click();

        cy.get('input[placeholder*="Ex: Madeira, Aço, Vidro..."]').type('Madeira de Carvalho');
        cy.get('input[type="number"]').clear().type('150');

        cy.contains('button', /Criar Matéria-Prima/i).click();

        cy.contains('Madeira de Carvalho').should('be.visible');
        cy.contains('150').should('be.visible');
    });
});