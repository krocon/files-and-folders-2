import * as path from "path";

/**
 * Processes a file URL by iteratively splitting it into base and path components.
 * For each iteration, it returns an object containing the current directory path and the base component.
 * 
 * Example:
 * For the URL "/Users/marckronberg/Pictures/__test/i/index.html"
 * It will process:
 * 1. { url: "/Users/marckronberg/Pictures/__test/i", base: "index.html" }
 * 2. { url: "/Users/marckronberg/Pictures/__test", base: "i" }
 * 3. { url: "/Users/marckronberg/Pictures", base: "__test" }
 * 4. { url: "/Users/marckronberg", base: "Pictures" }
 * 5. { url: "/Users", base: "marckronberg" }
 * 
 * @param fileUrl The complete file URL to process
 * @returns An array of objects, each containing the url and base components
 */
export function processFileUrl(fileUrl: string): Array<{url: string, base: string}> {
  const result: Array<{url: string, base: string}> = [];
  
  // Initialize with the full path
  let currentUrl = fileUrl;
  
  while (currentUrl && currentUrl !== '/' && currentUrl !== '.') {
    // Get the base name (last part of the path)
    const base = path.basename(currentUrl);
    
    // Get the directory name (everything except the last part)
    const dirPath = path.dirname(currentUrl);
    
    // Add to result if we have a valid base
    if (base) {
      result.push({
        url: dirPath,
        base: base
      });
    }
    
    // Move up one level for the next iteration
    currentUrl = dirPath;
  }
  
  return result;
}

/**
 * Demonstrates the use of processFileUrl with a specific example.
 * This function logs the results to the console.
 */
export function demonstrateUrlProcessing(): void {
  const fileUrl = "/Users/marckronberg/Pictures/__test/i/index.html";
  console.log("Processing URL:", fileUrl);
  
  const results = processFileUrl(fileUrl);
  
  results.forEach((item, index) => {
    console.log(`Iteration ${index + 1}:`);
    console.log(`   ${item.url}`);
    console.log(`   ${item.base}`);
    console.log("---");
  });
}