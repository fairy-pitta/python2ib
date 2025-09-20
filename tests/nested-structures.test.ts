import { describe, it, expect } from 'vitest';

import { convertPythonToIB } from '../src/converter.js';

/**
 * Nested structure conversion tests
 * Based on plan.md requirement for 3+ level nesting support
 */
describe('Nested Structure Conversion', () => {
  
  describe('2-Level Nesting', () => {
    it('should convert nested if statements', () => {
      const python = `if x > 0:
    if y > 0:
        print("both positive")
    else:
        print("x positive, y negative")
else:
    print("x negative")`;
      const expected = `if X > 0 then
    if Y > 0 then
        output "both positive"
    else
        output "x positive, y negative"
    end if
else
    output "x negative"
end if`;
      expect(convertPythonToIB(python)).toBe(expected);
    });

    it('should convert nested loops', () => {
      const python = `for i in range(3):
    for j in range(2):
        print(i, j)`;
      const expected = `loop I from 0 to 2
    loop J from 0 to 1
        output I, J
    end loop
end loop`;
      expect(convertPythonToIB(python)).toBe(expected);
    });

    it('should convert if inside while loop', () => {
      const python = `while x < 10:
    if x % 2 == 0:
        print("even")
    x += 1`;
      const expected = `loop while X < 10
    if X mod 2 = 0 then
        output "even"
    end if
    X = X + 1
end loop`;
      expect(convertPythonToIB(python)).toBe(expected);
    });
  });

  describe('3-Level Nesting', () => {
    it('should convert 3-level nested if statements', () => {
      const python = `if a > 0:
    if b > 0:
        if c > 0:
            print("all positive")
        else:
            print("a,b positive, c negative")
    else:
        print("a positive, b negative")
else:
    print("a negative")`;
      const expected = `if A > 0 then
    if B > 0 then
        if C > 0 then
            output "all positive"
        else
            output "a,b positive, c negative"
        end if
    else
        output "a positive, b negative"
    end if
else
    output "a negative"
end if`;
      expect(convertPythonToIB(python)).toBe(expected);
    });

    it('should convert 3-level nested loops', () => {
      const python = `for i in range(2):
    for j in range(2):
        for k in range(2):
            print(i, j, k)`;
      const expected = `loop I from 0 to 1
    loop J from 0 to 1
        loop K from 0 to 1
            output I, J, K
        end loop
    end loop
end loop`;
      expect(convertPythonToIB(python)).toBe(expected);
    });

    it('should convert mixed nested structures', () => {
      const python = `for i in range(3):
    if i % 2 == 0:
        while j < i:
            print(j)
            j += 1`;
      const expected = `loop I from 0 to 2
    if I mod 2 = 0 then
        loop while J < I
            output J
            J = J + 1
        end loop
    end if
end loop`;
      expect(convertPythonToIB(python)).toBe(expected);
    });
  });

  describe('4+ Level Nesting', () => {
    it('should convert 4-level nested structures', () => {
      const python = `for i in range(2):
    if i > 0:
        for j in range(2):
            if j > 0:
                print("deep nesting", i, j)`;
      const expected = `loop I from 0 to 1
    if I > 0 then
        loop J from 0 to 1
            if J > 0 then
                output "deep nesting", I, J
            end if
        end loop
    end if
end loop`;
      expect(convertPythonToIB(python)).toBe(expected);
    });

    it('should convert complex nested function', () => {
      const python = `def process_matrix(matrix):
    for i in range(len(matrix)):
        for j in range(len(matrix[i])):
            if matrix[i][j] > 0:
                if matrix[i][j] % 2 == 0:
                    print("positive even")
                else:
                    print("positive odd")
            else:
                print("non-positive")`;
      const expected = `procedure processMatrix(MATRIX)
    loop I from 0 to SIZE(MATRIX) - 1
        loop J from 0 to SIZE(MATRIX[I]) - 1
            if MATRIX[I][J] > 0 then
                if MATRIX[I][J] mod 2 = 0 then
                    output "positive even"
                else
                    output "positive odd"
                end if
            else
                output "non-positive"
            end if
        end loop
    end loop
end procedure`;
      expect(convertPythonToIB(python)).toBe(expected);
    });
  });

  describe('Nested Functions', () => {
    it('should convert function with nested control structures', () => {
      const python = `def find_max(numbers):
    max_val = numbers[0]
    for i in range(1, len(numbers)):
        if numbers[i] > max_val:
            max_val = numbers[i]
    return max_val`;
      const expected = `function findMax(NUMBERS) returns value
    MAX_VAL = NUMBERS[0]
    loop I from 1 to SIZE(NUMBERS) - 1
        if NUMBERS[I] > MAX_VAL then
            MAX_VAL = NUMBERS[I]
        end if
    end loop
    return MAX_VAL
end function`;
      expect(convertPythonToIB(python)).toBe(expected);
    });

    it('should convert procedure with complex nesting', () => {
      const python = `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]`;
      const expected = `procedure bubbleSort(ARR)
    N = SIZE(ARR)
    loop I from 0 to N - 1
        loop J from 0 to N - I - 2
            if ARR[J] > ARR[J + 1] then
                TEMP = ARR[J]
                ARR[J] = ARR[J + 1]
                ARR[J + 1] = TEMP
            end if
        end loop
    end loop
end procedure`;
      expect(convertPythonToIB(python)).toBe(expected);
    });
  });

  describe('Error Cases and Edge Cases', () => {
    it('should handle empty nested blocks', () => {
      const python = `if x > 0:
    if y > 0:
        pass
    else:
        print("y negative")`;
      const expected = `if X > 0 then
    if Y > 0 then
        // empty block
    else
        output "y negative"
    end if
end if`;
      expect(convertPythonToIB(python)).toBe(expected);
    });

    it('should handle single statement in nested block', () => {
      const python = `for i in range(3):
    if i == 1:
        print(i)`;
      const expected = `loop I from 0 to 2
    if I = 1 then
        output I
    end if
end loop`;
      expect(convertPythonToIB(python)).toBe(expected);
    });
  });
});