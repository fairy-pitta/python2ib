import fs from 'fs';
import { ASTParser } from './dist/parser/ast-parser.js';

// Test tuple assignment AST structure
const tupleCode = 'arr[j], arr[j + 1] = arr[j + 1], arr[j]';

console.log('=== Parsing Tuple Assignment ===');
console.log('Code:', tupleCode);

try {
  const parser = new ASTParser();
  const ast = parser.parseSync(tupleCode);
  console.log('\nAST Structure:');
  console.log(JSON.stringify(ast, null, 2));
  
  console.log('\nAST type:', ast.type);
  console.log('AST body length:', ast.body ? ast.body.length : 'no body');
  
  if (ast.body && ast.body.length > 0) {
    const firstNode = ast.body[0];
    console.log('\nFirst node type:', firstNode.type);
    
    if (firstNode.type === 'Assign') {
      console.log('Assignment targets:', firstNode.targets.length);
      if (firstNode.targets.length > 0) {
        console.log('Target type:', firstNode.targets[0].type);
        if (firstNode.targets[0].type === 'Tuple') {
          console.log('Tuple elements:', firstNode.targets[0].elts.length);
          firstNode.targets[0].elts.forEach((elt, i) => {
            console.log(`  Element ${i}:`, elt.type, elt);
          });
        }
      }
      console.log('Value type:', firstNode.value.type);
      if (firstNode.value.type === 'Tuple') {
        console.log('Value tuple elements:', firstNode.value.elts.length);
        firstNode.value.elts.forEach((elt, i) => {
          console.log(`  Value element ${i}:`, elt.type, elt);
        });
      }
    }
  }
  
} catch (error) {
  console.log('\nParsing error:', error.message);
  console.log('Stack:', error.stack);
}