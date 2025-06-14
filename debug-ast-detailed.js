import { ASTParser } from './dist/parser/ast-parser.js';

const python = `for num in numbers:
    print(num)`;

console.log('=== Python Input ===');
console.log(python);
console.log();

try {
    const parser = new ASTParser();
    const ast = parser.parseSync(python);
    console.log('=== AST ===');
    console.log(JSON.stringify(ast, null, 2));
    
    if (ast && ast.body && ast.body.length > 0) {
        console.log('\n=== First Statement ===');
        console.log(JSON.stringify(ast.body[0], null, 2));
        
        if (ast.body[0].type === 'For') {
            console.log('\n=== For Loop Details ===');
            console.log('Target:', JSON.stringify(ast.body[0].target, null, 2));
            console.log('Iter:', JSON.stringify(ast.body[0].iter, null, 2));
            console.log('Body:', JSON.stringify(ast.body[0].body, null, 2));
        }
    }
} catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
}