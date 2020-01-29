const PAGE_URL = '/lists/suppressions';
const SUPPRESSION_LIST_API_URL = '/api/v1/suppression-list*';

describe('The recipients suppressions list page', () => {
  beforeEach(() => {
    cy.stubAuth();
    cy.login({ isStubbed: true });

    cy.stubRequest({
      url: '/api/v1/subaccounts',
      fixture: 'subaccounts/200.get.json',
    });

    cy.stubRequest({
      url: SUPPRESSION_LIST_API_URL,
      fixture: 'suppression-list/200.get.json',
      requestAlias: 'stubbedSuppressionListRequest',
    });
  });

  it('has a relevant page title', () => {
    cy.visit(PAGE_URL);

    cy.title().should('include', 'Suppressions');
  });

  it('renders a link to the "Add Suppressions" page', () => {
    cy.visit(PAGE_URL);

    cy.wait('@stubbedSuppressionListRequest');

    cy.assertLink({
      content: 'Add Suppressions',
      href: '/lists/suppressions/create',
    });
  });

  describe('filtering triggers a network request, updating suppression list results from the API', () => {
    beforeEach(() => {
      cy.visit(PAGE_URL);

      cy.wait('@stubbedSuppressionListRequest');

      cy.stubRequest({
        url: SUPPRESSION_LIST_API_URL,
        fixture: 'suppression-list/200.get.filtered-results.json',
        requestAlias: 'stubbedFilteredRequest',
      });

      cy.queryByText('filtered-fake-email@gmail.com').should('not.be.visible');
    });

    it('re-requests data when filtering by a broad date range', () => {
      cy.findByLabelText('Broad Date Range').select('Last Hour');

      cy.findAllByText('filtered-fake-email@gmail.com').should('have.length', 2);
    });

    it('re-requests data when filtering by a narrow date range', () => {
      cy.findByLabelText('Narrow Date Range').click();
      cy.findByText('Apply').click();

      cy.findAllByText('filtered-fake-email@gmail.com').should('have.length', 2);
    });

    it('re-requests data when filtering by list type', () => {
      cy.findByLabelText('Type').click();
      cy.findByText('Transactional').click();
      cy.get('main').click({ position: 'bottomRight' }); // Clicking outside of the filter dropdown to trigger the change

      cy.findAllByText('filtered-fake-email@gmail.com').should('have.length', 2);
    });

    it('re-requests data when filtering by sources', () => {
      cy.findByLabelText('Sources').click();
      cy.findByText('Spam Complaint').click();
      cy.get('main').click({ position: 'bottomRight' }); // Clicking outside of the filter dropdown to trigger the change
    });
  });

  it('renders date range, "Type", and "Source" fields when the "Filters" tab is selected', () => {
    cy.visit(PAGE_URL);

    cy.findByText('Find by Email').click();
    cy.findByText('Filters').click();

    cy.findByLabelText('Broad Date Range').should('be.visible');
    cy.findByLabelText('Narrow Date Range').should('be.visible');
    cy.findByLabelText('Type').should('be.visible');
    cy.findByLabelText('Sources').should('be.visible');
  });

  it('renders "Recipient Email" and "Subaccount" fields when the "Find by Email" tab is selected', () => {
    cy.visit(PAGE_URL);

    cy.findByText('Find by Email').click();

    cy.findByLabelText('Recipient Email').should('be.visible');
    cy.findByLabelText('Subaccount').should('be.visible');
  });

  it('renders an empty state when no suppressions have been added', () => {
    cy.stubRequest({
      url: SUPPRESSION_LIST_API_URL,
      fixture: 'suppression-list/200.get.no-results.json',
    });

    cy.visit(PAGE_URL);

    cy.findByText('There are no results for your current query').should('be.visible');
  });

  describe('the suppressions list table', () => {
    it('renders retrieved suppression lists in the table', () => {
      cy.visit(PAGE_URL);

      cy.findByText('fake-email@gmail.com').should('be.visible');
      cy.findByText('Non-transactional').should('be.visible');
      cy.findByText('Manually Added').should('be.visible');
      cy.findByText('Master Account').should('be.visible');
    });

    it('renders a delete modal when clicking the "Delete" button within a table row', () => {
      cy.stubRequest({
        method: 'DELETE',
        url: '/api/v1/suppression-list/fake-email@gmail.com',
        fixture: 'suppression-list/200.delete.json',
      });

      cy.visit(PAGE_URL);

      cy.findByText('Delete').click();

      cy.findByText(
        'Are you sure you want to delete fake-email@gmail.com from suppression list?',
      ).should('be.visible');

      cy.get('#modal-portal').within(() => {
        cy.findByText('Delete').click();
      });

      cy.findByText(
        'fake-email@gmail.com was successfully deleted from the suppression list',
      ).should('be.visible');
    });

    it('renders a details modal when clicking the "View Details" button within a table row', () => {
      cy.visit(PAGE_URL);

      cy.findByText('View Details').click();

      cy.get('#modal-portal').within(() => {
        cy.findByText('Suppression Details').should('be.visible');

        cy.findByText('fake-email@gmail.com').should('be.visible');
        cy.findByText('Non-transactional').should('be.visible');
        cy.findByText('Manually Added').should('be.visible');
        cy.findByText('this is a test description').should('be.visible');
        cy.findByText('Close').click();
      });

      cy.findByText('Supression Details').should('not.be.visible');
    });

    it('sorts alphabetically by "Recipient", "Type", "Source", and "Subaccount"', () => {
      cy.stubRequest({
        url: SUPPRESSION_LIST_API_URL,
        fixture: 'suppression-list/200.get.alphabetical-results.json',
      });

      cy.visit(PAGE_URL);

      // Sorting by the "Recipient" column
      // Sort descending
      cy.findByText('Recipient').click();

      cy.get('tbody tr')
        .eq(0)
        .should('contain', 'recipient-c');

      cy.get('tbody tr')
        .eq(1)
        .should('contain', 'recipient-b');

      cy.get('tbody tr')
        .eq(2)
        .should('contain', 'recipient-a');

      // Sort ascending
      cy.findByText('Recipient').click();

      cy.get('tbody tr')
        .eq(0)
        .should('contain', 'recipient-a');

      cy.get('tbody tr')
        .eq(1)
        .should('contain', 'recipient-b');

      cy.get('tbody tr')
        .eq(2)
        .should('contain', 'recipient-c');

      // Sorting by the "Type" column
      // Sort ascending
      cy.get('table').within(() => {
        cy.findByText('Type').click();
      });

      cy.get('tbody tr')
        .eq(0)
        .should('contain', 'Non-transactional');

      cy.get('tbody tr')
        .eq(1)
        .should('contain', 'Transactional');

      cy.get('tbody tr')
        .eq(2)
        .should('contain', 'Transactional');

      // Sort descending
      cy.get('table').within(() => {
        cy.findByText('Type').click();
      });

      cy.get('tbody tr')
        .eq(0)
        .should('contain', 'Transactional');

      cy.get('tbody tr')
        .eq(1)
        .should('contain', 'Transactional');

      cy.get('tbody tr')
        .eq(2)
        .should('contain', 'Non-transactional');

      // Sorting by the "Type" column
      // Sort ascending
      cy.findByText('Source').click();

      cy.get('tbody tr')
        .eq(0)
        .should('contain', 'source-a');

      cy.get('tbody tr')
        .eq(1)
        .should('contain', 'source-b');

      cy.get('tbody tr')
        .eq(2)
        .should('contain', 'source-c');

      // Sort descending
      cy.findByText('Source').click();

      cy.get('tbody tr')
        .eq(0)
        .should('contain', 'source-c');

      cy.get('tbody tr')
        .eq(1)
        .should('contain', 'source-b');

      cy.get('tbody tr')
        .eq(2)
        .should('contain', 'source-a');

      // Sorting by the "Type" column
      // Sort ascending
      cy.findByText('Subaccount').click();

      cy.get('tbody tr')
        .eq(0)
        .should('contain', 'Subaccount 1');

      cy.get('tbody tr')
        .eq(1)
        .should('contain', 'Subaccount 2');

      cy.get('tbody tr')
        .eq(2)
        .should('contain', 'Subaccount 3');

      // Sort descending
      cy.findByText('Subaccount').click();

      cy.get('tbody tr')
        .eq(0)
        .should('contain', 'Subaccount 3');

      cy.get('tbody tr')
        .eq(1)
        .should('contain', 'Subaccount 2');

      cy.get('tbody tr')
        .eq(2)
        .should('contain', 'Subaccount 1');
    });

    it('does not render the "Subaccount" column when the user has no subaccounts', () => {
      cy.stubRequest({
        url: `/api/v1/users/${Cypress.env('USERNAME')}`,
        fixture: 'users/200.get.no-subaccounts.json',
      });

      cy.visit(PAGE_URL);

      cy.queryByText('Subaccount').should('not.be.visible');
    });
  });

  it('renders the empty state when no results are returned', () => {
    cy.stubRequest({
      url: SUPPRESSION_LIST_API_URL,
      fixture: 'suppression-list/200.get.no-results.json',
    });

    cy.visit(PAGE_URL);

    cy.findByText('There are no results for your current query').should('be.visible');
  });

  it('renders an error when the server returns one', () => {
    cy.stubRequest({
      url: SUPPRESSION_LIST_API_URL,
      statusCode: 400,
      fixture: 'suppression-list/400.get.json',
    });

    cy.visit(PAGE_URL);

    cy.findByText('Something went wrong.').should('be.visible');
    cy.findByText('There are no results for your current query').should('be.visible');
  });
});
