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

  it('renders the empty state when no events are returned', () => {});

  it('renders an error when the request for events documentation data fails', () => {});

  it('renders an error when the request for events data fails', () => {});

  it('re-requests events data when changing the filter date', () => {});

  it('re-requests events data when the user filters by a recipient email address', () => {});

  it('re-requests data when removing an active filter and when clicking "Clear All Filters"', () => {});

  it('renders the "Share this report" modal when clicking on the "Share" button', () => {});

  describe('the "Advanced Filters" modal', () => {
    beforeEach(() => {
      cy.findByText('Add Filters').click();
    });

    it('renders documentation about each event type when hovering over a check box label', () => {});

    it('allows the addition and removal of other filters via the "Add Filter" and "Remove" buttons', () => {});

    it('closes the modal when clicking "Cancel"', () => {});

    it('applies filters when clicking "Apply Filters" by re-requesting events data', () => {});
  });
});
