/// <reference types="Cypress" />

describe('The recipient validation page', () => {
  beforeEach(() => {
    cy.stubAuth();
    cy.login({ isStubbed: true });
    cy.visit('/recipient-validation');
  });

  it('renders pricing information when clicking on the "See Pricing" button', () => {
    cy.findByText('See Pricing').click();

    cy.findByText('How was this calculated?').should('be.visible');
  });

  it('has a relevant page title', () => {
    cy.visit('/recipient-validation/list');
    cy.title().should('include', 'Recipient Validation');
  });

  describe('the tabbed view that allows the user to choose different means of running validations', () => {
    it('renders the API Integration section when the user clicks on "API Integration"', () => {
      cy.findByText('API Integration').click();
      cy.findByText('Integrate Now').should('be.visible');
      cy.findByText('/api/v1/recipient-validation/single/{address}').should('be.visible');
      cy.findByText('Create API Key').should('have.attr', 'href', '/account/api-keys/create');
      cy.findByText('API Docs').should(
        'have.attr',
        'href',
        'https://developers.sparkpost.com/api/recipient-validation/',
      );
    });

    it('renders the single address validation form when the user clicks on "Single Address"', () => {
      cy.findByText('Single Address').click();
      cy.url().should('include', 'single');
    });

    it('renders the list validation form when the user clicks on "List"', () => {
      cy.findByText('Single Address').click(); // Have to click to another tab then back to the current active tab to successfully activate it
      cy.findByText('List').click();

      cy.url().should('include', 'list');
    });
  });
});
