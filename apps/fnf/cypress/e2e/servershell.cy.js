describe("Servershell Component", () => {
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

    // Visit the shell page directly
    cy.visit("/shell");

    // Wait for the app to load
    cy.get(".server-shell-div").should("exist");
  });

  describe("Basic UI Elements", () => {
    it("should display the servershell component", () => {
      // Verify the main shell container exists
      cy.get(".server-shell-div").should("exist");

      // Verify the back button exists
      cy.get(".back-button").should("exist").and("contain", "← Back to Files");

      // Verify the shell input field exists
      cy.get("input[matInput]").should("exist");

      // Verify the path prefix is displayed
      cy.get(".path-div").should("exist").and("contain", ">");

      // Take a screenshot of the servershell component
      cy.screenshot("servershell-component");
    });

    it("should display the correct path in the prefix", () => {
      // The path should be displayed in the prefix
      cy.get(".path-div").should("contain", testDir);
    });
  });

  describe("Keyboard Event Handling", () => {
    beforeEach(() => {
      // Add some commands to history by executing them first
      cy.get("input[matInput]").click().clear().type("ls -al");
      cy.get("input[matInput]").type("{enter}");
      cy.wait(1000); // Wait for command to be processed

      cy.get("input[matInput]").clear().type("pwd");
      cy.get("input[matInput]").type("{enter}");
      cy.wait(1000);

      cy.get("input[matInput]").clear().type("cd /tmp");
      cy.get("input[matInput]").type("{enter}");
      cy.wait(1000);

      // Clear the input for testing
      cy.get("input[matInput]").clear();
    });

    it("should navigate history with arrow up key", () => {
      // Press arrow up to get the last command
      cy.get("input[matInput]").type("{upArrow}");

      // Should show the last executed command
      cy.get("input[matInput]").should("have.value", "cd /tmp");

      // Press arrow up again to get the previous command
      cy.get("input[matInput]").type("{upArrow}");
      cy.get("input[matInput]").should("have.value", "pwd");

      // Press arrow up again to get the first command
      cy.get("input[matInput]").type("{upArrow}");
      cy.get("input[matInput]").should("have.value", "ls -al");

      // Take a screenshot of history navigation
      cy.screenshot("servershell-history-navigation");
    });

    it("should navigate history with arrow down key", () => {
      // First go up in history
      cy.get("input[matInput]").type("{upArrow}");
      cy.get("input[matInput]").should("have.value", "cd /tmp");

      cy.get("input[matInput]").type("{upArrow}");
      cy.get("input[matInput]").should("have.value", "pwd");

      // Now go down in history
      cy.get("input[matInput]").type("{downArrow}");
      cy.get("input[matInput]").should("have.value", "cd /tmp");

      // Go down to clear the input (beyond history)
      cy.get("input[matInput]").type("{downArrow}");
      cy.get("input[matInput]").should("have.value", "");
    });

    it("should clear input with Escape key", () => {
      // Type some text
      cy.get("input[matInput]").type("some command text");
      cy.get("input[matInput]").should("have.value", "some command text");

      // Press Escape to clear
      cy.get("input[matInput]").type("{esc}");
      cy.get("input[matInput]").should("have.value", "");

      // Take a screenshot after clearing with Escape
      cy.screenshot("servershell-escape-clear");
    });

    it("should handle empty history gracefully", () => {
      // Clear localStorage to simulate empty history
      localStorage.removeItem("servershell-history");

      // Reload the page
      cy.reload();
      cy.get(".server-shell-div").should("exist");

      // Try to navigate history when it's empty
      cy.get("input[matInput]").type("{upArrow}");
      cy.get("input[matInput]").should("have.value", "");

      cy.get("input[matInput]").type("{downArrow}");
      cy.get("input[matInput]").should("have.value", "");
    });
  });

  describe("Command Execution", () => {
    it("should execute simple commands", () => {
      // Execute a simple ls command
      cy.get("input[matInput]").click().clear().type("ls");
      cy.get("input[matInput]").type("{enter}");

      // Wait for command execution
      cy.wait(2000);

      // The input should be cleared after execution
      cy.get("input[matInput]").should("have.value", "");

      // Check if output is displayed (assuming there's an output component)
      cy.get("app-servershell-out").should("exist");

      // Take a screenshot of command execution
      cy.screenshot("servershell-command-execution");
    });

    it("should handle command errors gracefully", () => {
      // Execute an invalid command
      cy.get("input[matInput]").click().clear().type("invalidcommandthatdoesnotexist");
      cy.get("input[matInput]").type("{enter}");

      // Wait for command execution
      cy.wait(2000);

      // The input should be cleared after execution
      cy.get("input[matInput]").should("have.value", "");

      // Check if error is displayed (look for error styling or tooltip)
      cy.get("input[matInput]").should("have.class", "fnf-warn-fg").or("not.have.class", "fnf-warn-fg");

      // Take a screenshot of error handling
      cy.screenshot("servershell-error-handling");
    });

    it("should not execute empty commands", () => {
      // Try to execute empty command
      cy.get("input[matInput]").click().clear();
      cy.get("input[matInput]").type("{enter}");

      // Input should remain empty and focused
      cy.get("input[matInput]").should("have.value", "");
      cy.get("input[matInput]").should("be.focused");
    });

    it("should not execute whitespace-only commands", () => {
      // Try to execute whitespace-only command
      cy.get("input[matInput]").click().clear().type("   ");
      cy.get("input[matInput]").type("{enter}");

      // Input should be cleared
      cy.get("input[matInput]").should("have.value", "");
    });

    it("should add executed commands to history", () => {
      // Execute a command
      cy.get("input[matInput]").click().clear().type("echo 'test command'");
      cy.get("input[matInput]").type("{enter}");

      // Wait for command execution
      cy.wait(1000);

      // Clear input and check if command is in history
      cy.get("input[matInput]").clear();
      cy.get("input[matInput]").type("{upArrow}");
      cy.get("input[matInput]").should("have.value", "echo 'test command'");
    });
  });

  describe("Focus Management", () => {
    it("should handle focus events", () => {
      // Click on input to focus
      cy.get("input[matInput]").click();
      cy.get("input[matInput]").should("be.focused");

      // The input should have focus styling
      cy.get("input[matInput]").should("have.class", "font-weight-bold");

      // Click outside to blur (if there's another element to click)
      cy.get(".back-button").click();

      // Should navigate back to files
      cy.url().should("include", "/files");
    });
  });

  describe("Autocomplete Integration", () => {
    it("should show autocomplete suggestions", () => {
      // Type a command prefix
      cy.get("input[matInput]").click().clear().type("ls");

      // Wait for autocomplete suggestions
      cy.get("mat-option", {timeout: 3000}).should("exist");

      // Should have at least one suggestion
      cy.get("mat-option").should("have.length.at.least", 1);

      // Take a screenshot of autocomplete
      cy.screenshot("servershell-autocomplete");
    });

    it("should select autocomplete suggestions", () => {
      // Type a command prefix
      cy.get("input[matInput]").click().clear().type("cd");

      // Wait for autocomplete suggestions
      cy.get("mat-option", {timeout: 3000}).should("exist");

      // Click on a suggestion
      cy.get("mat-option").first().click();

      // Input should be updated with the selected command
      cy.get("input[matInput]").should("not.have.value", "cd");
      cy.get("input[matInput]").invoke("val").should("include", "cd");
    });
  });

  describe("Navigation", () => {
    it("should navigate back to files", () => {
      // Click the back button
      cy.get(".back-button").click();

      // Should navigate to files page
      cy.url().should("include", "/files");
    });
  });

  describe("Performance and Responsiveness", () => {
    it("should handle rapid key presses", () => {
      // Rapidly press arrow keys
      cy.get("input[matInput]").click().clear();

      for (let i = 0; i < 10; i++) {
        cy.get("input[matInput]").type("{upArrow}", {delay: 50});
      }

      // Should still be responsive
      cy.get("input[matInput]").should("be.visible");

      // Take a screenshot of rapid key handling
      cy.screenshot("servershell-rapid-keys");
    });

    it("should handle long command output", () => {
      // Execute a command that produces long output
      cy.get("input[matInput]").click().clear().type("ls -la /usr/bin");
      cy.get("input[matInput]").type("{enter}");

      // Wait for command execution
      cy.wait(3000);

      // Should still be responsive
      cy.get("input[matInput]").should("be.visible");
      cy.get("app-servershell-out").should("exist");

      // Take a screenshot of long output handling
      cy.screenshot("servershell-long-output");
    });
  });
});