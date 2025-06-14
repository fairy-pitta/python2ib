import { convertPythonToIB } from './dist/converter.js';

// Test range calculations
const testCases = [
  {
    name: 'Simple range',
    code: 'for i in range(5): pass'
  },
  {
    name: 'Range with start and end',
    code: 'for i in range(0, 5): pass'
  },
  {
    name: 'Range with variable',
    code: 'for i in range(n): pass'
  },
  {
    name: 'Range with expression',
    code: 'for i in range(0, n - 1): pass'
  },
  {
    name: 'Bubble sort range',
    code: 'for j in range(0, n - i - 1): pass'
  }
];

testCases.forEach((testCase, index) => {
  console.log(`\n=== Test ${index + 1}: ${testCase.name} ===`);
  console.log('Input:', testCase.code);
  
  try {
    const result = convertPythonToIB(testCase.code);
    console.log('Output:', result);
    
    // Extract the range part
    const rangeMatch = result.match(/loop \w+ from (\S+) to (.+?)\n/);
    if (rangeMatch) {
      console.log('Range: from', rangeMatch[1], 'to', rangeMatch[2]);
    }
    
  } catch (error) {
    console.log('Error:', error.message);
  }
});