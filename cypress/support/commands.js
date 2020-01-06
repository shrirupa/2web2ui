// ***********************************************
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import '@testing-library/cypress/add-commands';
import 'cypress-file-upload';

/**
 * Used to authenticate with Cypress
 *
 * @param {boolean} isStubbed - whether the authentication response is stubbed. Must be preceded by `cy.stubAuth()` to succeed
 */
Cypress.Commands.add('login', (options = {}) => {
  const { isStubbed } = options;

  cy.getCookie('auth').then(authCookie => {
    cy.server();

    if (!authCookie) {
      if (!isStubbed) {
        cy.route('POST', '/api/v1/authenticate').as('loginPost');
        cy.route('GET', `/api/v1/users/${Cypress.env('USERNAME')}/two-factor`).as('twoFactorGet');
      }

      cy.visit('/');
      cy.findByLabelText('Email or Username').type(Cypress.env('USERNAME'));
      cy.findByLabelText('Password').type(Cypress.env('PASSWORD'));
      cy.get('[data-id="button-log-in"]').click();

      if (!isStubbed) {
        cy.wait('@loginPost');
        cy.wait('@twoFactorGet');
      }
    }
  });
});

/**
 * Used to stub network responses for basic user, account, and auth requests
 */
Cypress.Commands.add('stubAuth', () => {
  cy.server();

  cy.fixture('authenticate/200.post.json').as('authenticatePost');
  cy.fixture('users/two-factor/200.get.json').as('twoFactorGet');
  cy.fixture('users/200.get.json').as('usersGet');
  cy.fixture('account/200.get.json').as('accountGet');
  cy.fixture('account/plans/200.get.json').as('plansGet');
  cy.fixture('authenticate/grants/200.get.json').as('grantsGet');
  cy.fixture('suppression-list/200.get.json').as('suppressionsGet');
  cy.fixture('api-keys/200.get.json').as('apiKeysGet');
  cy.fixture('sending-domains/200.get.json').as('sendingDomainsGet');

  cy.route({
    method: 'POST',
    url: '/api/v1/authenticate',
    status: 200,
    response: '@authenticatePost',
  }).as('stubbedTwoFactorRequest');
  cy.route({
    method: 'GET',
    url: `/api/v1/users/${Cypress.env('USERNAME')}/two-factor`,
    status: 200,
    response: '@twoFactorGet',
  }).as('stubbedTwoFactorRequest');
  cy.route({
    method: 'GET',
    url: '/api/v1/account*',
    status: 200,
    response: '@accountGet',
  }).as('stubbedAccountRequest');
  cy.route({
    method: 'GET',
    url: '/api/v1/account/plans',
    status: 200,
    response: '@plansGet',
  }).as('stubbedPlansRequest');
  cy.route({
    method: 'GET',
    url: `/api/v1/users/${Cypress.env('USERNAME')}`,
    status: 200,
    response: '@usersGet',
  }).as('stubbedUsersRequest');
  cy.route({
    method: 'GET',
    url: '/api/v1/authenticate/grants*',
    status: 200,
    response: '@grantsGet',
  }).as('stubbedGrantsRequest');
  cy.route({
    method: 'GET',
    url: '/api/v1/suppression-list*',
    status: 200,
    response: '@suppressionsGet',
  }).as('stubbedSuppressionsGet');
  cy.route({
    method: 'GET',
    url: '/api/v1/api-keys',
    status: 200,
    response: '@apiKeysGet',
  }).as('stubbedApiKeysGet');
  cy.route({
    method: 'GET',
    url: '/api/v1/sending-domains',
    status: 200,
    response: '@sendingDomainsGet',
  }).as('stubbedSendingDomains');
});
