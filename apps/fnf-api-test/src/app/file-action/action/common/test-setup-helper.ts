import * as fse from 'fs-extra';
import * as path from 'path';

/**
 * Helper functions for setting up and tearing down test environments
 * These functions help maintain a consistent test environment by copying
 * demo files from the root /test directory to the apps/fnf-api/test directory
 * and cleaning up after tests.
 */

// Define paths - use path.resolve to get the absolute path to the project root
const rootDir = path.resolve(process.cwd());
const apiTestDir = path.join(rootDir, 'test');
const testDataDir = path.join(rootDir, 'testdata');


/**
 * Sets up the test environment by copying demo files to apps/fnf-api-test/test
 * This ensures that each test has a fresh copy of the demo files to work with.
 *
 * @returns Promise that resolves when setup is complete
 */
export async function setupTestEnvironment(): Promise<void> {
  try {
    // First, ensure we have a clean test environment
    await cleanupTestEnvironment();

    // Ensure the target directory exists
    await fse.ensureDir(apiTestDir);
    await fse.ensureDir(testDataDir);

    const demoZipPath = path.join(apiTestDir, 'demo.zip');
    const testDataDemoZipPath = path.join(testDataDir, 'demo.zip');


    try {
      await fse.copy(testDataDir, apiTestDir);
      // await fse.copy(testDataDemoZipPath, demoZipPath);
    } catch (error) {
      console.error(`Warning: Could not copy files from ${apiTestDir} to ${testDataDir}: ${error.message}`);
      console.info('demoZipPath', demoZipPath);
      console.info('testDataDemoZipPath', testDataDemoZipPath);
    }


    // Ensure demo.zip exists
    // if (!await fse.pathExists(demoZipPath)) {
    //   console.warn(`Warning: demo.zip not found at ${demoZipPath}, creating empty file instead.`);
    //   await fse.writeFile(demoZipPath, '');
    // }

    // Create demo and target directories
    const demoDir = path.join(apiTestDir, 'demo');
    const targetDir = path.join(apiTestDir, 'target');

    await fse.ensureDir(demoDir);
    await fse.ensureDir(targetDir);

    // Create some test files in the demo directory
    await fse.writeFile(
      path.join(demoDir, 'test-file.txt'),
      'This is a test file for file operations.'
    );

    // Create a file to move for move tests
    await fse.writeFile(
      path.join(demoDir, 'file-to-move.txt'),
      'This file will be moved during tests.'
    );

    // Create nested directory structure
    const nestedDir = path.join(demoDir, 'nested');
    await fse.ensureDir(nestedDir);
    await fse.writeFile(
      path.join(nestedDir, 'nested-file.txt'),
      'This is a nested file for testing.'
    );

    // Create deep nested directory
    const deepDir = path.join(nestedDir, 'deep');
    await fse.ensureDir(deepDir);
    await fse.writeFile(
      path.join(deepDir, 'deep-file.txt'),
      'This is a deeply nested file for testing.'
    );

    // Create directory for move tests
    const nestedForMoveDir = path.join(demoDir, 'nested-for-move');
    await fse.ensureDir(nestedForMoveDir);
    await fse.writeFile(
      path.join(nestedForMoveDir, 'nested-file.txt'),
      'This is a nested file for move testing.'
    );

    // Verify that all required files and directories exist
    // const requiredPaths = [
    //   demoDir,
    //   targetDir,
    //   path.join(demoDir, 'test-file.txt'),
    //   path.join(demoDir, 'file-to-move.txt'),
    //   nestedDir,
    //   path.join(nestedDir, 'nested-file.txt'),
    //   deepDir,
    //   path.join(deepDir, 'deep-file.txt'),
    //   nestedForMoveDir,
    //   path.join(nestedForMoveDir, 'nested-file.txt')
    // ];
    //
    // for (const p of requiredPaths) {
    //   if (!await fse.pathExists(p)) {
    //     console.error(`Error: Required path ${p} does not exist after setup.`, p);
    //   }
    // }

  } catch (error) {
    console.error(`Error setting up test environment: ${error.message}`);
    throw error;
  }
}

/**
 * Cleans up the test environment by removing all files from apps/fnf-api-test/test
 * This ensures that tests don't interfere with each other.
 *
 * @returns Promise that resolves when cleanup is complete
 */
export async function cleanupTestEnvironment(): Promise<void> {
  // Check if directory exists before attempting to clean it
  if (await fse.pathExists(apiTestDir)) {
    try {
      // Use a more robust approach to clean up the test directory
      // First, remove the entire directory and all its contents
      await fse.remove(apiTestDir);

      // Then recreate the empty directory
      await fse.ensureDir(apiTestDir);

    } catch (error) {
      console.warn(`Warning: Could not fully clean up test environment: ${error.message}`);

      // Fallback cleanup method if the first approach fails
      try {
        // Try to empty the directory
        await fse.emptyDir(apiTestDir);

        // Additional cleanup for nested directories that might be causing issues
        const nestedDirs = [
          path.join(apiTestDir, 'demo', 'nested', 'deep'),
          path.join(apiTestDir, 'demo', 'nested'),
          path.join(apiTestDir, 'demo'),
          path.join(apiTestDir, 'target')
        ];

        // Process directories from deepest to shallowest
        for (const dir of nestedDirs) {
          if (await fse.pathExists(dir)) {
            try {
              // Remove the directory and all its contents
              await fse.remove(dir);
            } catch (innerError) {
              console.warn(`Warning: Could not remove directory ${dir}: ${innerError.message}`);
            }
          }
        }
      } catch (fallbackError) {
        console.warn(`Warning: Fallback cleanup also failed: ${fallbackError.message}`);
      }
    }
  }
}

/**
 * Restores the test environment to its original state
 * This function first cleans up and then sets up the environment again.
 *
 * @returns Promise that resolves when restoration is complete
 */
export async function restoreTestEnvironment(): Promise<void> {
  await cleanupTestEnvironment();
  await setupTestEnvironment();
}


