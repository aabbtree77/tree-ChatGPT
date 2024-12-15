// Define a recursive Tree type
// Leaf: represents a tree with no children.
// Node: represents a tree with a value and multiple children.
type Tree<T> = 
  | { type: 'Leaf' } 
  | { type: 'Node'; value: T; children: Tree<T>[] };

// Create a Leaf factory function
const Leaf = <T>(): Tree<T> => ({ type: 'Leaf' });

// Create a Node factory function
const Node = <T>(value: T, children: Tree<T>[]): Tree<T> => ({
  type: 'Node',
  value,
  children,
});

// CRUD operations

// Create a new tree with a single value
const createTree = <T>(value: T): Tree<T> => Node(value, []);

// Read a value in the tree by traversing (returns null if not found)
const findValue = <T>(tree: Tree<T>, value: T): T | null => {
  switch (tree.type) {
    case 'Leaf':
      return null;
    case 'Node':
      if (tree.value === value) return tree.value;
      for (const child of tree.children) {
        const result = findValue(child, value);
        if (result !== null) return result;
      }
      return null;
    default:
      // Exhaustiveness check
      const _exhaustive: never = tree;
      throw new Error(`Unhandled tree node type: ${_exhaustive}`);
  }
};

// Insert a value into the tree (returns a new tree, preserving immutability)
const insertValue = <T>(tree: Tree<T>, value: T): Tree<T> => {
  switch (tree.type) {
    case 'Leaf':
      return Node(value, []);
    case 'Node':
      return Node(tree.value, [...tree.children, Node(value, [])]);
    default:
      const _exhaustive: never = tree;
      throw new Error(`Unhandled tree node type: ${_exhaustive}`);
  }
};

// Delete a value from the tree (returns a new tree, preserving immutability)
const deleteValue = <T>(tree: Tree<T>, value: T): Tree<T> => {
  switch (tree.type) {
    case 'Leaf':
      return tree; // Cannot delete from a leaf
    case 'Node':
      if (tree.value === value) {
        // Replace node with its children
        return tree.children.length > 0 ? tree.children[0] : Leaf();
      }
      return Node(tree.value, tree.children.map(child => deleteValue(child, value)));
    default:
      const _exhaustive: never = tree;
      throw new Error(`Unhandled tree node type: ${_exhaustive}`);
  }
};

// Depth-First Search (DFS) traversal
const dfs = <T>(tree: Tree<T>, visit: (value: T) => void): void => {
  switch (tree.type) {
    case 'Leaf':
      return;
    case 'Node':
      visit(tree.value);
      for (const child of tree.children) {
        dfs(child, visit);
      }
      break;
    default:
      const _exhaustive: never = tree;
      throw new Error(`Unhandled tree node type: ${_exhaustive}`);
  }
};

// Breadth-First Search (BFS) traversal
const bfs = <T>(tree: Tree<T>, visit: (value: T) => void): void => {
  const queue: Tree<T>[] = [tree];
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current.type === 'Node') {
      visit(current.value);
      queue.push(...current.children);
    }
  }
};

// Visualize tree with UTF-8 line symbols
const visualizeTree = <T>(tree: Tree<T>): string => {
  const lines: string[] = [];

  const buildLines = (tree: Tree<T>, prefix: string, isTail: boolean): void => {
    switch (tree.type) {
      case 'Leaf':
        lines.push(`${prefix}${isTail ? '└── ' : '├── '}(Leaf)`);
        break;
      case 'Node':
        lines.push(`${prefix}${isTail ? '└── ' : '├── '}${tree.value}`);
        const childPrefix = `${prefix}${isTail ? '    ' : '│   '}`;
        tree.children.forEach((child, index) =>
          buildLines(child, childPrefix, index === tree.children.length - 1)
        );
        break;
      default:
        const _exhaustive: never = tree;
        throw new Error(`Unhandled tree node type: ${_exhaustive}`);
    }
  };

  buildLines(tree, '', true);
  return lines.join('\n');
};

// Generate a random tree
const randomTree = <T>(
  depth: number,
  maxChildren: number,
  createValue: () => T
): Tree<T> => {
  if (depth === 0) return Leaf();
  const numChildren = Math.floor(Math.random() * (maxChildren + 1));
  return Node(createValue(), Array.from({ length: numChildren }, () => randomTree(depth - 1, maxChildren, createValue)));
};

// Demo: Perform random CRUD operations and time them
const demo = (): void => {
  console.time('Random CRUD operations');

  // Create a random tree
  const tree = randomTree(5, 3, () => Math.floor(Math.random() * 100));

  console.log('Initial Tree:');
  console.log(visualizeTree(tree));

  let currentTree = tree;
  for (let i = 0; i < 100; i++) {
    const operation = Math.random();
    const value = Math.floor(Math.random() * 100);

    if (operation < 0.33) {
      // Insert
      currentTree = insertValue(currentTree, value);
    } else if (operation < 0.66) {
      // Delete
      currentTree = deleteValue(currentTree, value);
    } else {
      // Find
      findValue(currentTree, value);
    }
  }

  console.log('Final Tree:');
  console.log(visualizeTree(currentTree));

  console.timeEnd('Random CRUD operations');
};

demo();

