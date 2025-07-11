import * as fse from 'fs-extra';
import * as path from 'path';

/**
 * Helper functions for setting up and tearing down test environments
 * These functions help maintain a consistent test environment by copying
 * demo files from the root /test directory to the apps/fnf-api/test directory
 * and cleaning up after tests.
 */

// Define paths - use process.cwd() to get the absolute path to the project root
const rootDir = process.cwd();
const rootTestDir = path.join(rootDir, 'test');
const apiTestDir = path.join(rootDir, 'apps/fnf-api/test');

/**
 * Sets up the test environment by copying demo files from root /test to apps/fnf-api/test
 * This ensures that each test has a fresh copy of the demo files to work with.
 *
 * @returns Promise that resolves when setup is complete
 */
export async function setupTestEnvironment(): Promise<void> {
  // Ensure the target directory exists
  await fse.ensureDir(apiTestDir);

  // Copy demo.zip from root test directory
  const demoZipSource = path.join(rootTestDir, 'demo.zip');
  const demoZipTarget = path.join(apiTestDir, 'demo.zip');

  if (await fse.pathExists(demoZipSource)) {
    await fse.copy(demoZipSource, demoZipTarget);
  }

  // Create demo and target directories
  await fse.ensureDir(path.join(apiTestDir, 'demo'));
  await fse.ensureDir(path.join(apiTestDir, 'target'));

  // Create some test files in the demo directory
  await fse.writeFile(
    path.join(apiTestDir, 'demo', 'test-file.txt'),
    'This is a test file for file operations.'
  );

  // Create nested directory structure
  const nestedDir = path.join(apiTestDir, 'demo', 'nested');
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
}

/**
 * Cleans up the test environment by removing all files from apps/fnf-api/test
 * This ensures that tests don't interfere with each other.
 *
 * @returns Promise that resolves when cleanup is complete
 */
export async function cleanupTestEnvironment(): Promise<void> {
  // Check if directory exists before attempting to empty it
  if (await fse.pathExists(apiTestDir)) {
    await fse.emptyDir(apiTestDir);
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
