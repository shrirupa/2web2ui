const PAGE_BASE_URL = '/reports/message-events/details';

describe('The events details page', () => {
  beforeEach(() => {
    cy.stubAuth({ isStubbed: true });
    cy.login();

    cy.stubRequest({
      url: '/api/v1/events/message*',
      fixture: 'events/message/200.get.json',
    });

    cy.stubRequest({
      url: '/api/v1/events/message/documentation',
      fixture: 'events/message/documentation/200.get.json',
    });
  });

  it('renders with a relevant page title', () => {
    cy.visit(`${PAGE_BASE_URL}/mock-message-id-1/1234`);

    cy.title().should('include', 'Message History | Events');
    cy.findByText('Message: mock-message-id-1').should('be.visible');
  });

  it('redirects to the list page in the event of a request error', () => {
    cy.stubRequest({
      statusCode: 400,
      url: '/api/v1/events/message*',
      fixture: 'events/message/400.get.json',
    });

    cy.visit(`${PAGE_BASE_URL}/abc/def`);

    cy.findByText('Unable to find event(s) data with message_id # abc').should('be.visible');
    cy.findByText('Something went wrong.').should('be.visible');
    cy.url().should('not.include', 'details');
    cy.findByText('Events Search').should('be.visible');
  });

  it('redirects to the list page when no results are found for the message ID', () => {
    cy.stubRequest({
      url: '/api/v1/events/message*',
      fixture: 'events/message/200.get.no-results.json',
    });

    cy.visit(`${PAGE_BASE_URL}/mock-message-id-1/1234`);

    cy.findByText('Unable to find event(s) data with message_id # mock-message-id-1').should(
      'be.visible',
    );
    cy.url().should('not.include', 'details');
    cy.findByText('Events Search').should('be.visible');
  });

  it('renders the event details for the requested event', () => {
    cy.visit(`${PAGE_BASE_URL}/mock-message-id-1/1234`);

    // Not checking for every single rendered value here - the unit tests are better suited for that level of granularity
    cy.findAllByText('fake-recipient@hotmail.com').should('have.length', 2);
    cy.findByText('fake-sender@yahoo.com').should('be.visible');
    cy.findByText('Mock Subject 1').should('be.visible');
  });

  it('renders a tooltip when hovering over an event detail definition', () => {
    cy.visit(`${PAGE_BASE_URL}/mock-message-id-1/1234`);

    cy.findByText('template_version').trigger('mouseover');

    cy.findByText('Version of the template used to construct this message').should('be.visible');

    cy.findByText('campaign_id').trigger('mouseover');

    cy.findByText('Campaign of which this message was a part').should('be.visible');
  });

  it('has a "Refresh" button that re-requests events data', () => {
    cy.visit(`${PAGE_BASE_URL}/mock-message-id-1/1234`);

    cy.stubRequest({
      url: '/api/v1/events/message*',
      fixture: 'events/message/200.get.different-results.json',
    });

    cy.findByText('Refresh').click();

    cy.queryAllByText('fake-recipient@hotmail.com').should('have.length', 0);
    cy.queryByText('fake-sender@yahoo.com').should('not.be.visible');
    cy.queryByText('Mock Subject 1').should('not.be.visible');
  });
});
