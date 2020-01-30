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

  // TODO: Left off here
  it('renders the "Share this report" modal when clicking on the "Share" button', () => {
    cy.visit(PAGE_URL);

    cy.findByText('Share').click();

    cy.findByText('Share this report').should('be.visible');
  });

  describe('filtering', () => {
    // TODO: Work on this test once `TR-2133` is merged
    // it('re-requests events data when changing the filter date', () => {
    //   cy.visit(PAGE_URL);
    // });

    it('re-requests events data when the user filters by a recipient email address', () => {
      cy.visit(PAGE_URL);

      cy.stubRequest({
        url: '/api/v1/events/message*',
        fixture: 'events/message/200.get.different-results.json',
      });

      cy.findByLabelText('Filter by Recipient Email Address')
        .type('hello@gmail.com')
        .blur();

      cy.findByText('Recipients: hello@gmail.com').should('be.visible');
      cy.findByText('Clear All Filters').should('be.visible');
      cy.findByText('different-recipient@hotmail.com').should('be.visible');
      cy.queryByText('fake-recipient@hotmail.com').should('not.be.visible');
    });

    it('renders an invalid email address in the recipient email address filter when an invalid email is entered', () => {
      cy.visit(PAGE_URL);

      cy.findByLabelText('Filter by Recipient Email Address')
        .type('hello')
        .blur();

      cy.findByText('hello is not a valid email address').should('be.visible');

      cy.findByLabelText('Filter by Recipient Email Address')
        .clear()
        .type('@gmail.com')
        .blur();

      cy.findByText('@gmail.com is not a valid email address').should('be.visible');

      cy.findByLabelText('Filter by Recipient Email Address')
        .clear()
        .type('a@b')
        .blur();

      cy.findByText('a@b is not a valid email address').should('be.visible');

      cy.findByLabelText('Filter by Recipient Email Address')
        .clear()
        .type('a@b.c')
        .blur();

      cy.queryByText('a@b.c is not a valid email address').should('not.be.visible');
    });

    it('re-requests data when removing an active filter and when clicking "Clear All Filters"', () => {
      cy.visit(PAGE_URL);

      cy.stubRequest({
        url: '/api/v1/events/message*',
        fixture: 'events/message/200.get.different-results.json',
      });

      cy.findByLabelText('Filter by Recipient Email Address')
        .type('hello@gmail.com')
        .blur();

      cy.findByText('different-recipient@hotmail.com').should('be.visible');
      cy.queryByText('fake-recipient@hotmail.com').should('not.be.visible');

      cy.stubRequest({
        url: '/api/v1/events/message*',
        fixture: 'events/message/200.get.json',
      });

      cy.findByText('Clear All Filters').click();

      cy.queryByText('fake-recipient@hotmail.com').should('be.visible');
      cy.findByText('different-recipient@hotmail.com').should('not.be.visible');
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

  describe('the events table', () => {
    it('renders with a "View Details" button that links to the detail page for this event', () => {});

    it('renders the "Event", "Subject", "Recipient", "From Address", and event "Time" for each event', () => {});

    it('renders the empty state when no events are returned', () => {});
  });
});
