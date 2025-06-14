import { convertPythonToIB } from './dist/index.js';
import { ASTParser } from './dist/parser/ast-parser.js';
import { PythonToIRVisitor } from './dist/parser/visitor/python-to-ir-visitor.js';
import { SPECIAL_CONSTRUCTS } from './dist/utils/keywords.js';

// Test range argument extraction in FOR loops
function testRangeExtraction() {
  console.log('=== Testing Range Extraction in FOR loops ===');
  
  const testCases = [
    'for i in range(5): pass',
    'for i in range(0, 5): pass',
    'for i in range(1, 6): pass'
  ];
  
  testCases.forEach(testCase => {
    try {
      console.log(`\n--- Testing: ${testCase} ---`);
      
      // Parse AST
      const parser = new ASTParser();
      const ast = parser.parseSync(testCase);
      
      // Get the for statement
      const forStmt = ast.body[0];
      console.log('Range call args:', JSON.stringify(forStmt.iter.args, null, 2));
      
      // Extract arguments using visitor
      const config = {
        indentSize: 4,
        outputFormat: 'plain',
        variableMapping: {}
      };
      const visitor = new PythonToIRVisitor(config);
      
      const rangeArgs = forStmt.iter.args.map(arg => {
        const extracted = visitor.extractExpression(arg);
        console.log(`Arg ${JSON.stringify(arg)} -> "${extracted}"`);
        return extracted;
      });
      
      console.log('Final range args:', rangeArgs);
      
      // Convert range
      const range = SPECIAL_CONSTRUCTS.convertRange(rangeArgs);
      console.log('Converted range:', range);
      
      // Full conversion for comparison
      const fullResult = convertPythonToIB(testCase);
      const forLine = fullResult.split('\n').find(line => line.includes('loop'));
      console.log('Full conversion result:', forLine);
      
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  });
}

testRangeExtraction();