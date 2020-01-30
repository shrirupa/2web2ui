describe('Signals', () => {
  it('displays a list of Signals features when clicked in the navigation', () => {
    cy.login();
    cy.findByText('Signals Analytics').click();
    cy.contains('Health Score').should('be.visible');
    cy.contains('Spam Traps').should('be.visible');
    cy.contains('Engagement Recency').should('be.visible');
  });

  describe('Health Score', () => {
    it('renders a health score dashboard after navigating to the health score view', () => {
      cy.findByText('Health Score').click();
      cy.title()
        .should('include', 'Signals Analytics')
        .should('include', 'Health Score');

      cy.contains('Health Score').should('be.visible');
      cy.url().should('include', 'signals/health-score');
    });

    describe('Spam Traps', () => {
      it('renders the "Spam Trap Monitoring" view', () => {
        cy.findByText('Spam Traps').click();
        cy.title()
          .should('include', 'Signals Analytics')
          .should('include', 'Spam Trap Monitoring');

        cy.contains('Spam Trap Monitoring').should('be.visible');
        cy.url().should('include', 'signals/spam-traps');
      });
    });

    describe('Engagement Recency', () => {
      it('renders the "Engagement Recency" view', () => {
        cy.findByText('Engagement Recency').click();
        cy.title()
          .should('include', 'Signals Analytics')
          .should('include', 'Engagement Recency');

        cy.contains('Engagement Recency').should('be.visible');
        cy.url().should('include', 'signals/engagement');
      });
    });
  });
});
