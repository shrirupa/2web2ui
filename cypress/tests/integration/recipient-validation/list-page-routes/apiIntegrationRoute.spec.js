describe('The recipient validation /api route', () => {
  beforeEach(() => {
    cy.stubAuth();
    cy.login({ isStubbed: true });
  });

  it('renders with appropriate API integration content', () => {
    cy.visit('/recipient-validation/api');

    cy.findByText('Integrate Now').should('be.visible');
    cy.findByText('/api/v1/recipient-validation/single/{address}').should('be.visible');
    cy.findByText('Create API Key').should('have.attr', 'href', '/account/api-keys/create');
    cy.findByText('API Docs').should(
      'have.attr',
      'href',
      'https://developers.sparkpost.com/api/recipient-validation/',
    );
  });
});
