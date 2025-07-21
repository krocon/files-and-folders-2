import {ShellSpawnManager} from './shell-spawn-manager';
import {ShellSpawnParaIf, ShellSpawnResultIf} from '@fnf-data';

describe('ShellSpawnManager', () => {
  let manager: ShellSpawnManager;

  beforeEach(() => {
    manager = new ShellSpawnManager();
  });

  afterEach(() => {
    // Clean up all processes after each test
    manager.killAllProcesses();
  });

  describe('spawn', () => {
    it('should spawn a process and emit output', (done) => {
      const para: ShellSpawnParaIf = {
        cmd: 'echo "Hello World"',
        emitKey: 'test-emit',
        cancelKey: 'test-cancel',
        timeout: 5000
      };

      const results: ShellSpawnResultIf[] = [];

      manager.spawn(para, (result: ShellSpawnResultIf) => {
        results.push(result);

        if (result.done) {
          expect(results.length).toBeGreaterThan(0);
          expect(results.some(r => r.out.includes('Hello World'))).toBe(true);
          expect(result.code).toBe(0);
          done();
        }
      });
    });

    it('should handle command errors', (done) => {
      const para: ShellSpawnParaIf = {
        cmd: 'nonexistentcommand',
        emitKey: 'test-emit',
        cancelKey: 'test-cancel',
        timeout: 5000
      };

      let hasStderr = false;

      manager.spawn(para, (result: ShellSpawnResultIf) => {
        if (!result.done && result.error && result.error.includes('command not found')) {
          hasStderr = true;
        }

        if (result.done) {
          expect(result.code).toBe(127); // Command not found exit code
          expect(hasStderr).toBe(true); // Should have received stderr
          done();
        }
      });
    }, 10000);

    it('should handle timeout', (done) => {
      const para: ShellSpawnParaIf = {
        cmd: 'sleep 10', // Command that takes longer than timeout
        emitKey: 'test-emit',
        cancelKey: 'test-cancel',
        timeout: 1000 // 1 second timeout
      };

      manager.spawn(para, (result: ShellSpawnResultIf) => {
        if (result.done && result.error.includes('timeout')) {
          expect(result.code).toBe(-1);
          expect(result.error).toContain('timeout');
          done();
        }
      });
    });

    it('should use the provided directory parameter', (done) => {
      const testDir = '/tmp'; // Use /tmp as it should exist on most systems
      const para: ShellSpawnParaIf = {
        cmd: 'pwd',
        emitKey: 'test-emit',
        cancelKey: 'test-cancel',
        timeout: 5000,
        dir: testDir
      };

      const results: ShellSpawnResultIf[] = [];

      manager.spawn(para, (result: ShellSpawnResultIf) => {
        results.push(result);

        if (result.done) {
          expect(results.length).toBeGreaterThan(0);
          // Check that the output contains the expected directory
          const outputContainsDir = results.some(r => r.out && r.out.trim() === testDir);
          expect(outputContainsDir).toBe(true);
          expect(result.code).toBe(0);
          done();
        }
      });
    });

    it('should handle cd commands and track directory changes', (done) => {
      const cancelKey = 'test-cd-session';
      let testStep = 0;
      let initialDir: string;
      let parentDir: string;

      // Step 1: Get initial directory
      const para1: ShellSpawnParaIf = {
        cmd: 'pwd',
        emitKey: 'test-emit-1',
        cancelKey: cancelKey,
        timeout: 5000,
        dir: process.cwd()
      };

      manager.spawn(para1, (result: ShellSpawnResultIf) => {
        if (result.done && testStep === 0) {
          testStep = 1;
          initialDir = result.currentDir!;
          expect(result.currentDir).toBeDefined();
          expect(result.code).toBe(0);

          // Step 2: Execute cd .. command
          const para2: ShellSpawnParaIf = {
            cmd: 'cd ..',
            emitKey: 'test-emit-2',
            cancelKey: cancelKey,
            timeout: 5000
          };

          manager.spawn(para2, (result: ShellSpawnResultIf) => {
            if (result.done && testStep === 1) {
              testStep = 2;
              parentDir = result.currentDir!;
              expect(result.currentDir).toBeDefined();
              expect(result.currentDir).not.toBe(initialDir);
              expect(result.code).toBe(0);

              // Step 3: Verify directory change with pwd
              const para3: ShellSpawnParaIf = {
                cmd: 'pwd',
                emitKey: 'test-emit-3',
                cancelKey: cancelKey,
                timeout: 5000
              };

              manager.spawn(para3, (result: ShellSpawnResultIf) => {
                if (result.done && testStep === 2) {
                  expect(result.currentDir).toBe(parentDir);
                  expect(result.code).toBe(0);
                  done();
                }
              });
            }
          });
        }
      });
    });

    it('should handle cd to non-existent directory', (done) => {
      const cancelKey = 'test-cd-error';
      const initialDir = process.cwd();

      const para: ShellSpawnParaIf = {
        cmd: 'cd /non/existent/directory',
        emitKey: 'test-emit',
        cancelKey: cancelKey,
        timeout: 5000,
        dir: initialDir
      };

      manager.spawn(para, (result: ShellSpawnResultIf) => {
        if (result.done) {
          expect(result.error).toBeDefined();
          expect(result.error).toContain('Cannot access directory');
          expect(result.code).toBe(1);
          expect(result.currentDir).toBe(initialDir); // Should remain unchanged
          done();
        }
      });
    });

    it('should include currentDir in all results', (done) => {
      const para: ShellSpawnParaIf = {
        cmd: 'echo "test"',
        emitKey: 'test-emit',
        cancelKey: 'test-cancel',
        timeout: 5000,
        dir: process.cwd()
      };

      const results: ShellSpawnResultIf[] = [];

      manager.spawn(para, (result: ShellSpawnResultIf) => {
        results.push(result);

        if (result.done) {
          // All results should have currentDir defined
          results.forEach(r => {
            expect(r.currentDir).toBeDefined();
            expect(typeof r.currentDir).toBe('string');
          });
          done();
        }
      });
    });
  });

  describe('killProcess', () => {
    it('should kill a running process', (done) => {
      const para: ShellSpawnParaIf = {
        cmd: 'sleep 5', // Shorter running command
        emitKey: 'test-emit',
        cancelKey: 'test-cancel',
        timeout: 60000
      };

      let processKilled = false;

      // Start the process
      manager.spawn(para, (result: ShellSpawnResultIf) => {
        if (result.done) {
          // Process finished - check if it was killed
          expect(processKilled).toBe(true);
          done();
        }
      });

      // Kill the process after a short delay
      setTimeout(() => {
        processKilled = manager.killProcess(para.cancelKey);
        expect(processKilled).toBe(true);
      }, 500);
    }, 5000);

    it('should return false for non-existent process', () => {
      const killed = manager.killProcess('non-existent-key');
      expect(killed).toBe(false);
    });
  });

  describe('getActiveProcessCount', () => {
    it('should return correct process count', () => {
      expect(manager.getActiveProcessCount()).toBe(0);

      const para: ShellSpawnParaIf = {
        cmd: 'sleep 1',
        emitKey: 'test-emit',
        cancelKey: 'test-cancel',
        timeout: 5000
      };

      manager.spawn(para, () => {
      });
      expect(manager.getActiveProcessCount()).toBe(1);
    });
  });

  describe('killAllProcesses', () => {
    it('should kill all active processes', () => {
      const para1: ShellSpawnParaIf = {
        cmd: 'sleep 10',
        emitKey: 'test-emit-1',
        cancelKey: 'test-cancel-1',
        timeout: 60000
      };

      const para2: ShellSpawnParaIf = {
        cmd: 'sleep 10',
        emitKey: 'test-emit-2',
        cancelKey: 'test-cancel-2',
        timeout: 60000
      };

      manager.spawn(para1, () => {
      });
      manager.spawn(para2, () => {
      });

      expect(manager.getActiveProcessCount()).toBe(2);

      manager.killAllProcesses();

      // Give some time for cleanup
      setTimeout(() => {
        expect(manager.getActiveProcessCount()).toBe(0);
      }, 100);
    });
  });
});
