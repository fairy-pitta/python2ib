import { convertPythonToIB } from './dist/index.js';

const code = `if x > 0:
    pass`;

console.log('Input:');
console.log(code);
console.log('\nOutput:');
const result = convertPythonToIB(code);
console.log(result);