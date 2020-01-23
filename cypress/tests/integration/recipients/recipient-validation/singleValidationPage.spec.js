/// <reference types="Cypress" />

const SINGLE_RESULT_URL = '/api/v1/recipient-validation/single/**';

describe('The recipient validation single result page', () => {
  beforeEach(() => {
    cy.stubAuth();
    cy.login({ isStubbed: true });
  });

  it('renders with a relevant page title', () => {
    cy.stubRequest({
      url: SINGLE_RESULT_URL,
      fixture: 'recipient-validation/single/fake-email/200.get.valid-result.json',
    });

    cy.visit('/recipient-validation/single/fake-email@sparkpost.com');

    cy.title().should('include', 'Results');
  });

  it('renders with the "Valid" status when the result returns as valid', () => {
    cy.stubRequest({
      url: SINGLE_RESULT_URL,
      fixture: 'recipient-validation/single/fake-email/200.get.valid-result.json',
    });

    cy.visit('/recipient-validation/single/fake-email@sparkpost.com');

    cy.get('[data-id="validation-result-status"]').within(() => {
      cy.findByText('valid').should('be.visible'); // Though rendered as "Valid", the text is transformed to be capitalized using CSS
    });

    cy.findByText(
      'Our data indicates we have seen deliveries and/or active engagement associated with this email address. We have no data suggesting that this is an invalid email address for any reason.',
    ).should('be.visible');
  });

  it('renders with the "Neutral" status when the result returns as neutral', () => {
    cy.stubRequest({
      url: SINGLE_RESULT_URL,
      fixture: 'recipient-validation/single/fake-email/200.get.neutral-result.json',
    });

    cy.visit('/recipient-validation/single/fake-email@sparkpost.com');

    cy.get('[data-id="validation-result-status"]').within(() => {
      cy.findByText('neutral').should('be.visible'); // Though rendered as "Neutral", the text is transformed to be capitalized using CSS
    });

    cy.findByText(
      'Our data indicates we have not seen any bounces associated with this email address that would suggest it to be invalid or undeliverable to. However, we have not seen any specific delivery and/or engagement events associated as well.',
    ).should('be.visible');
  });

  it('renders with the "Typo" status when the result returns as typo', () => {
    cy.stubRequest({
      url: SINGLE_RESULT_URL,
      fixture: 'recipient-validation/single/fake-email/200.get.typo-result.json',
    });

    cy.visit('/recipient-validation/single/fake-email@sparkpost.com');

    cy.get('[data-id="validation-result-status"]').within(() => {
      cy.findByText('typo').should('be.visible'); // Though rendered as "Typo", the text is transformed to be capitalized using CSS
    });

    cy.findByText(
      'Our data indicates there is likely a typo in the domain for this email address. Check “did you mean” for our best recommendation to fix the misspelled domain.',
    ).should('be.visible');
  });

  it('renders with the "Risky" status when the result returns as risky', () => {
    cy.stubRequest({
      url: SINGLE_RESULT_URL,
      fixture: 'recipient-validation/single/fake-email/200.get.risky-result.json',
    });

    cy.visit('/recipient-validation/single/fake-email@sparkpost.com');

    cy.get('[data-id="validation-result-status"]').within(() => {
      cy.findByText('risky').should('be.visible'); // Though rendered as "Risky", the text is transformed to be capitalized using CSS
    });

    cy.findByText(
      'A risky result means that our data analysis indicated that the email address has bounced at least once in the past, but has not seen a subsequent bounce in quite some time. Data suggests this email address can in fact be delivered to, however there is some potential risk of the email address bouncing.',
    ).should('be.visible');
  });

  it('renders with the "Undeliverable" status when the result returns as undeliverable', () => {
    cy.stubRequest({
      url: SINGLE_RESULT_URL,
      fixture: 'recipient-validation/single/fake-email/200.get.undeliverable-result.json',
    });

    cy.visit('/recipient-validation/single/fake-email@sparkpost.com');

    cy.get('[data-id="validation-result-status"]').within(() => {
      cy.findByText('undeliverable').should('be.visible'); // Though rendered as "Undeliverable", the text is transformed to be capitalized using CSS
    });

    cy.findByText('Our data strongly indicates this email address cannot be delivered to.').should(
      'be.visible',
    );
  });

  it('renders generic error messages directly from the server if the status code is not "420"', () => {
    cy.server();
    cy.fixture('recipient-validation/single/400.get.json').as('RVFixture');
    cy.route({
      method: 'GET',
      status: 400,
      url: '/api/v1/recipient-validation/single/fake-email@gmail.com',
      response: '@RVFixture',
    }).as('getValidation');

    cy.visit('/recipient-validation/single/fake-email@gmail.com');

    cy.wait('@getValidation');

    cy.findByText('This is an error').should('be.visible');
  });

  it('renders an error on the single validation page when the server returns a 400 error with the message "Validation limit exceeded"', () => {
    cy.server();
    cy.fixture('recipient-validation/single/420.get.usage-limit-exceeded.json').as('RVFixture');
    cy.route({
      method: 'GET',
      status: 420,
      url: '/api/v1/recipient-validation/single/fake-email@gmail.com',
      response: '@RVFixture',
    }).as('getValidation');

    cy.visit('/recipient-validation/single/fake-email@gmail.com');

    cy.wait('@getValidation');

    cy.findByText('Validation limit exceeded').should('be.visible');

    cy.findAllByText('View Details')
      .last()
      .click();

    cy.findByText('Submit a ticket')
      .should('have.attr', 'href', '?supportTicket=true&supportIssue=general_issue')
      .click();

    cy.findByText('I need help with...').should('be.visible');
  });
});
