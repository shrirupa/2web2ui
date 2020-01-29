describe('The suppression list create page', () => {
  describe('the single recipient tab', () => {
    beforeEach(() => {
      cy.stubAuth();
      cy.login({ isStubbed: login });
    });

    it('adds a suppression list when filling out the form', () => {});

    it('renders the form submission button as disabled when relevant fields are not filled out', () => {});

    it('renders required errors for the "Email Address" and "Type" fields', () => {});
  });

  describe('the bulk upload tab', () => {
    it('allows submission of a CSV file to add a new suppression list', () => {});

    it('renders a subaccount field when subaccounst exist', () => {});

    it('renders the "Upload" button as disabled when no CSV file has been uploaded', () => {});
  });
});
