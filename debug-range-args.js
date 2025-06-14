import { ASTParser } from './dist/parser/ast-parser.js';
import { PythonToIRVisitor } from './dist/parser/visitor/python-to-ir-visitor.js';

const python = `for i in range(3):
    print(i)`;

console.log('=== Python Input ===');
console.log(python);
console.log();

try {
    const parser = new ASTParser();
    const ast = parser.parseSync(python);
    
    if (ast && ast.body && ast.body.length > 0) {
        const forNode = ast.body[0];
        console.log('=== For Node ===');
        console.log('Type:', forNode.type);
        console.log('Target:', JSON.stringify(forNode.target, null, 2));
        console.log('Iter:', JSON.stringify(forNode.iter, null, 2));
        
        if (forNode.iter && forNode.iter.type === 'Call') {
            console.log('\n=== Range Call Details ===');
            console.log('Function:', JSON.stringify(forNode.iter.func, null, 2));
            console.log('Args:', JSON.stringify(forNode.iter.args, null, 2));
            
            // Test visitor's extractExpression on args
            const visitor = new PythonToIRVisitor();
            console.log('\n=== Extracted Args ===');
            forNode.iter.args.forEach((arg, index) => {
                try {
                    const extracted = visitor.extractExpression(arg);
                    console.log(`Arg ${index}:`, extracted);
                } catch (error) {
                    console.log(`Arg ${index} error:`, error.message);
                }
            });
        }
    }
} catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
}