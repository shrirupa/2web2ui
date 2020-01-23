/// <reference types="Cypress" />

const PAGE_URL = '/recipient-validation/list/fake-list';

describe('The recipient validation list confirmation page', () => {
  beforeEach(() => {
    cy.stubAuth();
    cy.login({ isStubbed: true });
    cy.stubRequest({
      url: '/api/v1/usage',
      fixture: 'usage/200.get.json',
    });
  });

  it('renders the address count from the uploaded CSV file', () => {
    cy.stubRequest({
      url: '/api/v1/recipient-validation/job/fake-list',
      fixture: 'recipient-validation/job/fake-list/200.get.queued_for_batch.json',
    });

    cy.visit(PAGE_URL);

    cy.get('[data-id="recipient-list-address-count"]').should('contain', '2');
  });

  it('renders an error when the list job returns batch status of "error"', () => {
    cy.stubRequest({
      url: '/api/v1/recipient-validation/job/fake-list',
      fixture: 'recipient-validation/job/fake-list/200.get.error.json',
    });

    cy.visit(PAGE_URL);

    cy.findByText('Oh no! There seems to be an issue with your list...').should('be.visible');
    cy.findByText('Got It').should('have.attr', 'href', '/recipient-validation');
  });

  it('redirects to the list progress page when clicking "Validate"', () => {
    cy.stubRequest({
      url: '/api/v1/recipient-validation/job/fake-list',
      fixture: 'recipient-validation/job/fake-list/200.get.queued_for_batch.json',
    });

    cy.stubRequest({
      method: 'POST',
      url: '/api/v1/recipient-validation/trigger/fake-list',
      fixture: 'recipient-validation/trigger/fake-list/200.post.json',
    });

    cy.visit(PAGE_URL);

    cy.findByText('Validate').click();

    cy.findByText('Processing').should('be.visible');
    cy.findByText('Validate Another').should('have.attr', 'href', '/recipient-validation');
  });

  it('renders with a link back to the recipient list page', () => {
    cy.stubRequest({
      url: '/api/v1/recipient-validation/job/fake-list',
      fixture: 'recipient-validation/job/fake-list/200.get.queued_for_batch.json',
    });

    cy.visit(PAGE_URL);

    cy.findByText('No, thanks').should('have.attr', 'href', '/recipient-validation');
  });

  it('renders with the file name of the uploaded file', () => {
    cy.stubRequest({
      url: '/api/v1/recipient-validation/job/fake-list',
      fixture: 'recipient-validation/job/fake-list/200.get.queued_for_batch.json',
    });

    cy.visit(PAGE_URL);

    cy.findByText('fake-list.csv').should('be.visible');
  });

  it('has a "How was this calculated?" link that opens a modal', () => {
    cy.stubRequest({
      url: '/api/v1/recipient-validation/job/fake-list',
      fixture: 'recipient-validation/job/fake-list/200.get.queued_for_batch.json',
    });

    cy.visit(PAGE_URL);

    cy.findByText('How was this calculated?').click();

    cy.findAllByText('How was this calculated?').should('have.length', 2);
    cy.findByText('Number of Emails').should('be.visible');
    cy.findByText('Cost').should('be.visible');
  });
});
