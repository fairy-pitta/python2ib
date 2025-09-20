import { describe, it, expect } from 'vitest';
import { convertPythonToIB } from '../src/converter.js';

describe('Debug Function Conversion', () => {
  it('should debug function without return to PROCEDURE', () => {
    const python = `def greet(name):
    print(f"Hello {name}")`;
    const expected = `procedure greet(NAME)
    output "Hello " + NAME
end procedure`;
    
    console.log('=== Python Input ===');
    console.log(JSON.stringify(python));
    console.log('\n=== Expected Output ===');
    console.log(JSON.stringify(expected));
    
    const result = convertPythonToIB(python);
    console.log('\n=== Actual Output ===');
    console.log(JSON.stringify(result));
    
    console.log('\n=== Character by Character Comparison ===');
    const minLength = Math.min(expected.length, result.length);
    for (let i = 0; i < minLength; i++) {
      if (expected[i] !== result[i]) {
        console.log(`Difference at position ${i}:`);
        console.log(`Expected: '${expected[i]}' (${expected.charCodeAt(i)})`);
        console.log(`Actual:   '${result[i]}' (${result.charCodeAt(i)})`);
        break;
      }
    }
    
    if (expected.length !== result.length) {
      console.log(`Length difference: expected ${expected.length}, got ${result.length}`);
    }
    
    expect(result).toBe(expected);
  });
});