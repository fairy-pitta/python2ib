import { describe, it, expect } from 'vitest';
import { convertPythonToIB } from '../src/converter.js';

describe('Error Handling Tests', () => {
  describe('Invalid Python Syntax', () => {
    it('should handle unclosed parentheses', () => {
      const invalidCode = `print("hello"`;
      // Unclosed parentheses throws an error
      expect(() => convertPythonToIB(invalidCode)).toThrow(/Python to IB conversion failed/);
    });

    it('should handle unclosed brackets', () => {
      const invalidCode = `x = [1, 2, 3`;
      expect(() => convertPythonToIB(invalidCode)).toThrow();
    });

    it('should handle invalid indentation', () => {
      const invalidCode = `if True:
print("hello")`; // Missing indentation
      // Invalid indentation is currently handled gracefully
      const result = convertPythonToIB(invalidCode);
      expect(result).toContain('if true then');
    });

    it('should handle unexpected indentation', () => {
      const invalidCode = `x = 5
    y = 10`; // Unexpected indentation
      expect(() => convertPythonToIB(invalidCode)).toThrow();
    });

    it('should handle invalid function definition', () => {
      const invalidCode = `def ():  # Missing function name
    pass`;
      expect(() => convertPythonToIB(invalidCode)).toThrow();
    });

    it('should handle invalid assignment', () => {
      const invalidCode = `5 = x`; // Cannot assign to literal
      // Invalid assignment is handled with error comment
      const result = convertPythonToIB(invalidCode);
      expect(result).toContain('// ERROR: Complex assignments not supported');
    });
  });

  describe('Unsupported Python Features', () => {
    it('should handle class definitions gracefully', () => {
      const classCode = `class MyClass:
    def __init__(self):
        self.x = 5`;
      // Class definitions are currently converted, not throwing errors
      const result = convertPythonToIB(classCode);
      expect(result).toContain('CLASS MyClass');
    });

    it('should handle decorators gracefully', () => {
      const decoratorCode = `@property
def my_func():
    return 5`;
      // Decorators are currently ignored, not throwing errors
      const result = convertPythonToIB(decoratorCode);
      expect(result).toContain('PROPERTY myFunc');
    });

    it('should handle lambda functions gracefully', () => {
      const lambdaCode = `f = lambda x: x * 2`;
      expect(() => convertPythonToIB(lambdaCode)).toThrow(/Parser error|Expected/);
    });

    it('should handle list comprehensions gracefully', () => {
      const listCompCode = `squares = [x**2 for x in range(10)]`;
      expect(() => convertPythonToIB(listCompCode)).toThrow(/Parser error|Expected/);
    });

    it('should handle try-except blocks gracefully', () => {
      const tryCode = `try:
    x = 1/0
except ZeroDivisionError:
    print("Error")`;
      expect(() => convertPythonToIB(tryCode)).toThrow(/Parser error|Unexpected token/);
    });

    it('should handle with statements gracefully', () => {
      const withCode = `with open("file.txt") as f:
    content = f.read()`;
      expect(() => convertPythonToIB(withCode)).toThrow(/Parser error|Unexpected token/);
    });

    it('should handle import statements gracefully', () => {
      const importCode = `import math
from os import path`;
      // Import statements are converted to uppercase identifiers
      const result = convertPythonToIB(importCode);
      expect(result).toContain('IMPORT');
      expect(result).toContain('MATH');
    });
  });

  describe('Empty and Edge Cases', () => {
    it('should handle empty string', () => {
      const result = convertPythonToIB('');
      expect(result).toBe('');
    });

    it('should handle whitespace-only string', () => {
      const result = convertPythonToIB('   \n\t  \n  ');
      expect(result).toBe('');
    });

    it('should handle comments-only code', () => {
      const commentsOnly = `# This is a comment
# Another comment
# Yet another comment`;
      const result = convertPythonToIB(commentsOnly);
      expect(result).toContain('// This is a comment');
      expect(result).toContain('// Another comment');
      expect(result).toContain('// Yet another comment');
    });

    it('should handle single pass statement', () => {
      const passCode = `pass`;
      const result = convertPythonToIB(passCode);
      expect(result).toBe('// empty block'); // pass should be converted to comment
    });

    it('should handle empty function', () => {
      const emptyFunc = `def empty_func():
    pass`;
      const result = convertPythonToIB(emptyFunc);
      expect(result).toContain('procedure emptyFunc()');
      expect(result).toContain('end procedure');
    });

    it('should handle empty if block', () => {
      const emptyIf = `if True:
    pass`;
      const result = convertPythonToIB(emptyIf);
      expect(result).toContain('if true then');
      expect(result).toContain('end if');
    });
  });

  describe('Malformed Code', () => {
    it('should handle incomplete if statement', () => {
      const incompleteIf = `if x`; // Missing colon and condition
      expect(() => convertPythonToIB(incompleteIf)).toThrow();
    });

    it('should handle incomplete for loop', () => {
      const incompleteFor = `for i in`; // Missing iterable
      expect(() => convertPythonToIB(incompleteFor)).toThrow();
    });

    it('should handle incomplete while loop', () => {
      const incompleteWhile = `while`; // Missing condition
      expect(() => convertPythonToIB(incompleteWhile)).toThrow();
    });

    it('should handle incomplete function call', () => {
      const incompleteCall = `print(`; // Missing closing parenthesis
      expect(() => convertPythonToIB(incompleteCall)).toThrow();
    });

    it('should handle mixed quotes', () => {
      const mixedQuotes = `print("hello')`; // Mismatched quotes
      expect(() => convertPythonToIB(mixedQuotes)).toThrow();
    });
  });

  describe('Large Input Handling', () => {
    it('should handle very long variable names', () => {
      const longVarName = 'a'.repeat(1000);
      const code = `${longVarName} = 5\nprint(${longVarName})`;
      const result = convertPythonToIB(code);
      expect(result).toContain(`${longVarName.toUpperCase()} = 5`);
      expect(result).toContain(`output ${longVarName.toUpperCase()}`);
    });

    it('should handle very long string literals', () => {
      const longString = 'x'.repeat(10000);
      const code = `message = "${longString}"\nprint(message)`;
      const result = convertPythonToIB(code);
      expect(result).toContain(`MESSAGE = "${longString}"`);
      expect(result).toContain('output MESSAGE');
    });

    it('should handle deeply nested expressions', () => {
      const deepExpr = '((((((((((1 + 2) * 3) - 4) / 5) + 6) * 7) - 8) / 9) + 10) * 11)';
      const code = `result = ${deepExpr}`;
      const result = convertPythonToIB(code);
      expect(result).toContain('RESULT =');
    });
  });

  describe('Special Characters and Encoding', () => {
    it('should handle unicode characters in strings', () => {
      const unicodeCode = `message = "こんにちは世界"\nprint(message)`;
      const result = convertPythonToIB(unicodeCode);
      expect(result).toContain('MESSAGE = "こんにちは世界"');
      expect(result).toContain('output MESSAGE');
    });

    it('should handle unicode characters in variable names', () => {
      const unicodeVar = `変数 = 42\nprint(変数)`;
      expect(() => convertPythonToIB(unicodeVar)).toThrow(/Parser error|Unexpected character/);
    });

    it('should handle escape sequences in strings', () => {
      const escapeCode = `message = "Hello\\nWorld\\t!"\nprint(message)`;
      const result = convertPythonToIB(escapeCode);
      expect(result).toContain('MESSAGE = "Hello\\nWorld\\t!"');
      expect(result).toContain('output MESSAGE');
    });

    it('should handle special characters in comments', () => {
      const specialComments = `# Special chars: @#$%^&*()[]{}|\\:;"'<>,.?/~\`\nx = 5`;
      const result = convertPythonToIB(specialComments);
      expect(result).toContain('// Special chars: @#$%^&*()[]{}|\\:;"\'<>,.?/~`');
      expect(result).toContain('X = 5');
    });
  });
});