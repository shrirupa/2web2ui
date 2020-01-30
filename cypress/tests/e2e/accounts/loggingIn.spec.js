describe('The auth view', () => {
  before(() => cy.visit('/'));

  it('renders the content "Log In"', () => {
    cy.contains('Log In').should('be.visible');
  });

  it('logs in', () => {
    cy.login();
    cy.contains('An unknown error occurred').should('not.be.visible');
    cy.url().should('include', '/dashboard');
  });
});
