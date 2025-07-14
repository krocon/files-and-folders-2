describe("Shell Autocomplete Feature", () => {
  const testDir = Cypress.env("TEST_DIR") || "/Users/marckronberg/WebstormProjects/files-and-folders-2/test";

  before(() => {
    // Set up the test environment before all tests
    cy.restoreTestEnvironment();
  });

  after(() => {
    // Clean up the test environment after all tests
    cy.cleanupTestEnvironment();
  });

  beforeEach(() => {
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

    // Set localStorage values
    localStorage.setItem("tabs0", JSON.stringify(tabs0Config));

    // Visit the app
    cy.visit("/");

    // Wait for the app to load
    cy.get(".fnf-main-div").should("exist");
  });

  it("should display the shell input field", () => {
    // Verify the shell panel exists
    cy.get("app-shell-panel").should("exist");

    // Verify the shell input field exists
    cy.get("app-shell-panel input").should("exist");

    // Take a screenshot of the shell panel
    cy.screenshot("shell-panel");
  });

  it("should show autocomplete suggestions when typing", () => {
    // Focus on the shell input field
    cy.get("app-shell-panel input").click().clear();

    // Type a command prefix that should trigger autocomplete
    cy.get("app-shell-panel input").type("ls");

    // Wait for autocomplete suggestions to appear
    cy.get("mat-option").should("exist");

    // Verify that at least one autocomplete suggestion is displayed
    cy.get("mat-option").should("have.length.at.least", 1);

    // Verify that the 'ls' command is in the suggestions
    cy.get("mat-option").contains("ls").should("exist");

    // Take a screenshot of the autocomplete suggestions
    cy.screenshot("shell-autocomplete-suggestions");
  });

  it("should select a command when clicking on an autocomplete suggestion", () => {
    // Focus on the shell input field
    cy.get("app-shell-panel input").click().clear();

    // Type a command prefix that should trigger autocomplete
    cy.get("app-shell-panel input").type("cd");

    // Wait for autocomplete suggestions to appear
    cy.get("mat-option").should("exist");

    // Click on the 'cd' suggestion
    cy.get("mat-option").contains("cd").click();

    // Verify that the input field now contains the selected command
    cy.get("app-shell-panel input").should("have.value", "cd");

    // Take a screenshot after selecting a command
    cy.screenshot("shell-autocomplete-selected");
  });

  it("should filter suggestions as user types more characters", () => {
    // Focus on the shell input field
    cy.get("app-shell-panel input").click().clear();

    // Type a single character to get many suggestions
    cy.get("app-shell-panel input").type("c");

    // Wait for autocomplete suggestions to appear
    cy.get("mat-option").should("exist");

    // Store the number of suggestions for 'c'
    cy.get("mat-option").its("length").as("initialSuggestionCount");

    // Type more characters to narrow down suggestions
    cy.get("app-shell-panel input").type("d");

    // Wait for updated autocomplete suggestions
    cy.get("mat-option").should("exist");

    // Verify that the number of suggestions has decreased
    cy.get("@initialSuggestionCount").then(initialCount => {
      cy.get("mat-option").its("length").should("be.lte", initialCount);
    });

    // Take a screenshot of the filtered suggestions
    cy.screenshot("shell-autocomplete-filtered");
  });
});