#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Base directory where we'll create our random structure
const BASE_DIR = "/Users/marckronberg/WebstormProjects/2025/files-and-folders/apps/fnf/src/assets/demo";

// Get the total count from command line arguments
const totalCount = parseInt(process.argv[2], 10) || 200; // Default to 200 if not specified

// Random content generators
const generateRandomText = (length = 100) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,;:!?-_\n\t";
  return Array.from({length}, () => chars.charAt(Math.floor(Math.random() * chars.length))).join("");
};

const generateRandomName = (prefix, index) => {
  const adjectives = ["happy", "sunny", "clever", "brave", "mighty", "gentle", "swift", "calm", "bright", "wild"];
  const nouns = ["fox", "bear", "eagle", "wolf", "tiger", "lion", "hawk", "deer", "rabbit", "turtle"];

  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];

  return `${prefix}_${adj}_${noun}_${index}`;
};

// Make sure the base directory exists
if (!fs.existsSync(BASE_DIR)) {
  fs.mkdirSync(BASE_DIR, {recursive: true});
}

// Clear existing content
fs.readdirSync(BASE_DIR).forEach(item => {
  const itemPath = path.join(BASE_DIR, item);
  if (fs.lstatSync(itemPath).isDirectory()) {
    fs.rmSync(itemPath, {recursive: true, force: true});
  } else {
    fs.unlinkSync(itemPath);
  }
});

// Track created items
let createdCount = 0;
const maxDepth = 5; // Maximum directory depth

// Create a random directory structure
function createRandomStructure(baseDir, depth = 0) {
  if (createdCount >= totalCount) return;

  // Decide how many subdirectories to create at this level
  const subDirCount = Math.floor(Math.random() * 3) + 2; // 2-4 subdirectories

  for (let i = 0; i < subDirCount; i++) {
    if (createdCount >= totalCount) break;

    // Create a subdirectory
    const dirName = generateRandomName("dir", createdCount);
    const dirPath = path.join(baseDir, dirName);

    fs.mkdirSync(dirPath, {recursive: true});
    createdCount++;
    console.log(`Created directory: ${dirPath}`);

    // Create some files in this directory
    const fileCount = Math.floor(Math.random() * 6) + 5; // 5-10 files
    for (let j = 0; j < fileCount; j++) {
      if (createdCount >= totalCount) break;

      // Generate random file extension
      const extensions = [".txt", ".md", ".js", ".json", ".html", ".css", ".pdf", ".doc", ".jpg", ".png"];
      const extension = extensions[Math.floor(Math.random() * extensions.length)];
      const fileName = generateRandomName("file", createdCount) + extension;
      const filePath = path.join(dirPath, fileName);

      // Generate random content with varying sizes
      const contentSize = Math.floor(Math.random() * 500) + 50; // 50-549 characters
      fs.writeFileSync(filePath, generateRandomText(contentSize));
      createdCount++;
      console.log(`Created file: ${filePath}`);
    }

    // Recursively create subdirectories if we haven't reached max depth
    if (depth < maxDepth) {
      createRandomStructure(dirPath, depth + 1);
    }
  }
}

// Start creating the structure
console.log(`Creating random directory structure with approximately ${totalCount} items...`);
createRandomStructure(BASE_DIR);
console.log(`Done! Created ${createdCount} items.`);
