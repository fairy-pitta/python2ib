import { describe, it, expect } from 'vitest';
import { convertPythonToIB } from '../src/converter';

/**
 * Basic Python to IB Pseudocode conversion tests
 * Based on IB-pseudocode-rules.md specifications
 */
describe('Basic Python to IB Pseudocode Conversion', () => {
  
  describe('Assignment and Output', () => {
    it('should convert simple assignment', () => {
      const python = 'x = 5';
      const expected = 'X = 5';
      expect(convertPythonToIB(python)).toBe(expected);
    });

    it('should convert print statement to output', () => {
      const python = 'print(x)';
      const expected = 'output X';
      expect(convertPythonToIB(python)).toBe(expected);
    });

    it('should convert string assignment', () => {
      const python = 'myword = "the"';
      const expected = 'MYWORD = "the"';
      expect(convertPythonToIB(python)).toBe(expected);
    });
  });

  describe('Control Structures - If Statements', () => {
    it('should convert simple if statement', () => {
      const python = `if a > b:
    print(a)
else:
    print(b)`;
      const expected = `if A > B then
    output A
else
    output B
end if`;
      expect(convertPythonToIB(python)).toBe(expected);
    });

    it('should convert if-elif-else statement', () => {
      const python = `if x > 10:
    print("high")
elif x > 5:
    print("medium")
else:
    print("low")`;
      const expected = `if X > 10 then
    output "high"
else if X > 5 then
    output "medium"
else
    output "low"
end if`;
      expect(convertPythonToIB(python)).toBe(expected);
    });
  });

  describe('Control Structures - Loops', () => {
    it('should convert while loop', () => {
      const python = `while x < 10:
    x = x + 1`;
      const expected = `loop while X < 10
    X = X + 1
end loop`;
      expect(convertPythonToIB(python)).toBe(expected);
    });

    it('should convert for range loop', () => {
      const python = `for i in range(0, 10):
    print(i)`;
      const expected = `loop I from 0 to 9
    output I
end loop`;
      expect(convertPythonToIB(python)).toBe(expected);
    });

    it('should convert for range loop with step', () => {
      const python = `for i in range(0, 10, 2):
    print(i)`;
      const expected = `loop I from 0 to 9 step 2
    output I
end loop`;
      expect(convertPythonToIB(python)).toBe(expected);
    });
  });

  describe('Operators', () => {
    it('should convert comparison operators', () => {
      const python = `if x != 4:
    print("not equal")`;
      const expected = `if X ≠ 4 then
    output "not equal"
end if`;
      expect(convertPythonToIB(python)).toBe(expected);
    });

    it('should convert logical operators', () => {
      const python = `if a and b:
    print("both true")`;
      const expected = `if A AND B then
    output "both true"
end if`;
      expect(convertPythonToIB(python)).toBe(expected);
    });

    it('should convert modulo operator', () => {
      const python = 'result = 15 % 4';
      const expected = 'RESULT = 15 mod 4';
      expect(convertPythonToIB(python)).toBe(expected);
    });

    it('should convert integer division', () => {
      const python = 'result = 15 // 4';
      const expected = 'RESULT = 15 div 4';
      expect(convertPythonToIB(python)).toBe(expected);
    });
  });

  describe('Compound Assignment', () => {
    it('should expand += operator', () => {
      const python = 'x += 5';
      const expected = 'X = X + 5';
      expect(convertPythonToIB(python)).toBe(expected);
    });

    it('should expand -= operator', () => {
      const python = 'x -= 3';
      const expected = 'X = X - 3';
      expect(convertPythonToIB(python)).toBe(expected);
    });

    it('should expand *= operator', () => {
      const python = 'x *= 2';
      const expected = 'X = X * 2';
      expect(convertPythonToIB(python)).toBe(expected);
    });
  });

  describe('Comments', () => {
    it('should convert Python comments to IB comments', () => {
      const python = '# This is a comment\nx = 5';
      const expected = '// This is a comment\nX = 5';
      expect(convertPythonToIB(python)).toBe(expected);
    });
  });

  describe('Arrays and Lists', () => {
    it('should convert list indexing', () => {
      const python = 'value = names[0]';
      const expected = 'VALUE = NAMES[0]';
      expect(convertPythonToIB(python)).toBe(expected);
    });

    it('should convert list assignment', () => {
      const python = 'names[0] = "Alice"';
      const expected = 'NAMES[0] = "Alice"';
      expect(convertPythonToIB(python)).toBe(expected);
    });
  });
});