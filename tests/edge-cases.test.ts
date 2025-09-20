import { describe, it, expect } from 'vitest';
import { convertPythonToIB } from '../src/converter.js';

describe('Edge Cases Tests', () => {
  describe('Deep Nesting', () => {
    it('should handle 5-level nested if statements', () => {
      const deepNested = `if x > 0:
    if y > 0:
        if z > 0:
            if a > 0:
                if b > 0:
                    print("deep")`;
      const result = convertPythonToIB(deepNested);
      expect(result).toContain('if X > 0 then');
      expect(result).toContain('    if Y > 0 then');
      expect(result).toContain('        if Z > 0 then');
      expect(result).toContain('            if A > 0 then');
      expect(result).toContain('                if B > 0 then');
      expect(result).toContain('                    output "deep"');
      // Count the number of 'end if' statements
      const endIfCount = (result.match(/end if/g) || []).length;
      expect(endIfCount).toBe(5);
    });

    it('should handle nested loops with different types', () => {
      const nestedLoops = `for i in range(3):
    while j < 5:
        for k in range(2):
            print(i, j, k)
            j = j + 1`;
      const result = convertPythonToIB(nestedLoops);
      expect(result).toContain('loop I from 0 to 2');
      expect(result).toContain('    loop while J < 5');
      expect(result).toContain('        loop K from 0 to 1');
      expect(result).toContain('            output I, J, K');
      expect(result).toContain('        end loop');
      expect(result).toContain('    end loop');
      expect(result).toContain('end loop');
    });

    it('should handle nested functions', () => {
      const nestedFunctions = `def outer():
    def inner():
        return 42
    return inner()`;
      const result = convertPythonToIB(nestedFunctions);
      expect(result).toContain('function outer()');
      expect(result).toContain('    function inner()');
      expect(result).toContain('        return 42');
      expect(result).toContain('    end function');
      expect(result).toContain('    return inner()');
      expect(result).toContain('end function');
    });
  });

  describe('Complex Expressions', () => {
    it('should handle complex arithmetic expressions', () => {
      const complexExpr = `result = ((a + b) * (c - d)) / ((e + f) * (g - h))`;
      const result = convertPythonToIB(complexExpr);
      expect(result).toContain('RESULT = A + B * C - D div E + F * G - H');
    });

    it('should handle complex boolean expressions', () => {
      const complexBool = `if (x > 0 and y < 10) or (z == 5 and not w):
    print("complex")`;
      const result = convertPythonToIB(complexBool);
      expect(result).toContain('if X > 0 AND Y < 10 OR Z = 5 AND NOT W then');
      expect(result).toContain('    output "complex"');
      expect(result).toContain('end if');
    });

    it('should handle multiple assignment targets', () => {
      const multiAssign = `a = b = c = 10`;
      // Multiple assignment throws parser error
      expect(() => convertPythonToIB(multiAssign)).toThrow(/Python to IB conversion failed/);
    });

    it('should handle compound assignment operators', () => {
      const compoundOps = `x += 5
y -= 3
z *= 2
w /= 4`;
      const result = convertPythonToIB(compoundOps);
      expect(result).toContain('X = X + 5');
      expect(result).toContain('Y = Y - 3');
      expect(result).toContain('Z = Z * 2');
      expect(result).toContain('W = W div 4');
    });
  });

  describe('Long Names and Values', () => {
    it('should handle very long variable names', () => {
      const longName = 'very_long_variable_name_that_exceeds_normal_length_expectations';
      const code = `${longName} = 42
print(${longName})`;
      const result = convertPythonToIB(code);
      expect(result).toContain(`${longName.toUpperCase()} = 42`);
      expect(result).toContain(`output ${longName.toUpperCase()}`);
    });

    it('should handle very long function names', () => {
      const longFuncName = 'calculate_the_fibonacci_sequence_with_memoization_optimization';
      const code = `def ${longFuncName}(n):
    return n`;
      const result = convertPythonToIB(code);
      expect(result).toContain('function calculateTheFibonacciSequenceWithMemoizationOptimization(N) returns value');
      expect(result).toContain('end function');
    });

    it('should handle long string literals', () => {
      const longString = 'This is a very long string that contains multiple words and should be handled properly by the converter without any issues or truncation problems';
      const code = `message = "${longString}"
print(message)`;
      const result = convertPythonToIB(code);
      expect(result).toContain(`MESSAGE = "${longString}"`);
      expect(result).toContain('output MESSAGE');
    });

    it('should handle many parameters in function', () => {
      const manyParams = `def func_with_many_params(a, b, c, d, e, f, g, h, i, j):
    return a + b + c + d + e + f + g + h + i + j`;
      const result = convertPythonToIB(manyParams);
      expect(result).toContain('function funcWithManyParams(A, B, C, D, E, F, G, H, I, J) returns value');
      expect(result).toContain('return A + B + C + D + E + F + G + H + I + J');
      expect(result).toContain('end function');
    });
  });

  describe('Boundary Values', () => {
    it('should handle zero values', () => {
      const zeroCode = `x = 0
if x == 0:
    print("zero")`;
      const result = convertPythonToIB(zeroCode);
      expect(result).toContain('X = 0');
      expect(result).toContain('if X = 0 then');
      expect(result).toContain('    output "zero"');
      expect(result).toContain('end if');
    });

    it('should handle negative numbers', () => {
      const negativeCode = `x = -42
y = -3.14
print(x, y)`;
      const result = convertPythonToIB(negativeCode);
      expect(result).toContain('X = -42');
      expect(result).toContain('Y = -3.14');
      expect(result).toContain('output X, Y');
    });

    it('should handle large numbers', () => {
      const largeCode = `big_int = 999999999999999
big_float = 1.23456789012345e10
print(big_int, big_float)`;
      const result = convertPythonToIB(largeCode);
      expect(result).toContain('BIG_INT = 999999999999999');
      expect(result).toContain('BIG_FLOAT = 1.23456789012345');
      expect(result).toContain('output BIG_INT, BIG_FLOAT');
    });

    it('should handle empty strings', () => {
      const emptyStringCode = `empty = ""
if empty == "":
    print("empty string")`;
      const result = convertPythonToIB(emptyStringCode);
      expect(result).toContain('EMPTY = ""');
      expect(result).toContain('if EMPTY = "" then');
      expect(result).toContain('    output "empty string"');
      expect(result).toContain('end if');
    });

    it('should handle single character strings', () => {
      const singleCharCode = `char = "a"
print(char)`;
      const result = convertPythonToIB(singleCharCode);
      expect(result).toContain('CHAR = "a"');
      expect(result).toContain('output CHAR');
    });
  });

  describe('Special Formatting Cases', () => {
    it('should handle mixed case variable names', () => {
      const mixedCase = `myVariable = 10
MyFunction = 20
my_snake_case = 30`;
      const result = convertPythonToIB(mixedCase);
      expect(result).toContain('MYVARIABLE = 10');
      expect(result).toContain('MYFUNCTION = 20');
      expect(result).toContain('MY_SNAKE_CASE = 30');
    });

    it('should handle numbers in variable names', () => {
      const numbersInNames = `var1 = 10
var2test = 20
test3var = 30`;
      const result = convertPythonToIB(numbersInNames);
      expect(result).toContain('VAR1 = 10');
      expect(result).toContain('VAR2TEST = 20');
      expect(result).toContain('TEST3VAR = 30');
    });

    it('should handle underscores in names', () => {
      const underscores = `_private = 1
__dunder__ = 2
regular_var = 3`;
      const result = convertPythonToIB(underscores);
      expect(result).toContain('_PRIVATE = 1');
      expect(result).toContain('__DUNDER__ = 2');
      expect(result).toContain('REGULAR_VAR = 3');
    });

    it('should handle multiple spaces and tabs', () => {
      const spacesCode = `x    =     5
if   x   >   0  :
    print(  "positive"  )`;
      const result = convertPythonToIB(spacesCode);
      expect(result).toContain('X = 5');
      expect(result).toContain('if X > 0 then');
      expect(result).toContain('    output "positive"');
      expect(result).toContain('end if');
    });
  });

  describe('Complex Control Flow', () => {
    it('should handle elif chains', () => {
      const elifChain = `if x < 0:
    print("negative")
elif x == 0:
    print("zero")
elif x < 10:
    print("small positive")
else:
    print("large positive")`;
      const result = convertPythonToIB(elifChain);
      expect(result).toContain('if X < 0 then');
      expect(result).toContain('    output "negative"');
      expect(result).toContain('else if X = 0 then');
      expect(result).toContain('    output "zero"');
      expect(result).toContain('else if X < 10 then');
      expect(result).toContain('    output "small positive"');
      expect(result).toContain('else');
      expect(result).toContain('    output "large positive"');
      expect(result).toContain('end if');
    });

    it('should handle break and continue in loops', () => {
      const breakContinue = `for i in range(10):
    if i == 5:
        break
    if i % 2 == 0:
        continue
    print(i)`;
      const result = convertPythonToIB(breakContinue);
      expect(result).toContain('loop I from 0 to 9');
      expect(result).toContain('    if I = 5 then');
      expect(result).toContain('        BREAK');
      expect(result).toContain('    end if');
      expect(result).toContain('    if I mod 2 = 0 then');
      expect(result).toContain('        CONTINUE');
      expect(result).toContain('    end if');
      expect(result).toContain('    output I');
      expect(result).toContain('end loop');
    });

    it('should handle multiple return statements', () => {
      const multipleReturns = `def check_number(x):
    if x < 0:
        return "negative"
    elif x == 0:
        return "zero"
    else:
        return "positive"`;
      const result = convertPythonToIB(multipleReturns);
      expect(result).toContain('function checkNumber(X) returns value');
      expect(result).toContain('    if X < 0 then');
      expect(result).toContain('        return "negative"');
      expect(result).toContain('    else if X = 0 then');
      expect(result).toContain('        return "zero"');
      expect(result).toContain('    else');
      expect(result).toContain('        return "positive"');
      expect(result).toContain('    end if');
      expect(result).toContain('end function');
    });
  });
});