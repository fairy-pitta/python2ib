/**
 * Custom error classes for python2ib converter
 */

export class PythonSyntaxError extends Error {
  constructor(message: string, public line?: number, public column?: number) {
    super(message);
    this.name = 'PythonSyntaxError';
  }

  override toString(): string {
    const location = this.line !== undefined ? ` at line ${this.line}` : '';
    return `${this.name}: ${this.message}${location}`;
  }
}

export class UnsupportedSyntaxError extends Error {
  constructor(
    message: string,
    public syntaxType: string,
    public suggestion?: string
  ) {
    super(message);
    this.name = 'UnsupportedSyntaxError';
  }

  override toString(): string {
    const suggestion = this.suggestion ? `\n\nSuggestion: ${this.suggestion}` : '';
    return `${this.name}: ${this.message} (${this.syntaxType})${suggestion}`;
  }
}

export class ConversionError extends Error {
  constructor(
    message: string,
    public originalCode?: string,
    public partialResult?: string
  ) {
    super(message);
    this.name = 'ConversionError';
  }

  override toString(): string {
    let result = `${this.name}: ${this.message}`;
    
    if (this.originalCode) {
      result += `\n\nOriginal code:\n${this.originalCode}`;
    }
    
    if (this.partialResult) {
      result += `\n\nPartial conversion result:\n${this.partialResult}`;
    }
    
    return result;
  }
}

export class ConfigurationError extends Error {
  constructor(message: string, public configPath?: string) {
    super(message);
    this.name = 'ConfigurationError';
  }

  override toString(): string {
    const path = this.configPath ? ` in ${this.configPath}` : '';
    return `${this.name}: ${this.message}${path}`;
  }
}

/**
 * Error messages with helpful suggestions
 */
export const ERROR_MESSAGES = {
  UNSUPPORTED_CLASS: {
    message: 'Class definitions are not supported in IB Pseudocode',
    suggestion: 'Convert classes to functions. Use separate functions instead of methods.'
  },
  UNSUPPORTED_LAMBDA: {
    message: 'Lambda functions are not supported',
    suggestion: 'Convert lambda to a regular function definition.'
  },
  UNSUPPORTED_LIST_COMPREHENSION: {
    message: 'List comprehensions are not supported',
    suggestion: 'Convert to explicit for loop with append operations.'
  },
  UNSUPPORTED_EXCEPTION_HANDLING: {
    message: 'Exception handling (try/except) is not supported',
    suggestion: 'Use conditional statements to check for error conditions.'
  },
  UNSUPPORTED_IMPORT: {
    message: 'Import statements are not supported',
    suggestion: 'Include necessary functions directly in your code.'
  },
  UNSUPPORTED_DECORATOR: {
    message: 'Decorators are not supported',
    suggestion: 'Remove decorators and use plain function definitions.'
  },
  UNSUPPORTED_ASYNC: {
    message: 'Async/await syntax is not supported',
    suggestion: 'Convert to synchronous code using regular functions.'
  },
  UNSUPPORTED_MATCH_CASE: {
    message: 'Match/case statements are not supported',
    suggestion: 'Convert to if/elif/else chain.'
  },
  INVALID_PYTHON_SYNTAX: {
    message: 'Invalid Python syntax detected',
    suggestion: 'Check your Python code for syntax errors before conversion.'
  },
  EMPTY_INPUT: {
    message: 'Empty or whitespace-only input provided',
    suggestion: 'Provide valid Python code to convert.'
  }
} as const;

/**
 * Helper function to create UnsupportedSyntaxError with predefined messages
 */
export function createUnsupportedSyntaxError(
  errorType: keyof typeof ERROR_MESSAGES,
  syntaxType: string
): UnsupportedSyntaxError {
  const errorInfo = ERROR_MESSAGES[errorType];
  return new UnsupportedSyntaxError(
    errorInfo.message,
    syntaxType,
    errorInfo.suggestion
  );
}

/**
 * Helper function to format error for CLI output
 */
export function formatErrorForCLI(error: Error): string {
  if (error instanceof UnsupportedSyntaxError) {
    return `❌ ${error.toString()}\n\n💡 ${error.suggestion || 'See documentation for alternatives.'}`;
  }
  
  if (error instanceof PythonSyntaxError) {
    return `❌ ${error.toString()}\n\n💡 Check your Python syntax and try again.`;
  }
  
  if (error instanceof ConversionError) {
    return `❌ ${error.toString()}\n\n💡 Try simplifying your code or report this as a bug.`;
  }
  
  if (error instanceof ConfigurationError) {
    return `❌ ${error.toString()}\n\n💡 Check your configuration file format.`;
  }
  
  return `❌ Unexpected error: ${error.message}`;
}