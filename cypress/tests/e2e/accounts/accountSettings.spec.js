describe('Account settings', () => {
  it('is accessible via the user popover in the header', () => {
    cy.login();
    cy.contains('appteam@messagesystems.com').click();
    cy.contains('Account Settings').click();
    cy.url().should('include', 'settings');
    cy.title().should('include', 'Account settings');
  });

  it('Shows a modal when the user clicks "Provision SSO"', () => {
    cy.contains('Provision SSO').click();
    cy.contains('Provision Single Sign-On').should('be.visible');
    cy.get('button')
      .contains('Cancel')
      .click();
  });
});
