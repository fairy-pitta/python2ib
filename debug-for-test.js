import { convertPythonToIB } from './dist/index.js';

const python = `for i in range(0, 10):
    print(i)`;

console.log('=== Python Input ===');
console.log(python);
console.log();

try {
    const result = convertPythonToIB(python);
    console.log('=== Actual Result ===');
    console.log(JSON.stringify(result, null, 2));
    console.log();
    console.log('=== Actual Result (String) ===');
    console.log(result);
    console.log();
    
    const expected = `loop I from 0 to 9
    output I
end loop`;
    console.log('=== Expected Result ===');
    console.log(expected);
    console.log();
    
    console.log('=== Match ===');
    console.log('Match:', result === expected);
    
    if (result !== expected) {
        console.log('=== Differences ===');
        console.log('Actual length:', result.length);
        console.log('Expected length:', expected.length);
        
        const actualLines = result.split('\n');
        const expectedLines = expected.split('\n');
        
        console.log('Actual lines:', actualLines.length);
        console.log('Expected lines:', expectedLines.length);
        
        for (let i = 0; i < Math.max(actualLines.length, expectedLines.length); i++) {
            const actual = actualLines[i] || '<missing>';
            const expected = expectedLines[i] || '<missing>';
            if (actual !== expected) {
                console.log(`Line ${i}: "${actual}" !== "${expected}"`);
            }
        }
    }
} catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
}