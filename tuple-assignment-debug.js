import { convertPythonToIB } from './dist/converter.js';

// Test cases for tuple assignment detection
const testCases = [
  {
    name: 'Simple tuple assignment',
    code: 'a, b = b, a'
  },
  {
    name: 'Array element swap',
    code: 'arr[j], arr[j + 1] = arr[j + 1], arr[j]'
  },
  {
    name: 'Bubble sort with tuple assignment',
    code: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]`
  },
  {
    name: 'Assignment without tuple',
    code: 'x = 5'
  }
];

testCases.forEach((testCase, index) => {
  console.log(`\n=== Test ${index + 1}: ${testCase.name} ===`);
  console.log('Input:');
  console.log(testCase.code);
  
  try {
    const result = convertPythonToIB(testCase.code);
    console.log('\nOutput:');
    console.log(result);
    
    console.log('\nAnalysis:');
    console.log('- Contains TEMP:', result.includes('TEMP'));
    console.log('- Contains tuple assignment pattern:', result.includes('ARR[J + 1]\n    ARR[J] = ARR[J + 1]\n    ARR[J + 1] = TEMP'));
    console.log('- Lines count:', result.split('\n').length);
    
  } catch (error) {
    console.log('\nError:', error.message);
    if (error.stack) {
      console.log('Stack:', error.stack.split('\n').slice(0, 5).join('\n'));
    }
  }
});