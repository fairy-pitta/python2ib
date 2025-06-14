import { convertPythonToIB } from './dist/converter.js';

const tests = [
  {
    name: 'simple assignment',
    python: 'x = 5',
    expected: 'X = 5'
  },
  {
    name: 'print statement',
    python: 'print(x)',
    expected: 'output X'
  },
  {
    name: 'string assignment',
    python: 'myword = "the"',
    expected: 'MYWORD = "the"'
  },
  {
    name: 'if statement',
    python: `if x > 5:
    print("greater")`,
    expected: `if X > 5 then
    output "greater"
end if`
  },
  {
    name: 'while loop',
    python: `while x < 10:
    x = x + 1`,
    expected: `loop while X < 10
    X = X + 1
end loop`
  },
  {
    name: 'for range loop',
    python: `for i in range(0, 10):
    print(i)`,
    expected: `loop I from 0 to 9
    output I
end loop`
  },
  {
    name: 'for range loop with step',
    python: `for i in range(0, 10, 2):
    print(i)`,
    expected: `loop I from 0 to 9 step 2
    output I
end loop`
  }
];

console.log('=== Running Individual Tests ===\n');

let passedCount = 0;
let failedCount = 0;

for (const test of tests) {
  console.log(`Testing: ${test.name}`);
  console.log(`Python: ${JSON.stringify(test.python)}`);
  console.log(`Expected: ${JSON.stringify(test.expected)}`);
  
  try {
    const result = convertPythonToIB(test.python);
    console.log(`Actual: ${JSON.stringify(result)}`);
    
    if (result === test.expected) {
      console.log('✅ PASSED\n');
      passedCount++;
    } else {
      console.log('❌ FAILED');
      console.log('Differences:');
      
      const actualLines = result.split('\n');
      const expectedLines = test.expected.split('\n');
      
      for (let i = 0; i < Math.max(actualLines.length, expectedLines.length); i++) {
        const actual = actualLines[i] || '<missing>';
        const expected = expectedLines[i] || '<missing>';
        if (actual !== expected) {
          console.log(`  Line ${i}: "${actual}" !== "${expected}"`);
        }
      }
      console.log();
      failedCount++;
    }
  } catch (error) {
    console.log('❌ ERROR:', error.message);
    console.log();
    failedCount++;
  }
}

console.log(`=== Summary ===`);
console.log(`Passed: ${passedCount}`);
console.log(`Failed: ${failedCount}`);
console.log(`Total: ${tests.length}`);