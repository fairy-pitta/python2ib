import { convertPythonToIB } from './dist/converter.js';
import { ASTParser } from './dist/parser/ast-parser.js';

// Test expression extraction
const expressions = [
  'n',
  'n - 1',
  'n - i - 1',
  '5',
  '0'
];

console.log('=== Expression Extraction Debug ===');

expressions.forEach((expr, index) => {
  console.log(`\n--- Expression ${index + 1}: ${expr} ---`);
  
  try {
    // Parse as assignment to see how expression is extracted
    const testCode = `x = ${expr}`;
    console.log('Test code:', testCode);
    
    const parser = new ASTParser();
    const ast = parser.parseSync(testCode);
    
    if (ast.body && ast.body.length > 0) {
      const assignNode = ast.body[0];
      if (assignNode.type === 'Assign') {
        console.log('Value AST:', JSON.stringify(assignNode.value, null, 2));
      }
    }
    
    // Test conversion
    const result = convertPythonToIB(testCode);
    console.log('Converted:', result);
    
    // Extract the assigned value
    const valueMatch = result.match(/X = (.+)/);
    if (valueMatch) {
      console.log('Extracted value:', valueMatch[1]);
    }
    
  } catch (error) {
    console.log('Error:', error.message);
  }
});

// Test range conversion specifically
console.log('\n=== Range Conversion Test ===');
const rangeTest = 'for j in range(0, n - i - 1): pass';
console.log('Range test:', rangeTest);

try {
  const result = convertPythonToIB(rangeTest);
  console.log('Result:', result);
} catch (error) {
  console.log('Error:', error.message);
}