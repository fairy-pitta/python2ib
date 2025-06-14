import { PythonToIRVisitor } from './dist/parser/visitor/python-to-ir-visitor.js';
import { ASTParser } from './dist/parser/ast-parser.js';

// Test extractExpression with simple numbers
function testExtractExpression() {
  console.log('=== Testing extractExpression ===');
  
  const testCases = [
    '5',
    '0',
    '1',
    '6',
    'n',
    'n - 1'
  ];
  
  testCases.forEach(testCase => {
    try {
      console.log(`\nTesting: ${testCase}`);
      
      // Create a simple expression to parse
      const code = `x = ${testCase}`;
      console.log(`Full code: ${code}`);
      
      const parser = new ASTParser();
      const ast = parser.parseSync(code);
      
      // Get the assignment value
      const assignStmt = ast.body[0];
      console.log('Assignment value node:', JSON.stringify(assignStmt.value, null, 2));
      
      const config = {
        indentSize: 4,
        outputFormat: 'plain',
        variableMapping: {}
      };
      const visitor = new PythonToIRVisitor(config);
      const extracted = visitor.extractExpression(assignStmt.value);
      console.log(`Extracted: "${extracted}"`);
      
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  });
}

testExtractExpression();