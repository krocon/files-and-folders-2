const { defineConfig } = require('cypress');
const fs = require('fs-extra');
const path = require('path');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      // implement node event listeners here
      const rootDir = process.cwd();
      const rootTestDir = path.join(rootDir, 'test');
      const appTestDir = path.join(rootDir, 'apps/fnf/test');

      on('task', {
        // File system operations
        ensureDir(dirPath) {
          return fs.ensureDir(dirPath)
            .then(() => true)
            .catch(err => {
              console.error('Error ensuring directory:', err);
              return false;
            });
        },

        pathExists(filePath) {
          return fs.pathExists(filePath)
            .then(exists => exists)
            .catch(err => {
              console.error('Error checking if path exists:', err);
              return false;
            });
        },

        copyFile(params) {
          const { source, target } = params;
          return fs.copy(source, target)
            .then(() => true)
            .catch(err => {
              console.error('Error copying file:', err);
              return false;
            });
        },

        writeFile(params) {
          const { filePath, content } = params;
          return fs.writeFile(filePath, content)
            .then(() => true)
            .catch(err => {
              console.error('Error writing file:', err);
              return false;
            });
        },

        emptyDir(dirPath) {
          return fs.emptyDir(dirPath)
            .then(() => true)
            .catch(err => {
              console.error('Error emptying directory:', err);
              return false;
            });
        },


        // Test environment setup and cleanup
        setupTestEnvironment() {
          // Ensure the target directory exists
          return fs.ensureDir(appTestDir)
            .then(() => {
              // Copy demo.zip from root test directory if it exists
              const demoZipSource = path.join(rootTestDir, 'demo.zip');
              const demoZipTarget = path.join(appTestDir, 'demo.zip');

              return fs.pathExists(demoZipSource)
                .then(exists => {
                  if (exists) {
                    return fs.copy(demoZipSource, demoZipTarget);
                  }
                  return Promise.resolve();
                });
            })
            .then(() => {
              // Create demo and target directories
              return Promise.all([
                fs.ensureDir(path.join(appTestDir, 'demo')),
                fs.ensureDir(path.join(appTestDir, 'target'))
              ]);
            })
            .then(() => {
              // Create some test files in the demo directory
              return fs.writeFile(
                path.join(appTestDir, 'demo', 'test-file.txt'),
                'This is a test file for file operations.'
              );
            })
            .then(() => {
              // Create nested directory structure
              const nestedDir = path.join(appTestDir, 'demo', 'nested');
              return fs.ensureDir(nestedDir)
                .then(() => {
                  return fs.writeFile(
                    path.join(nestedDir, 'nested-file.txt'),
                    'This is a nested file for testing.'
                  );
                })
                .then(() => {
                  // Create deep nested directory
                  const deepDir = path.join(nestedDir, 'deep');
                  return fs.ensureDir(deepDir)
                    .then(() => {
                      return fs.writeFile(
                        path.join(deepDir, 'deep-file.txt'),
                        'This is a deeply nested file for testing.'
                      );
                    });
                });
            })
            .then(() => true)
            .catch(err => {
              console.error('Error setting up test environment:', err);
              return false;
            });
        },

        cleanupTestEnvironment() {
          // Check if directory exists before attempting to empty it
          return fs.pathExists(appTestDir)
            .then(exists => {
              if (exists) {
                return fs.emptyDir(appTestDir);
              }
              return Promise.resolve();
            })
            .then(() => true)
            .catch(err => {
              console.error('Error cleaning up test environment:', err);
              return false;
            });
        },

        restoreTestEnvironment() {
          const self = this;
          // First clean up, then set up
          return fs.pathExists(appTestDir)
            .then(exists => {
              if (exists) {
                return fs.emptyDir(appTestDir);
              }
              return Promise.resolve();
            })
            .then(() => {
              // Now set up the environment again
              // Instead of using this.setupTestEnvironment, call the function directly
              return fs.ensureDir(appTestDir)
                .then(() => {
                  // Copy demo.zip from root test directory if it exists
                  const demoZipSource = path.join(rootTestDir, 'demo.zip');
                  const demoZipTarget = path.join(appTestDir, 'demo.zip');

                  return fs.pathExists(demoZipSource)
                    .then(exists => {
                      if (exists) {
                        return fs.copy(demoZipSource, demoZipTarget);
                      }
                      return Promise.resolve();
                    });
                })
                .then(() => {
                  // Create demo and target directories
                  return Promise.all([
                    fs.ensureDir(path.join(appTestDir, 'demo')),
                    fs.ensureDir(path.join(appTestDir, 'target'))
                  ]);
                })
                .then(() => {
                  // Create some test files in the demo directory
                  return fs.writeFile(
                    path.join(appTestDir, 'demo', 'test-file.txt'),
                    'This is a test file for file operations.'
                  );
                })
                .then(() => {
                  // Create nested directory structure
                  const nestedDir = path.join(appTestDir, 'demo', 'nested');
                  return fs.ensureDir(nestedDir)
                    .then(() => {
                      return fs.writeFile(
                        path.join(nestedDir, 'nested-file.txt'),
                        'This is a nested file for testing.'
                      );
                    })
                    .then(() => {
                      // Create deep nested directory
                      const deepDir = path.join(nestedDir, 'deep');
                      return fs.ensureDir(deepDir)
                        .then(() => {
                          return fs.writeFile(
                            path.join(deepDir, 'deep-file.txt'),
                            'This is a deeply nested file for testing.'
                          );
                        });
                    });
                });
            })
            .then(() => true)
            .catch(err => {
              console.error('Error restoring test environment:', err);
              return false;
            });
        }
      });
    },
  },
});
