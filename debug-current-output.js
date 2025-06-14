import { convertPythonToIB } from './dist/index.js';

// Test nested structure
const python = `for i in range(3):
    if i % 2 == 0:
        for j in range(2):
            print(i, ", ", j)
    else:
        print("odd")`;

console.log('=== Python Input ===');
console.log(python);
console.log('\n=== Current Output ===');
try {
    const result = convertPythonToIB(python);
    console.log(result);
} catch (error) {
    console.error('Error:', error.message);
}