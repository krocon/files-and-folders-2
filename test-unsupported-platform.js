const os = require('os');
const originalPlatform = os.platform;

// Mock os.platform to return an unsupported platform
os.platform = () => 'freebsd';

// Import the open function after mocking os.platform
const { open } = require('./apps/fnf-api/src/app/file-action/action/open.fn');

// Create a test file item and parameters
const FileItem = class {
  constructor(dir, base, ext) {
    this.dir = dir;
    this.base = base;
    this.ext = ext;
  }
};

const FilePara = class {
  constructor(source, target, cmd, flags) {
    this.source = source;
    this.target = target;
    this.cmd = cmd;
    this.flags = flags;
  }
};

// Test the open function with an unsupported platform
async function testUnsupportedPlatform() {
  try {
    const source = new FileItem('./test', 'test-file.txt', 'txt');
    const filePara = new FilePara(source, null, 0, 0);
    
    console.log('Testing open function with unsupported platform...');
    await open(filePara);
    console.log('ERROR: Function did not throw an error as expected');
  } catch (error) {
    console.log('SUCCESS: Function threw an error as expected:', error.message);
  } finally {
    // Restore original os.platform
    os.platform = originalPlatform;
  }
}

testUnsupportedPlatform();