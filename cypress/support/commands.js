// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

/* eslint-disable no-undef */
// TODO: refactor to use `cy.request()` to log in programmatically instead of via UI interaction
Cypress.Commands.add('login', () => {
  cy.visit('/');
  cy.get('[name="username"]').type(Cypress.env('USERNAME'));
  cy.get('[name="password"]').type(Cypress.env('PASSWORD'));
  cy.get('button[type="submit"]').click();
});