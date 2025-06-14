import { ASTParser } from './dist/parser/ast-parser.js';

// Test range argument parsing
const testCode = 'for j in range(0, n - i - 1): pass';

console.log('=== Range Argument Parsing Debug ===');
console.log('Code:', testCode);

try {
  const parser = new ASTParser();
  const ast = parser.parseSync(testCode);
  
  console.log('\nAST Structure:');
  console.log(JSON.stringify(ast, null, 2));
  
  if (ast.body && ast.body.length > 0) {
    const forNode = ast.body[0];
    console.log('\nFor node type:', forNode.type);
    
    if (forNode.type === 'For' && forNode.iter) {
      console.log('Iterator type:', forNode.iter.type);
      
      if (forNode.iter.type === 'Call') {
        console.log('Function name:', forNode.iter.func.id);
        console.log('Arguments count:', forNode.iter.args.length);
        
        forNode.iter.args.forEach((arg, i) => {
          console.log(`\nArgument ${i}:`);
          console.log('  Type:', arg.type);
          console.log('  Structure:', JSON.stringify(arg, null, 2));
        });
      }
    }
  }
  
} catch (error) {
  console.log('\nParsing error:', error.message);
  console.log('Stack:', error.stack);
}