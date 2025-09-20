import { describe, it, expect } from 'vitest';
import { convertPythonToIB } from '../src/converter';

/**
 * Function and Procedure conversion tests
 * Based on plan.md specifications for PROCEDURE vs FUNCTION distinction
 */
describe('Function and Procedure Conversion', () => {
  
  describe('Procedures (functions without return)', () => {
    it('should convert function without return to PROCEDURE', () => {
      const python = `def greet(name):
    print(f"Hello {name}")`;
      const expected = `procedure greet(NAME)
    output "Hello " + NAME
end procedure`;
      expect(convertPythonToIB(python)).toBe(expected);
    });

    it('should convert function with multiple parameters', () => {
      const python = `def display_info(name, age):
    print(name)
    print(age)`;
      const expected = `procedure displayInfo(NAME, AGE)
    output NAME
    output AGE
end procedure`;
      expect(convertPythonToIB(python)).toBe(expected);
    });

    it('should convert function with no parameters', () => {
      const python = `def say_hello():
    print("Hello World")`;
      const expected = `procedure sayHello()
    output "Hello World"
end procedure`;
      expect(convertPythonToIB(python)).toBe(expected);
    });
  });

  describe('Functions (functions with return)', () => {
    it('should convert function with return to FUNCTION', () => {
      const python = `def add(a, b):
    return a + b`;
      const expected = `function add(A, B) returns value
    return A + B
end function`;
      expect(convertPythonToIB(python)).toBe(expected);
    });

    it('should convert function with conditional return', () => {
      const python = `def max_value(a, b):
    if a > b:
        return a
    else:
        return b`;
      const expected = `function maxValue(A, B) returns value
    if A > B then
        return A
    else
        return B
    end if
end function`;
      expect(convertPythonToIB(python)).toBe(expected);
    });

    it('should convert function with multiple return statements', () => {
      const python = `def check_sign(x):
    if x > 0:
        return "positive"
    elif x < 0:
        return "negative"
    else:
        return "zero"`;
      const expected = `function checkSign(X) returns value
    if X > 0 then
        return "positive"
    else if X < 0 then
        return "negative"
    else
        return "zero"
    end if
end function`;
      expect(convertPythonToIB(python)).toBe(expected);
    });
  });

  describe('Function Calls', () => {
    it('should convert function call in assignment', () => {
      const python = 'result = add(5, 3)';
      const expected = 'RESULT = add(5, 3)';
      expect(convertPythonToIB(python)).toBe(expected);
    });

    it('should convert procedure call', () => {
      const python = 'greet("Alice")';
      const expected = 'greet("Alice")';
      expect(convertPythonToIB(python)).toBe(expected);
    });

    it('should convert function call in expression', () => {
      const python = 'total = add(x, y) + 10';
      const expected = 'TOTAL = add(X, Y) + 10';
      expect(convertPythonToIB(python)).toBe(expected);
    });
  });

  describe('Input Handling', () => {
    it('should convert input() to INPUT statement', () => {
      const python = 'name = input("Enter your name: ")';
      const expected = `output "Enter your name: "
input NAME`;
      expect(convertPythonToIB(python)).toBe(expected);
    });

    it('should convert input() without prompt', () => {
      const python = 'value = input()';
      const expected = 'input VALUE';
      expect(convertPythonToIB(python)).toBe(expected);
    });

    it('should convert input() with type conversion', () => {
      const python = 'age = int(input("Enter age: "))';
      const expected = `output "Enter age: "
input AGE`;
      expect(convertPythonToIB(python)).toBe(expected);
    });
  });
});