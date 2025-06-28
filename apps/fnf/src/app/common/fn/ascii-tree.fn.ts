/**
 * Converts an array of directory paths into an ASCII tree representation
 * @param rows Array of strings containing directory paths
 * @returns Array of objects with path and label properties
 */
export function createAsciiTree(rows: string[]): {path: string, label: string}[] {
  if (!rows || rows.length === 0) {
    return [];
  }

  // Create a tree structure from the directory paths
  const tree: TreeNode = { name: '', children: {}, isLeaf: false };

  // Sort the rows to ensure consistent output
  const sortedRows = [...rows].sort((a, b) => a.localeCompare(b));

  // Build the tree structure
  for (const row of sortedRows) {
    const path = row;
    const parts = path.split('/').filter(part => part.length > 0);

    let currentNode = tree;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!currentNode.children[part]) {
        currentNode.children[part] = {
          name: part,
          children: {},
          isLeaf: false // Initialize as non-leaf
        };
      }
      currentNode = currentNode.children[part];
    }
  }

  // Mark leaf nodes (directories that don't have children)
  markLeafNodes(tree);

  // Convert the tree to ASCII representation
  const asciiLines: string[] = [];
  renderTree(tree, '', '', asciiLines);

  // Remove the root node (empty string) if it exists
  if (asciiLines.length > 0 && asciiLines[0].trim() === '') {
    asciiLines.shift();
  }

  // Map the ASCII lines to objects with path and label properties
  return asciiLines.map((label, index) => {
    // Use the original path if available, otherwise use an empty string
    const path = index < sortedRows.length ? sortedRows[index] : '';
    return { path, label };
  });
}

/**
 * Marks nodes as leaf nodes if they don't have any children
 */
function markLeafNodes(node: TreeNode): boolean {
  const childrenKeys = Object.keys(node.children);

  if (childrenKeys.length === 0) {
    node.isLeaf = true;
    return true;
  }

  let allChildrenAreLeaves = true;
  for (const key of childrenKeys) {
    const childIsLeaf = markLeafNodes(node.children[key]);
    allChildrenAreLeaves = allChildrenAreLeaves && childIsLeaf;
  }

  // A node is not a leaf if it has at least one child that is not a leaf
  node.isLeaf = false;
  return false;
}

/**
 * Recursively renders a tree node and its children as ASCII art
 */
function renderTree(node: TreeNode, prefix: string, childPrefix: string, result: string[]): void {
  // Skip the root node
  if (node.name !== '') {
    // Display the node with its prefix
    result.push(`${prefix}${node.name}`);
  }

  const childrenKeys = Object.keys(node.children);

  // Sort the children keys to ensure consistent output
  const sortedKeys = childrenKeys.sort();

  sortedKeys.forEach((key, index) => {
    const isLast = index === sortedKeys.length - 1;
    const child = node.children[key];

    // Determine the prefixes for the current node and its children
    const currentPrefix = isLast ? '└── ' : '├── ';
    const nextChildPrefix = isLast ? '    ' : '│   ';

    renderTree(
      child,
      childPrefix + currentPrefix,
      childPrefix + nextChildPrefix,
      result
    );
  });
}

/**
 * Interface for tree node structure
 */
interface TreeNode {
  name: string;
  children: { [key: string]: TreeNode };
  isLeaf: boolean;
}
