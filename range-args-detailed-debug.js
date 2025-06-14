import { ASTParser } from './dist/parser/ast-parser.js';
import { PythonToIRVisitor } from './dist/parser/visitor/python-to-ir-visitor.js';
import { SPECIAL_CONSTRUCTS } from './dist/utils/keywords.js';

// Test range argument extraction
function testRangeArgs() {
  console.log('=== Testing range argument extraction ===');
  
  const testCases = [
    'for i in range(5): pass',
    'for i in range(0, 5): pass',
    'for i in range(0, n): pass',
    'for i in range(0, n - 1): pass'
  ];
  
  testCases.forEach(testCase => {
    try {
      console.log(`\nInput: ${testCase}`);
      
      // Parse AST
      const parser = new ASTParser();
      const ast = parser.parse(testCase);
      
      // Get the for statement
      const forStmt = ast.body[0];
      console.log('For statement iter:', JSON.stringify(forStmt.iter, null, 2));
      
      // Extract arguments
      const visitor = new PythonToIRVisitor();
      const rangeArgs = forStmt.iter.args.map(arg => visitor.extractExpression(arg));
      console.log('Extracted range args:', rangeArgs);
      
      // Convert range
      const range = SPECIAL_CONSTRUCTS.convertRange(rangeArgs);
      console.log('Converted range:', range);
      
    } catch (error) {
      console.log(`Error: ${error.message}`);
      console.log(error.stack);
    }
  });
}

testRangeArgs();