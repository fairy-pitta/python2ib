import { SPECIAL_CONSTRUCTS } from './dist/utils/keywords.js';

// Test calculateEnd function directly
function testCalculateEnd() {
  console.log('=== Testing calculateEnd function ===');
  
  // Test cases
  const testCases = [
    '5',
    'n',
    'n - 1',
    'n - i - 1',
    '10',
    'x + 5'
  ];
  
  testCases.forEach(testCase => {
    try {
      const result = SPECIAL_CONSTRUCTS.convertRange([testCase]);
      console.log(`Input: "${testCase}" -> End: "${result.end}"`);
    } catch (error) {
      console.log(`Input: "${testCase}" -> Error: ${error.message}`);
    }
  });
  
  console.log('\n=== Testing convertRange with 2 args ===');
  const twoArgCases = [
    ['0', '5'],
    ['0', 'n'],
    ['0', 'n - 1'],
    ['0', 'n - i - 1']
  ];
  
  twoArgCases.forEach(([start, end]) => {
    try {
      const result = SPECIAL_CONSTRUCTS.convertRange([start, end]);
      console.log(`Range(${start}, ${end}) -> Start: "${result.start}", End: "${result.end}"`);
    } catch (error) {
      console.log(`Range(${start}, ${end}) -> Error: ${error.message}`);
    }
  });
}

testCalculateEnd();