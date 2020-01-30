describe('The sign up page', () => {
  before(() => {
    cy.stubRequest({
      method: 'POST',
      url: 'https://www.google.com/recaptcha/**/*',
      fixture: 'recaptcha/200.post.json',
      fixtureAlias: 'recaptchaPost',
    });
  });

  beforeEach(() => {
    cy.viewport(1000, 1000); // Helps avoid cookies <Snackbar/>
    cy.visit('/join');
  });

  it('has the title "Sign Up"', () => {
    cy.title().should('include', 'Sign Up');
    cy.findByText('Sign Up').should('be.visible');
  });

  it('renders the "Create Account" button enabled when all fields are filled out', () => {
    cy.queryByLabelText('First Name').type('Ron');
    cy.queryByLabelText('Last Name').type('Swanson');
    cy.queryByLabelText('Email').type('ron.swanson@pawnee.indiana.state.us.gov');
    cy.queryByLabelText('Password').type('mulliganssteakhouse');
    cy.get('[name="tou_accepted"]').check({ force: true }); // Unable to use `queryByLabelText` because HTML is structured incorrectly in the Matchbox component
    cy.findByText('Create Account').should('not.be.disabled');
  });

  it('renders with a disabled "Create Account" button when the user has not filled out the form', () => {
    cy.findByText('Create Account').should('be.disabled');
  });

  it('renders an error when the user already exists', () => {});

  it('renders an error when the user enters an email address in an invalid format', () => {
    cy.queryByLabelText('Email')
      .type('hello@')
      .blur();

    cy.findByText('Invalid Email').should('be.visible');
  });

  it('renders a link to the terms of service', () => {
    cy.findByText('Terms of Use').should(
      'have.attr',
      'href',
      'https://www.sparkpost.com/policies/tou',
    );
  });

  it('renders a link to the log in page', () => {
    cy.findByText('Log In').should('have.attr', 'href', '/auth');
  });
});
