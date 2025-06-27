import * as path from "path";

export interface DirBaseIf{dir: string ; base: string ;}


/**
 * Processes a file URL by iteratively splitting it into base and path components.
 * For each iteration, it returns an object containing the current directory path and the base component.
 * 
 * Example:
 * For the URL "/Users/marckronberg/Pictures/__test/i/index.html"
 * It will process:
 * 1. { dir: "/Users/marckronberg/Pictures/__test/i", base: "index.html" }
 * 2. { dir: "/Users/marckronberg/Pictures/__test", base: "i" }
 * 3. { dir: "/Users/marckronberg/Pictures", base: "__test" }
 * 4. { dir: "/Users/marckronberg", base: "Pictures" }
 * 5. { dir: "/Users", base: "marckronberg" }
 * 
 * @param fileUrl The complete file URL to process
 * @returns An array of objects, each containing the url and base components
 */
export function processFileUrl(fileUrl: string): Array<DirBaseIf> {
  const result: Array<DirBaseIf> = [];
  
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
        dir: dirPath,
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
    console.log(`   ${item.dir}`);
    console.log(`   ${item.base}`);
    console.log("---");
  });
}