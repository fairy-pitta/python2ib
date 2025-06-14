import { ASTParser } from './dist/parser/ast-parser.js';
import { PythonToIRVisitor } from './dist/parser/visitor/python-to-ir-visitor.js';

// Test FOR loop parsing
const python = `for num in numbers:
    print(num)`;

console.log('=== Python Input ===');
console.log(python);

try {
    const parser = new ASTParser();
    const ast = parser.parseSync(python);
    console.log('\n=== AST ===');
    console.log(JSON.stringify(ast, null, 2));
    
    if (ast && ast.body && ast.body.length > 0) {
        console.log('\n=== First Statement Type ===');
        console.log(ast.body[0].type);
        
        const visitor = new PythonToIRVisitor();
        const ir = visitor.visit(ast.body[0]);
        console.log('\n=== IR ===');
        console.log(JSON.stringify(ir, null, 2));
    } else {
        console.log('\n=== No statements found in AST ===');
    }
} catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
}