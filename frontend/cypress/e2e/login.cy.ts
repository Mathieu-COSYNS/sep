/// <reference types="cypress" />

describe('login attempt', () => {
  beforeEach(() => {
    cy.visit('/connexion/');
    cy.wait(10);
    cy.size('default');
  });

  it('successful login', () => {
    cy.intercept('POST', '**/login/', { fixture: 'login-success.json' });

    cy.contains('*', 'Bonjour, test').should('not.exist');

    cy.contains('label', 'Nom*').click();
    cy.focused().type('test');
    cy.contains('label', 'Mot de passe*').click();
    cy.focused().type('$test$1234');
    cy.focused().blur();
    cy.contains('ion-button', 'Se connecter').click();

    cy.url().should('eq', Cypress.config().baseUrl + '/stock/');

    cy.contains('*', 'Bonjour, test').should('be.visible');
    cy.size('iphone-se2');
    cy.contains('*', 'Bonjour, test').should('be.not.visible');
    cy.get('[role="banner"]').get('ion-menu-button').click();
    cy.contains('*', 'Bonjour, test').should('be.visible');
  });

  it('wrong credentials', () => {
    cy.intercept('POST', '**/login/', { statusCode: 400, fixture: 'login-error-credentials.json' });

    cy.contains('*', 'Bonjour, test').should('not.exist');

    cy.contains('label', 'Nom*').click();
    cy.focused().type('wrong');
    cy.contains('label', 'Mot de passe*').click();
    cy.focused().type('$test$1234');
    cy.focused().blur();
    cy.contains('ion-button', 'Se connecter').click();

    cy.url().should('eq', Cypress.config().baseUrl + '/connexion/');

    cy.get('[role="alert"]').should('be.visible');
    cy.get('[role="alert"]').invoke('attr', 'color').should('eq', 'danger');

    cy.contains('*', 'Bonjour, test').should('not.exist');

    cy.visit('/stock/').get('h1').should('contain.text', '403');
  });
});
