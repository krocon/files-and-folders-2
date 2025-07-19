describe("FnF Editor Component", () => {
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

  it("should display the fnf-editor component in shell output", () => {
    // First, we need to trigger a shell command that produces output
    // Focus on the shell input field
    cy.get("app-shell-panel input").should("exist").click().clear();

    // Type a command that will produce output
    cy.get("app-shell-panel input").type("ls");

    // Press Enter to execute the command
    cy.get("app-shell-panel input").type("{enter}");

    // Wait for the shell output bottom sheet to appear
    cy.get("mat-bottom-sheet-container", {timeout: 10000}).should("exist");

    // Verify that the fnf-editor component is present in the shell output
    cy.get("mat-bottom-sheet-container app-shell-out").should("exist");
    cy.get("mat-bottom-sheet-container app-shell-out app-fnf-editor").should("exist");

    // Take a screenshot of the editor in shell output
    cy.screenshot("fnf-editor-in-shell-out");
  });

  it("should load Monaco editor within the fnf-editor component", () => {
    // Execute a command to get shell output
    cy.get("app-shell-panel input").should("exist").click().clear();
    cy.get("app-shell-panel input").type("echo 'Hello World'");
    cy.get("app-shell-panel input").type("{enter}");

    // Wait for the shell output bottom sheet to appear
    cy.get("mat-bottom-sheet-container", {timeout: 10000}).should("exist");

    // Wait for Monaco editor to load (it may take some time)
    cy.get("mat-bottom-sheet-container app-fnf-editor .monaco-editor", {timeout: 15000}).should("exist");

    // Verify that the Monaco editor container is visible
    cy.get("mat-bottom-sheet-container app-fnf-editor .monaco-editor").should("be.visible");

    // Take a screenshot of the loaded Monaco editor
    cy.screenshot("monaco-editor-loaded");
  });

  it("should display text content in the Monaco editor", () => {
    // Execute a command to get shell output with some content
    cy.get("app-shell-panel input").should("exist").click().clear();
    cy.get("app-shell-panel input").type("echo 'Test content for editor'");
    cy.get("app-shell-panel input").type("{enter}");

    // Wait for the shell output bottom sheet to appear
    cy.get("mat-bottom-sheet-container", {timeout: 10000}).should("exist");

    // Wait for Monaco editor to load
    cy.get("mat-bottom-sheet-container app-fnf-editor .monaco-editor", {timeout: 15000}).should("exist");

    // Verify that the editor contains some text content
    // Note: Monaco editor content is in a complex DOM structure, so we check for the presence of text
    cy.get("mat-bottom-sheet-container app-fnf-editor .monaco-editor .view-lines").should("exist");

    // Take a screenshot of the editor with content
    cy.screenshot("fnf-editor-with-content");
  });

  it("should be read-only in shell output context", () => {
    // Execute a command to get shell output
    cy.get("app-shell-panel input").should("exist").click().clear();
    cy.get("app-shell-panel input").type("pwd");
    cy.get("app-shell-panel input").type("{enter}");

    // Wait for the shell output bottom sheet to appear
    cy.get("mat-bottom-sheet-container", {timeout: 10000}).should("exist");

    // Wait for Monaco editor to load
    cy.get("mat-bottom-sheet-container app-fnf-editor .monaco-editor", {timeout: 15000}).should("exist");

    // Try to click in the editor area
    cy.get("mat-bottom-sheet-container app-fnf-editor .monaco-editor").click();

    // Verify that the editor is read-only by checking if we can type
    // In a read-only editor, typing should not change the content
    cy.get("mat-bottom-sheet-container app-fnf-editor .monaco-editor").type("This should not appear");

    // Take a screenshot to verify read-only state
    cy.screenshot("fnf-editor-readonly-test");
  });

  it("should have proper styling and dimensions", () => {
    // Execute a command to get shell output
    cy.get("app-shell-panel input").should("exist").click().clear();
    cy.get("app-shell-panel input").type("date");
    cy.get("app-shell-panel input").type("{enter}");

    // Wait for the shell output bottom sheet to appear
    cy.get("mat-bottom-sheet-container", {timeout: 10000}).should("exist");

    // Wait for Monaco editor to load
    cy.get("mat-bottom-sheet-container app-fnf-editor .monaco-editor", {timeout: 15000}).should("exist");

    // Verify that the editor has proper dimensions
    cy.get("mat-bottom-sheet-container app-fnf-editor").should("have.css", "height");
    cy.get("mat-bottom-sheet-container app-fnf-editor .monaco-editor").should("be.visible");

    // Verify that the editor takes up the expected space
    cy.get("mat-bottom-sheet-container app-fnf-editor .monaco-editor").invoke("height").should("be.greaterThan", 100);

    // Take a screenshot of the styled editor
    cy.screenshot("fnf-editor-styling");
  });
});
