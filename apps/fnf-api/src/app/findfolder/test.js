const fs = require('fs').promises;
const path = require('path');
const os = require('os');

const homeDir = os.homedir();
const username = os.userInfo().username;

// Liste der zu ignorierenden Pfade
const ignoreDirs = new Set([
  '/System',
  '/private',
  '/dev',
  '/Volumes',
  '/Network',
  '/cores',
  '/tmp',
  '/var',
  path.join(homeDir, 'Library'),
  path.join(homeDir, '.Trash'),
  path.join(homeDir, '.ssh'),
  path.join(homeDir, '.npm'),
  path.join(homeDir, '.cache'),
  path.join(homeDir, 'Applications')
]);

const ignoreDirs2 = new Set([
  '/node_modules/',
  '/Library/',
  '.app/',
  '/.gallery/'
]);

async function scanDirectory(dir, result = []) {
  if ([...ignoreDirs].some(ignorePath => dir.startsWith(ignorePath) )) {
    return;
  }
  if ([...ignoreDirs2].some(ignorePath => dir.includes(ignorePath) )) {
    return;
  }

  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (err) {
    return;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      result.push(fullPath);
      console.log(fullPath);
      await scanDirectory(fullPath, result);
    }
  }

  return result;
}

(async () => {
  const dirs = await scanDirectory('/');
  console.log('Gefundene Verzeichnisse:', dirs);
})();
