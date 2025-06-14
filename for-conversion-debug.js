import { convertPythonToIB } from './dist/index.js';

// Test FOR loop conversion specifically
function testForConversion() {
  console.log('=== Testing FOR loop conversion ===');
  
  const testCases = [
    'for i in range(5): pass',
    'for i in range(0, 5): pass',
    'for i in range(0, n): pass',
    'for i in range(0, n - 1): pass',
    'for i in range(0, n - i - 1): pass'
  ];
  
  testCases.forEach(testCase => {
    try {
      console.log(`\nInput: ${testCase}`);
      const result = convertPythonToIB(testCase);
      console.log(`Output: ${result}`);
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  });
}

testForConversion();