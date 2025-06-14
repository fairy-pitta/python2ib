import { convertPythonToIB } from './dist/converter.js';

// Debug tuple assignment issue
console.log('=== Debugging Tuple Assignment ===');
const python = `arr[j], arr[j + 1] = arr[j + 1], arr[j]`;
const result = convertPythonToIB(python);
console.log('Python code:');
console.log(python);
console.log('\nConverted result:');
console.log(result);
console.log('\nExpected:');
console.log('TEMP = ARR[J]\nARR[J] = ARR[J + 1]\nARR[J + 1] = TEMP');

// Test simple tuple assignment
console.log('\n\n=== Simple Tuple Assignment ===');
const python2 = `a, b = b, a`;
const result2 = convertPythonToIB(python2);
console.log('Python code:');
console.log(python2);
console.log('\nConverted result:');
console.log(result2);
console.log('\nExpected:');
console.log('TEMP = A\nA = B\nB = TEMP');