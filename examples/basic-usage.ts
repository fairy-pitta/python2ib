/**
 * Basic usage examples for Python to IB Pseudocode converter
 */

import { PythonToIBConverter, convertPythonToIBSync, quickConvert } from '../src/index.js';

// Example 1: Simple variable assignments and arithmetic
const example1 = `
# Simple calculations
x = 10
y = 20
result = x + y
print("The sum is:", result)
`;

console.log('=== Example 1: Basic Arithmetic ===');
console.log('Python code:');
console.log(example1);
console.log('IB Pseudocode:');
console.log(quickConvert(example1));

// Example 2: Control structures
const example2 = `
# Control structures
age = int(input("Enter your age: "))

if age >= 18:
    print("You are an adult")
else:
    print("You are a minor")

# Count from 1 to 5
for i in range(1, 6):
    print("Count:", i)
`;

console.log('=== Example 2: Control Structures ===');
console.log('Python code:');
console.log(example2);
console.log('IB Pseudocode:');
console.log(quickConvert(example2));

// Example 3: Functions
const example3 = `
# Function definitions
def greet(name):
    print("Hello,", name)

def calculate_area(length, width):
    area = length * width
    return area

# Function calls
greet("Alice")
rectangle_area = calculate_area(5, 3)
print("Area:", rectangle_area)
`;

console.log('=== Example 3: Functions ===');
console.log('Python code:');
console.log(example3);
console.log('IB Pseudocode:');
console.log(quickConvert(example3));

// Example 4: While loop
const example4 = `
# While loop example
count = 0
while count < 5:
    print("Count is:", count)
    count = count + 1

print("Loop finished")
`;

console.log('=== Example 4: While Loop ===');
console.log('Python code:');
console.log(example4);
console.log('IB Pseudocode:');
console.log(quickConvert(example4));

// Example 5: Using converter with custom configuration
const example5 = `
# Custom configuration example
if x > 0:
    if y > 0:
        print("Both positive")
    else:
        print("X positive, Y not positive")
else:
    print("X not positive")
`;

console.log('=== Example 5: Custom Configuration (Tabs, Size 2) ===');
console.log('Python code:');
console.log(example5);

const converter = new PythonToIBConverter({
  indentStyle: 'tabs',
  indentSize: 2,
  strictMode: false
});

console.log('IB Pseudocode:');
console.log(converter.convertSync(example5));

// Example 6: Error handling
const invalidPython = `
if x > 0
    print("Missing colon")
`;

console.log('=== Example 6: Error Handling ===');
console.log('Invalid Python code:');
console.log(invalidPython);

try {
  const result = quickConvert(invalidPython);
  console.log('Converted (should not reach here):', result);
} catch (error) {
  console.log('Error caught:', error instanceof Error ? error.message : String(error));
}

// Example 7: Syntax validation
const validCode = 'x = 5\nprint(x)';
const invalidCode = 'if x > 0\n    print(x)';

console.log('=== Example 7: Syntax Validation ===');
const validator = new PythonToIBConverter();

const validResult = validator.validateSyntax(validCode);
const invalidResult = validator.validateSyntax(invalidCode);

console.log('Valid code check:', validResult);
console.log('Invalid code check:', invalidResult);

// Example 8: Supported constructs info
console.log('=== Example 8: Supported Constructs ===');
const supported = validator.getSupportedConstructs();
const unsupported = validator.getUnsupportedConstructs();

console.log('Supported constructs:', supported);
console.log('Unsupported constructs:', unsupported);