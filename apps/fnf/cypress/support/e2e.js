// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
// import './commands'

// Custom commands for file operations
Cypress.Commands.add('setupTestEnvironment', () => {
  return cy.task('setupTestEnvironment');
});

Cypress.Commands.add('cleanupTestEnvironment', () => {
  return cy.task('cleanupTestEnvironment');
});

Cypress.Commands.add('restoreTestEnvironment', () => {
  return cy.task('restoreTestEnvironment');
});

// Clear localStorage before each test
beforeEach(() => {
  cy.clearLocalStorage();
});
