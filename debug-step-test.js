import { convertPythonToIB } from './dist/index.js';

console.log('=== Testing for range loop with step ===');

const python = `for i in range(0, 10, 2):
    print(i)`;
const expected = `loop I from 0 to 9 step 2
    output I
end loop`;

console.log('Python input:');
console.log(JSON.stringify(python));
console.log();

console.log('Expected output:');
console.log(JSON.stringify(expected));
console.log();

try {
    const result = convertPythonToIB(python);
    console.log('Actual output:');
    console.log(JSON.stringify(result));
    console.log();
    
    console.log('Match:', result === expected);
    
    if (result !== expected) {
        console.log('\n=== Detailed comparison ===');
        console.log('Actual (visible):');
        console.log(result);
        console.log('\nExpected (visible):');
        console.log(expected);
        
        console.log('\nCharacter-by-character comparison:');
        const minLength = Math.min(result.length, expected.length);
        for (let i = 0; i < minLength; i++) {
            if (result[i] !== expected[i]) {
                console.log(`Difference at position ${i}:`);
                console.log(`  Actual: '${result[i]}' (code: ${result.charCodeAt(i)})`);
                console.log(`  Expected: '${expected[i]}' (code: ${expected.charCodeAt(i)})`);
                break;
            }
        }
        
        if (result.length !== expected.length) {
            console.log(`Length difference: actual ${result.length}, expected ${expected.length}`);
        }
    }
    
} catch (error) {
    console.error('Error during conversion:', error.message);
    console.error(error.stack);
}