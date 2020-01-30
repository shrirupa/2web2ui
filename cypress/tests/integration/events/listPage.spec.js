const PAGE_URL = '/reports/message-events';

describe('The events page', () => {
  beforeEach(() => {
    cy.stubAuth();
    cy.login({ isStubbed: true });
  });

  it('has a relevant page title', () => {
    cy.visit(PAGE_URL);

    cy.title().should('include', 'Events Search');
    cy.findByText('Events Search').should('be.visible');
  });
});
