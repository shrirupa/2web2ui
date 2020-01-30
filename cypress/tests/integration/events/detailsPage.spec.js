const PAGE_BASE_URL = '/reports/message-events/details';

describe('The events details page', () => {
  beforeEach(() => {
    cy.stubAuth({ isStubbed: true });
    cy.login();
  });

  it('renders with a relevant page title', () => {});

  it('renders the event details for the requested event', () => {});

  it('has a "Refresh" button that re-requests events data', () => {});

  it('renders message history over time', () => {});
});
