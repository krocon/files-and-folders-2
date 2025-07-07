describe('Files and Folders App', () => {
  const testDir = Cypress.env('TEST_DIR') || '/Users/marckronberg/WebstormProjects/files-and-folders-2/test';

  before(() => {
    // Set up the test environment before all tests
    cy.restoreTestEnvironment();
  });

  after(() => {
    // Clean up the test environment after all tests
    cy.cleanupTestEnvironment();
  });

  beforeEach(() => {
    // Clear localStorage (already done in support/e2e.js)

    // Set up localStorage with the specified configuration
    // For left panel (tabs0)
    const tabs0Config = {
      panelIndex: 0,
      tabs: [
        {
          path: testDir,
          history: [],
          filterActive: true,
          hiddenFilesVisible: false,
          filterText: "",
          id: 12,
          historyIndex: 0
        }
      ],
      selectedTabIndex: 0
    };

    // For right panel (tabs1)
    const tabs1Config = {
      panelIndex: 1,
      tabs: [
        {
          path: testDir + '/apps/fnf',
          history: [],
          filterActive: false,
          hiddenFilesVisible: false,
          filterText: "we",
          id: 23,
          historyIndex: 0
        }
      ],
      selectedTabIndex: 0
    };

    // Set localStorage values
    localStorage.setItem('tabs0', JSON.stringify(tabs0Config));
    localStorage.setItem('tabs1', JSON.stringify(tabs1Config));

    // Visit the app
    cy.visit('/');
  });

  it('should load the application', () => {
    // Basic test to verify the app loads
    cy.get('.fnf-main-div').should('exist');

    // Verify the panels are displayed
    cy.get('.panel-left').should('exist');
    cy.get('.panel-right').should('exist');

    // Take a screenshot after application loads
    cy.screenshot('app-loaded');
  });

  it('should display files in the left panel', () => {
    // Verify files are displayed in the left panel
    cy.get('.panel-left').find('.file-table').should('exist');

    // Take a screenshot of the left panel with files
    cy.screenshot('left-panel-files');
  });

  it('should display files in the right panel', () => {
    // Verify files are displayed in the right panel
    cy.get('.panel-right').find('.file-table').should('exist');

    // Take a screenshot of the right panel with files
    cy.screenshot('right-panel-files');
  });
});
