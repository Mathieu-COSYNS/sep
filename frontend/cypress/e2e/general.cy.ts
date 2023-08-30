import config from '../../app.config.json';

describe('general tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('has app name as page title', () => {
    cy.title().should('eq', config.appName);
  });

  it('should redirect to login url', () => {
    cy.url().should('eq', Cypress.config().baseUrl + '/connexion/');
  });
});
