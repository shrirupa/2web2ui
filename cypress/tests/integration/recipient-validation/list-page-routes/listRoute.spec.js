const ROUTE_URL = '/recipient-validation/list';

describe('The recipient validation /list route', () => {
  beforeEach(() => {
    cy.stubAuth();
    cy.login({ isStubbed: true });
  });

  it('renders a relevant heading', () => {
    cy.visit(ROUTE_URL);

    cy.findByText('Drag and drop your list here').should('be.visible');
  });

  it('renders all relevant statuses based on the server response', () => {
    cy.stubRequest({
      url: '/api/v1/recipient-validation/list',
      fixture: 'recipient-validation/list/200.get.json',
    });

    cy.visit(ROUTE_URL);

    cy.get('tbody tr')
      .eq(0)
      .should('contain', 'success.csv')
      .should('contain', 'Complete');

    cy.get('tbody tr')
      .eq(1)
      .should('contain', 'reading-upload-file.csv')
      .should('contain', 'See Progress')
      .should('contain', 'Processing');

    cy.get('tbody tr')
      .eq(2)
      .should('contain', 'checking-regex.csv')
      .should('contain', 'See Progress')
      .should('contain', 'Processing');

    cy.get('tbody tr')
      .eq(3)
      .should('contain', 'performing-mx-lookup.csv')
      .should('contain', 'See Progress')
      .should('contain', 'Processing');

    cy.get('tbody tr')
      .eq(4)
      .should('contain', 'performing-decay-scoring.csv')
      .should('contain', 'See Progress')
      .should('contain', 'Processing');

    cy.get('tbody tr')
      .eq(5)
      .should('contain', 'performing-role-based-lookup.csv')
      .should('contain', 'See Progress')
      .should('contain', 'Processing');

    cy.get('tbody tr')
      .eq(6)
      .should('contain', 'performing-disposable-domain.csv')
      .should('contain', 'See Progress')
      .should('contain', 'Processing');

    cy.get('tbody tr')
      .eq(7)
      .should('contain', 'performing-free-email.csv')
      .should('contain', 'See Progress')
      .should('contain', 'Processing');

    cy.get('tbody tr')
      .eq(8)
      .should('contain', 'performing-did-you-mean.csv')
      .should('contain', 'See Progress')
      .should('contain', 'Processing');

    cy.get('tbody tr')
      .eq(9)
      .should('contain', 'uploading-results-to-s3.csv')
      .should('contain', 'See Progress')
      .should('contain', 'Processing');

    cy.get('tbody tr')
      .eq(10)
      .should('contain', 'error.csv')
      .should('contain', 'Validation Error');
  });

  it('accepts an uploaded CSV and re-directs the user to a view describing the volume and price of the validation', () => {
    cy.stubRequest({
      method: 'POST',
      url: '/api/v1/recipient-validation/upload',
      fixture: 'recipient-validation/upload/200.post.json',
    });

    cy.stubRequest({
      url: '/api/v1/recipient-validation/list',
      fixture: 'recipient-validation/list/200.get.json',
    });

    cy.stubRequest({
      method: 'GET',
      url: '/api/v1/recipient-validation/job/fake-list',
      fixture: 'recipient-validation/job/fake-list/200.get.queued_for_batch.json',
    });

    cy.stubRequest({
      method: 'GET',
      url: '/api/v1/usage',
      fixture: 'usage/200.get.json',
    });

    cy.visit(ROUTE_URL);

    const exampleCSV = 'recipient-validation/fake-list.csv';

    cy.fixture(exampleCSV).then(fileContent => {
      cy.get('[name="csv"]').upload({
        fileContent,
        fileName: 'fake-list.csv',
        mimeType: 'text/csv',
      });

      cy.findByText('fake-list.csv').should('be.visible');
      cy.get('[data-id="recipient-list-address-count"]').should('contain', '2');
      cy.findByText('$0.02').should('be.visible');
      cy.findByText('Validate').should('be.visible');
      cy.findByText('No, thanks').should('be.visible');
    });
  });

  it('renders an error when the server returns an upload error response', () => {
    cy.stubRequest({
      url: '/api/v1/recipient-validation/list',
      fixture: 'recipient-validation/list/200.get.json',
    });

    cy.stubRequest({
      method: 'POST',
      statusCode: 400,
      url: '/api/v1/recipient-validation/upload',
      fixture: 'recipient-validation/upload/400.post.json',
    });

    cy.visit(ROUTE_URL);

    const exampleCSV = 'recipient-validation/fake-list.csv';

    cy.fixture(exampleCSV).then(fileContent => {
      cy.get('[name="csv"]').upload({ fileContent, fileName: 'example.csv', mimeType: 'text/csv' });
    });

    cy.findAllByText('Something went wrong.').should('be.visible');
  });

  it('renders the error state when receiving a list error from the server', () => {
    cy.stubRequest({
      url: '/api/v1/recipient-validation/list',
      statusCode: 400,
      fixture: 'recipient-validation/list/400.get.json',
    });

    cy.visit(ROUTE_URL);

    cy.findByText('Something went wrong.');
  });
});
