import { convertPythonToIB } from './dist/index.js';

console.log('=== Testing for range loop ===');

const python = `for i in range(0, 10):
    print(i)`;
const expected = `loop I from 0 to 9
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
        console.log('Character-by-character comparison:');
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

// Test simple range case
console.log('\n=== Testing simple range(3) ===');
const simplePython = `for i in range(3):
    print(i)`;
const simpleExpected = `loop I from 0 to 2
    output I
end loop`;

try {
    const simpleResult = convertPythonToIB(simplePython);
    console.log('Simple Python input:', JSON.stringify(simplePython));
    console.log('Simple expected:', JSON.stringify(simpleExpected));
    console.log('Simple actual:', JSON.stringify(simpleResult));
    console.log('Simple match:', simpleResult === simpleExpected);
} catch (error) {
    console.error('Error in simple test:', error.message);
}