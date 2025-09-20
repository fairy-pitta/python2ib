# Python to IB Pseudocode Converter

[![npm version](https://badge.fury.io/js/python2ib.svg)](https://badge.fury.io/js/python2ib)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js CI](https://github.com/fairy-pitta/python2ib/actions/workflows/ci.yml/badge.svg)](https://github.com/fairy-pitta/python2ib/actions)

A TypeScript library and CLI tool that converts Python code to IB (International Baccalaureate) Pseudocode format.

## Features

- **Python to IB Pseudocode conversion** with basic syntax support
- **CLI tool** for command-line usage
- **TypeScript API** for programmatic use
- **Basic error handling** and syntax validation
- **Test coverage** for core functionality

## Supported Python Constructs

### Currently Supported
- Variable assignments (`x = 5` → `X = 5`)
- Basic arithmetic operations (`+`, `-`, `*`, `/`, `//`, `%`)
- Comparison operations (`==`, `!=`, `<`, `>`, `<=`, `>=`)
- Logical operations (`and`, `or`, `not`)
- Output statements (`print()` → `output`)
- If/else statements (`if`/`else` → `if`/`else`/`end if`)
- While loops (`while` → `loop while`/`end loop`)
- For loops with range (`for i in range()` → `loop from`/`end loop`)
- Function definitions (`def` → `function`/`procedure`)
- Comments (`#` → `//`)
- Compound assignment operators (`+=`, `-=`, `*=`)
- Array/list indexing and assignment

### Not Supported
- Classes and objects
- List comprehensions
- Lambda functions
- Exception handling (try/except)
- Import statements
- Advanced data structures (dictionaries, sets)
- Decorators
- Context managers (with statements)
- Built-in functions beyond basic conversion

## Error Handling

The library provides detailed error messages for unsupported syntax:

```typescript
import { convertPythonToIB, UnsupportedSyntaxError, PythonSyntaxError } from 'python2ib';

try {
  const result = convertPythonToIB(pythonCode);
  console.log(result);
} catch (error) {
  if (error instanceof UnsupportedSyntaxError) {
    console.error('Unsupported syntax:', error.message);
    console.log('Suggestion:', error.suggestion);
  } else if (error instanceof PythonSyntaxError) {
    console.error('Python syntax error:', error.message);
  }
}
```

## Limitations

Currently, the following Python features are **not supported**:

- Classes and object-oriented programming
- Exception handling (try/except)
- Decorators
- Lambda functions
- List comprehensions
- Import statements
- Async/await
- Context managers (with statements)

For a complete list of limitations and workarounds, see [docs/limitations.md](docs/limitations.md).

## Troubleshooting

For common issues and solutions, see [docs/troubleshooting.md](docs/troubleshooting.md).

Quick fixes:
- **Syntax errors**: Validate your Python code first
- **Unsupported features**: Check the limitations list
- **Performance issues**: Process large files in smaller chunks

## Installation

### Global Installation (for CLI usage)
```bash
npm install -g python2ib
```

### Local Installation (for programmatic usage)
```bash
npm install python2ib
```

### Browser Usage

For browser environments, use the pre-built bundle:

```html
<!-- Include the library -->
<script src="https://unpkg.com/python2ib/dist/python2ib.min.js"></script>

<script>
  // Use the global PythonToIB object
  const converter = new PythonToIB.PythonToIBConverter();
  const result = converter.convertSync('print("Hello, World!")');
  console.log(result); // OUTPUT "Hello, World!"
</script>
```

Or with ES modules:

```html
<script type="module">
  import { convertPythonToIBSync } from 'https://unpkg.com/python2ib/dist/python2ib.min.js';
  
  const result = convertPythonToIBSync('x = 5\nprint(x)');
  console.log(result);
</script>
```

**Browser Compatibility:**
- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

### Requirements

- Node.js 16.0.0 or higher
- npm 7.0.0 or higher

## Quick Start

### CLI Usage

```bash
# Convert a Python file
python2ib script.py

# Convert with output file
python2ib -i script.py -o pseudocode.txt

# Validate Python syntax
python2ib --validate script.py

# Show supported constructs
python2ib --info

# Custom indentation
python2ib --indent tabs --indent-size 2 script.py
```

### Programmatic Usage

```typescript
import { convertPythonToIBSync, PythonToIBConverter } from 'python2ib';

// Quick conversion
const pythonCode = `
x = 10
y = 20
result = x + y
print("Sum:", result)
`;

const pseudocode = convertPythonToIBSync(pythonCode);
console.log(pseudocode);
// Output:
// x ← 10
// y ← 20
// result ← x + y
// OUTPUT "Sum:" + " " + result

// Advanced usage with configuration
const converter = new PythonToIBConverter({
  indentStyle: 'spaces',
  indentSize: 4,
  strictMode: false
});

const result = converter.convertSync(pythonCode);
```

## Examples

### Basic Operations

**Python:**
```python
# Variable assignment
name = "Alice"
age = 25

# Arithmetic
result = age * 2

# Output
print("Name:", name)
print("Double age:", result)
```

**IB Pseudocode:**
```
// Variable assignment
name ← "Alice"
age ← 25

// Arithmetic
result ← age * 2

// Output
OUTPUT "Name:" + " " + name
OUTPUT "Double age:" + " " + result
```

### Control Structures

**Python:**
```python
age = int(input("Enter age: "))

if age >= 18:
    print("Adult")
else:
    print("Minor")

for i in range(1, 6):
    print("Count:", i)
```

**IB Pseudocode:**
```
OUTPUT "Enter age: "
age ← INTEGER(INPUT)

IF age ≥ 18 THEN
    OUTPUT "Adult"
ELSE
    OUTPUT "Minor"
ENDIF

FOR i ← 1 TO 5 STEP 1
    OUTPUT "Count:" + " " + i
NEXT i
```

### Functions

**Python:**
```python
def greet(name):
    print("Hello,", name)

def calculate_area(length, width):
    return length * width

greet("Bob")
area = calculate_area(5, 3)
print("Area:", area)
```

**IB Pseudocode:**
```
PROCEDURE greet(name)
    OUTPUT "Hello," + " " + name
ENDPROCEDURE

FUNCTION calculate_area(length, width) RETURNS UNKNOWN
    RETURN length * width
ENDFUNCTION

greet("Bob")
area ← calculate_area(5, 3)
OUTPUT "Area:" + " " + area
```

## Configuration

### Programmatic Configuration

You can customize the conversion behavior:

```typescript
import { convertPythonToIB } from 'python2ib';

const options = {
  indentSize: 2,        // Use 2 spaces for indentation
  outputFormat: 'markdown', // Output as markdown code block
  preserveComments: true,   // Keep Python comments as IB comments
  strictMode: false,        // Allow partial conversion on errors
  customKeywords: {         // Custom keyword mappings
    'print': 'DISPLAY',
    'input': 'GET'
  }
};

const result = convertPythonToIB(pythonCode, options);
```

### Configuration Files

Create a `.python2ibrc` file in your project root:

```json
{
  "indentSize": 4,
  "outputFormat": "plain",
  "preserveComments": true,
  "customKeywords": {
    "print": "OUTPUT",
    "input": "INPUT"
  },
  "outputOptions": {
    "includeLineNumbers": false,
    "includeComments": true
  }
}
```

Generate a sample config file:

```bash
python2ib --init-config
```

## API Reference

### Main Classes

#### `PythonToIBConverter`

Main converter class with full configuration options.

```typescript
const converter = new PythonToIBConverter({
  indentStyle: 'spaces' | 'tabs',
  indentSize: number,
  strictMode: boolean,
  preserveComments: boolean,
  variableNaming: 'preserve' | 'camelCase' | 'snake_case',
  functionNaming: 'preserve' | 'camelCase' | 'snake_case'
});

// Convert code
const result = converter.convertSync(pythonCode);

// Validate syntax
const validation = converter.validateSyntax(pythonCode);

// Get supported constructs
const supported = converter.getSupportedConstructs();
```

### Convenience Functions

```typescript
// Quick conversion
convertPythonToIBSync(code: string, options?: Partial<ConvertOptions>): string

// Async conversion
convertPythonToIB(code: string, options?: Partial<ConvertOptions>): Promise<string>

// Syntax validation
validatePythonSyntax(code: string): { isValid: boolean; errors: string[] }

// Get construct information
getConstructInfo(): { supported: string[]; unsupported: string[] }
```

## Configuration Options

```typescript
interface ConvertOptions {
  outputFormat: 'ib-pseudocode';           // Output format
  indentStyle: 'spaces' | 'tabs';          // Indentation style
  indentSize: number;                      // Indentation size (1-8)
  normalizeIndentation: boolean;           // Normalize indentation
  preserveComments: boolean;               // Preserve comments
  strictMode: boolean;                     // Strict conversion mode
  variableNaming: 'preserve' | 'camelCase' | 'snake_case';
  functionNaming: 'preserve' | 'camelCase' | 'snake_case';
}
```

## CLI Options

```bash
Options:
  -h, --help              Show help message
  -v, --version           Show version information
  -i, --input <file>      Input Python file
  -o, --output <file>     Output file (default: stdout)
  -c, --config <file>     Configuration file (JSON)
  --validate              Validate Python syntax only
  --info                  Show supported/unsupported constructs
  --indent <type>         Indentation type: 'spaces' or 'tabs'
  --indent-size <size>    Indentation size: 1-8
  --strict                Enable strict mode
  -q, --quiet             Suppress non-error output
  --verbose               Enable verbose output
```

## Development

### Setup

```bash
# Clone repository
git clone https://github.com/fairy-pitta/python2ib.git
cd python2ib

# Install dependencies
npm install

# Build project
npm run build

# Run tests
npm test

# Run examples
npm run example
```

### Project Structure

```
src/
├── types/           # Type definitions
│   ├── ir.ts       # Intermediate Representation
│   └── config.ts   # Configuration types
├── parser/         # Python parsing
│   ├── index.ts    # Main parser
│   ├── ast-parser.ts
│   └── visitor/    # AST visitor pattern
├── emitter/        # IB Pseudocode generation
│   └── index.ts
├── utils/          # Utility functions
│   ├── indent.ts
│   ├── operators.ts
│   └── keywords.ts
├── __tests__/      # Test files
├── index.ts        # Main API
└── cli.ts          # CLI tool
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Changelog

### v1.0.0
- Initial release
- Support for basic Python constructs
- CLI tool
- TypeScript API
- Comprehensive test suite

## Support

For issues, questions, or contributions, please visit the [GitHub repository](https://github.com/fairy-pitta/python2ib).