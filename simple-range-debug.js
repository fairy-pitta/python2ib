import { convertPythonToIB } from './dist/index.js';

// Simple test to see what's happening with range conversion
function simpleRangeTest() {
  console.log('=== Simple Range Test ===');
  
  const testCases = [
    { code: 'for i in range(5): pass', expected: 'loop I from 0 to 4' },
    { code: 'for i in range(0, 5): pass', expected: 'loop I from 0 to 4' },
    { code: 'for i in range(1, 6): pass', expected: 'loop I from 1 to 5' }
  ];
  
  testCases.forEach(({ code, expected }) => {
    console.log(`\nInput: ${code}`);
    console.log(`Expected: ${expected}`);
    
    try {
      const result = convertPythonToIB(code);
      const lines = result.split('\n').filter(line => line.trim());
      const forLine = lines.find(line => line.includes('loop'));
      console.log(`Actual: ${forLine}`);
      console.log(`Match: ${forLine === expected}`);
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  });
}

simpleRangeTest();