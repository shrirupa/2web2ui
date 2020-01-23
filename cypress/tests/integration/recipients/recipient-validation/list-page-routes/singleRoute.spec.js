/// <reference types="Cypress" />

describe('The recipient validation /single route', () => {
  beforeEach(() => {
    cy.stubAuth();
    cy.login({ isStubbed: true });
  });

  it('has a relevant page title', () => {
    cy.visit('/recipient-validation/single');
    cy.title().should('include', 'Recipient Validation');
  });

  it('has a relevant heading', () => {
    cy.visit('/recipient-validation/single');

    cy.findByText('Validate a Single Address').should('be.visible');
  });

  it('renders a "required" field level error when skipping entering an email address', () => {
    cy.visit('/recipient-validation/single');

    cy.findByLabelText('Email Address')
      .focus()
      .blur();

    cy.findByText('Required').should('be.visible');
  });

  it('renders an "Invalid Email" error when the user enters an invalid email address', () => {
    cy.visit('/recipient-validation/single');

    cy.findByLabelText('Email Address')
      .type('hello')
      .blur();

    cy.findByText('Invalid Email').should('be.visible');
  });

  it('re-directs the user to the single address validation results page when the user enters a single email address for validation', () => {
    const fakeEmail = 'fake-email@sparkpost.com';

    cy.stubRequest({
      method: 'GET',
      url: `/api/v1/recipient-validation/single/${fakeEmail}`,
      fixture: 'recipient-validation/single/fake-email/200.get.valid-result.json',
    });

    cy.visit('/recipient-validation/single');

    cy.findByLabelText('Email Address').type(fakeEmail);
    cy.findByText('Validate').click();
    cy.title().should('include', 'Results | Recipient Validation');
  });
});
