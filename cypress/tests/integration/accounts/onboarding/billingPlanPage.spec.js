describe('The billing plan page', () => {
  beforeEach(() => {
    cy.stubAuth();
    cy.stubRequest({
      url: '/api/v1/account/countries?filter=billing',
      fixture: 'account/countries/200.get.billing-filter.json',
    });
    cy.login({ isStubbed: true });
    cy.visit('/onboarding/plan');
  });

  it('renders with a relevant page title', () => {
    cy.title().should('include', 'Onboarding');
  });

  it('renders the plan selection custom select', () => {
    cy.findByText('Select A Plan').should('be.visible');
  });

  it('renders with a link to the SparkPost knowledge base', () => {
    cy.findByText('Knowledge Base').should(
      'have.attr',
      'href',
      'https://www.sparkpost.com/docs/faq/difference-between-starter-and-premier',
    );
  });

  describe('the plan selection custom select', () => {
    it('opens when the title is clicked', () => {
      cy.findByText('Select A Plan').click();
      cy.findByText('Test Account:').should('be.visible');
      cy.findByText('Starter:').should('be.visible');
    });

    it('hides the credit card form when the user selects the test account', () => {
      cy.findByText('Select A Plan').click();
      cy.findByText('Full-featured developer account').click();

      cy.queryByLabelText('Promo Code').should('not.be.visible');
      cy.queryByLabelText('Credit Card Number').should('not.be.visible');
      cy.queryByLabelText('Cardholder Name').should('not.be.visible');
      cy.queryByLabelText('Expiration Date').should('not.be.visible');
      cy.queryByLabelText('Security Code').should('not.be.visible');
      cy.queryByLabelText('Country').should('not.be.visible');
      cy.queryByLabelText('State').should('not.be.visible');
      cy.queryByLabelText('Zip Code').should('not.be.visible');
    });

    it('shows the credit card form when the user selects a non free plan', () => {
      cy.findByText('Select A Plan').click();
      cy.queryAllByRole('option')
        .eq(1)
        .click();

      cy.queryByLabelText('Promo Code').should('be.visible');
      cy.queryByLabelText('Credit Card Number').should('be.visible');
      cy.queryByLabelText('Cardholder Name').should('be.visible');
      cy.queryByLabelText('Expiration Date').should('be.visible');
      cy.queryByLabelText('Security Code').should('be.visible');
      cy.queryByLabelText('Country').should('be.visible');
      cy.queryByLabelText('State').should('be.visible');
      cy.queryByLabelText('Zip Code').should('be.visible');
    });
  });

  describe('the credit card form', () => {
    it('has a country select that controls rendering of a state field when the user selects anything other than "United States"', () => {
      cy.findByLabelText('Country').select('United States');
      cy.findByLabelText('State').should('be.visible');
      cy.findByLabelText('Country').select('Albania');
      cy.findByLabelText('State').should('not.be.visible');
    });

    it('has a credit card field which provides user feedback when the entered value is not an accepted format', () => {
      cy.findByLabelText('Credit Card Number')
        .type('1111111111111111')
        .blur();

      cy.queryByText('We only accept Visa, MasterCard, AmericanExpress, Discover').should(
        'be.visible',
      );
    });

    it('renders the first and last name fields when the user account does not have a stored first and last name', () => {
      cy.stubRequest({
        fixture: 'users/200.get.no-first-or-last-names.json',
        url: `/api/v1/users/${Cypress.env('USERNAME')}`,
      });

      cy.visit('/onboarding/plan'); // Revisit page to override existing stub in `beforeEach()`

      cy.findByLabelText('First Name').should('be.visible');
      cy.findByLabelText('Last Name').should('be.visible');
    });

    it('does not render the first and last name fields when the user account has a stored first and last name', () => {
      cy.stubRequest({
        fixture: 'users/200.get.json',
        url: `/api/v1/users/${Cypress.env('USERNAME')}`,
      });

      cy.visit('/onboarding/plan'); // Revisit page to override existing stub in `beforeEach()`

      cy.findByLabelText('First Name').should('not.be.visible');
      cy.findByLabelText('Last Name').should('not.be.visible');
    });

    it('shows "Required" errors on all required fields when the user attempts to submit the form before completing relevant data', () => {
      cy.findByText('Get Started').click();

      cy.queryAllByText('Required').should('have.length', 5);
    });

    describe('the promo code field', () => {
      it('renders an "Invalid promo code" error when no valid promo code is found', () => {
        cy.stubRequest({
          fixture: 'account/subscription/promo-codes/400.get.json',
          url: '/api/v1/account/subscription/promo-codes/*',
          statusCode: 400,
          requestAlias: 'invalidPromoCodeRequest',
        });

        cy.findByLabelText('Promo Code').type('abc');
        cy.findByText('Apply').click();

        cy.wait('@invalidPromoCodeRequest');

        cy.queryByText('Invalid promo code').should('be.visible');
      });

      it('renders a "Resource could not be found" error when no entry is made in the promo code field and the user clicks "Apply"', () => {
        cy.stubRequest({
          url: '/api/v1/account/subscription/promo-codes/*',
          fixture: 'account/subscription/promo-codes/404.get.json',
          statusCode: 404,
          requestAlias: 'resourceNotFoundRequest',
        });

        cy.findByText('Apply').click();

        cy.wait('@resourceNotFoundRequest');

        cy.queryByText('Resource could not be found');
      });

      it('applies the promo code when the promo code is valid', () => {
        cy.stubRequest({
          url: '/api/v1/account/subscription/promo-codes/*',
          fixture: 'account/subscription/promo-codes/200.get.json',
        });

        cy.findByLabelText('Promo Code').type('abc');
        cy.findByText('Apply').click();
        cy.findByText('$10.00').should('be.visible'); // Half of the starting value of $20.00 - determined by the fixture `discount_percentage` value
        cy.findByLabelText('Promo Code').should('be.disabled');
        cy.queryByText('Apply').should('not.be.visible');
        cy.queryByText('Remove').click();
        cy.findByText('$10.00').should('not.be.visible'); // Half of the starting value of $20.00 - determined by the fixture `discount_percentage` value
      });
    });
  });
});
