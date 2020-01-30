const PAGE_URL = '/reports/message-events';

describe('The events page', () => {
  beforeEach(() => {
    cy.stubAuth();
    cy.login({ isStubbed: true });

    cy.stubRequest({
      url: '/api/v1/events/message*',
      fixture: 'events/message/200.get.json',
    });

    cy.stubRequest({
      url: '/api/v1/events/message/documentation',
      fixture: 'events/message/documentation/200.get.json',
    });
  });

  it('has a relevant page title', () => {
    cy.visit(PAGE_URL);

    cy.title().should('include', 'Events Search');
    cy.findByText('Events Search').should('be.visible');
  });

  it('renders an error when the request for events documentation data fails', () => {
    cy.stubRequest({
      statusCode: 400,
      url: '/api/v1/events/message/documentation',
      fixture: 'events/message/documentation/400.get.json',
    });

    cy.visit(PAGE_URL);

    cy.findByText('An error occurred').should('be.visible');
    cy.findByText('Show Error Details').click();
    cy.findByText('This is an error').should('be.visible');
    cy.findByText('Hide Error Details').click();
    cy.queryByText('This is an error').should('not.be.visible');

    cy.stubRequest({
      url: '/api/v1/events/message/documentation',
      fixture: 'events/message/documentation/200.get.json',
    });

    cy.findByText('Try Again').click();
    cy.queryByText('An error occurred').should('not.be.visible');
  });

  it('renders an error when the request for events data fails', () => {
    cy.stubRequest({
      statusCode: 400,
      url: '/api/v1/events/message*',
      fixture: 'events/message/400.get.json',
    });

    cy.visit(PAGE_URL);

    cy.findByText('An error occurred').should('be.visible');
    cy.findByText('Show Error Details').click();
    cy.findByText('This is an error').should('be.visible');
    cy.findByText('Hide Error Details').click();
    cy.queryByText('This is an error').should('not.be.visible');

    cy.stubRequest({
      url: '/api/v1/events/message*',
      fixture: 'events/message/200.get.json',
    });

    cy.findByText('Try Again').click();
    cy.queryByText('An error occurred').should('not.be.visible');
  });

  it('re-requests events data when changing the filter date', () => {
    cy.visit(PAGE_URL);
  });

  it('re-requests events data when the user filters by a recipient email address', () => {});

  it('re-requests data when removing an active filter and when clicking "Clear All Filters"', () => {});

  it('renders the "Share this report" modal when clicking on the "Share" button', () => {});

  describe('the events table', () => {
    it('renders with a "View Details" button that links to the detail page for this event', () => {});

    it('renders the "Event", "Subject", "Recipient", "From Address", and event "Time" for each event', () => {});

    it('renders the empty state when no events are returned', () => {});
  });

  describe('the "Advanced Filters" modal', () => {
    beforeEach(() => {
      cy.visit(PAGE_URL);
      cy.findByText('Add Filters').click();
    });

    it('renders documentation about each event type when hovering over a check box label', () => {});

    it('allows the addition and removal of other filters via the "Add Filter" and "Remove" buttons', () => {});

    it('closes the modal when clicking "Cancel"', () => {});

    it('applies filters when clicking "Apply Filters" by re-requesting events data', () => {});
  });
});
