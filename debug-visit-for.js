import { ASTParser } from './dist/parser/ast-parser.js';
import { PythonToIRVisitor } from './dist/parser/visitor/python-to-ir-visitor.js';
import { VisitorUtils } from './dist/parser/visitor/base-visitor.js';
import { IRFactory } from './dist/types/ir.js';
import { SPECIAL_CONSTRUCTS } from './dist/utils/keywords.js';

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
        
        // Create config with default values
        const config = {
            indentSize: 4,
            outputFormat: 'plain',
            variableMapping: {},
            functionMapping: {}
        };
        const visitor = new PythonToIRVisitor(config);
        
        // Test individual steps
        console.log('\n=== Step 1: Extract target ===');
        const target = visitor.extractExpression(forNode.target);
        console.log('Target:', target);
        
        console.log('\n=== Step 2: Map target ===');
        const mappedTarget = visitor.mapVariableName(target);
        console.log('Mapped Target:', mappedTarget);
        
        console.log('\n=== Step 3: Check range call ===');
        const isRange = VisitorUtils.isRangeCall(forNode.iter);
        console.log('Is Range Call:', isRange);
        
        if (forNode.iter && forNode.iter.type === 'Call') {
            console.log('\n=== Step 4: Extract range args ===');
            const rangeArgs = forNode.iter.args.map(arg => visitor.extractExpression(arg));
            console.log('Range Args:', rangeArgs);
            
            console.log('\n=== Step 5: Convert range ===');
            const range = SPECIAL_CONSTRUCTS.convertRange(rangeArgs);
            console.log('Range:', range);
            
            console.log('\n=== Step 6: Create FOR IR ===');
            const forIR = IRFactory.for(mappedTarget, range.start, range.end, range.step, forNode.lineno);
            console.log('FOR IR:', JSON.stringify(forIR, null, 2));
            
            console.log('\n=== Step 7: Create NEXT IR ===');
            const nextIR = IRFactory.next(mappedTarget, forNode.lineno);
            console.log('NEXT IR:', JSON.stringify(nextIR, null, 2));
        }
    }
} catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
}