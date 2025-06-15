# API Documentation

## Overview

The `python2ib` library provides a programmatic interface to convert Python code to IB Pseudocode format. This document describes the available APIs and their usage.

## Installation

```bash
npm install python2ib
```

## Main API

### `convertPythonToIB(code, options?)`

Converts Python code to IB Pseudocode format.

**Parameters:**
- `code` (string): The Python code to convert
- `options` (ConvertOptions, optional): Conversion options

**Returns:** `string` - The converted IB Pseudocode

**Example:**
```typescript
import { convertPythonToIB } from 'python2ib';

const pythonCode = `
def greet(name):
    print(f"Hello, {name}!")
    return f"Greeting for {name}"

greet("Alice")
`;

const ibCode = convertPythonToIB(pythonCode);
console.log(ibCode);
```

## Configuration Options

### `ConvertOptions`

```typescript
interface ConvertOptions {
  indentSize?: number;     // Default: 4
  outputFormat?: 'plain' | 'markdown'; // Default: 'plain'
  preserveComments?: boolean; // Default: true
}
```

**Properties:**
- `indentSize`: Number of spaces for indentation (default: 4)
- `outputFormat`: Output format - 'plain' for plain text, 'markdown' for markdown code blocks
- `preserveComments`: Whether to preserve Python comments as IB comments

## Parser API

### `parseToIR(code)`

Parses Python code to Intermediate Representation (IR).

**Parameters:**
- `code` (string): The Python code to parse

**Returns:** `IRNode[]` - Array of IR nodes

**Example:**
```typescript
import { parseToIR } from 'python2ib/parser';

const ir = parseToIR('x = 5');
console.log(ir);
```

### `emitFromIR(ir, options?)`

Emits IB Pseudocode from IR nodes.

**Parameters:**
- `ir` (IRNode[]): Array of IR nodes
- `options` (ConvertOptions, optional): Emission options

**Returns:** `string` - The emitted IB Pseudocode

## Types

### `IRNode`

```typescript
interface IRNode {
  kind: IRKind;
  text?: string;
  children?: IRNode[];
  meta?: Record<string, any>;
}
```

### `IRKind`

```typescript
type IRKind = 
  | 'assignment'
  | 'output'
  | 'input'
  | 'if'
  | 'while'
  | 'for'
  | 'function'
  | 'procedure'
  | 'comment'
  | 'expression';
```

## Error Handling

The library throws specific error types for different scenarios:

### `PythonSyntaxError`

Thrown when the input Python code has syntax errors.

```typescript
try {
  convertPythonToIB('invalid python code');
} catch (error) {
  if (error instanceof PythonSyntaxError) {
    console.error('Python syntax error:', error.message);
  }
}
```

### `UnsupportedSyntaxError`

Thrown when the Python code contains syntax not supported by the converter.

```typescript
try {
  convertPythonToIB('class MyClass: pass');
} catch (error) {
  if (error instanceof UnsupportedSyntaxError) {
    console.error('Unsupported syntax:', error.message);
  }
}
```

## CLI Integration

The library also provides a CLI tool:

```bash
# Convert a file
python2ib input.py -o output.txt

# Convert with options
python2ib input.py --format markdown --indent 2
```

## Advanced Usage

### Custom Visitors

You can extend the parser with custom visitors:

```typescript
import { BaseVisitor } from 'python2ib/parser/visitor';

class CustomVisitor extends BaseVisitor {
  visitCustomNode(node: any): IRNode {
    // Custom logic here
    return {
      kind: 'custom',
      text: 'custom output'
    };
  }
}
```

### Batch Processing

```typescript
import { convertPythonToIB } from 'python2ib';
import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

const files = glob.sync('**/*.py');

files.forEach(file => {
  const pythonCode = readFileSync(file, 'utf8');
  const ibCode = convertPythonToIB(pythonCode);
  const outputFile = file.replace('.py', '.ib.txt');
  writeFileSync(outputFile, ibCode);
});
```

## Performance Considerations

- The parser uses Python's AST module internally, so large files may take time to process
- Consider using streaming for very large files
- The library is optimized for typical IB Computer Science code sizes

## Limitations

See [limitations.md](./limitations.md) for a complete list of unsupported Python features.