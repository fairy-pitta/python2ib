/**
 * Operator conversion mappings for Python to IB Pseudocode
 */

/** Assignment operators mapping */
export const ASSIGNMENT_OPERATORS: Record<string, string> = {
  '=': '=',
  '+=': '= {var} +',
  '-=': '= {var} -',
  '*=': '= {var} *',
  '/=': '= {var} /',
  '//=': '= {var} div',
  '%=': '= {var} mod',
  '**=': '= {var} ^'
};

/** Comparison operators mapping */
export const COMPARISON_OPERATORS: Record<string, string> = {
  '==': '=',
  '!=': '≠',
  '<': '<',
  '<=': '<=',
  '>': '>',
  '>=': '>=',
  'is': '=',
  'is not': '≠',
  'in': 'IN',
  'not in': 'NOT IN'
};

/** Arithmetic operators mapping */
export const ARITHMETIC_OPERATORS: Record<string, string> = {
  '+': '+',
  '-': '-',
  '*': '*',
  '/': '/',
  '//': 'div',
  '%': 'mod',
  '**': '^'
};

/** Logical operators mapping */
export const LOGICAL_OPERATORS: Record<string, string> = {
  'and': 'AND',
  'or': 'OR',
  'not': 'NOT'
};

/** Bitwise operators (not commonly used in IB but included for completeness) */
export const BITWISE_OPERATORS: Record<string, string> = {
  '&': 'AND',
  '|': 'OR',
  '^': 'XOR',
  '~': 'NOT',
  '<<': 'LSHIFT',
  '>>': 'RSHIFT'
};

/** All operators combined */
export const ALL_OPERATORS = {
  ...ASSIGNMENT_OPERATORS,
  ...COMPARISON_OPERATORS,
  ...ARITHMETIC_OPERATORS,
  ...LOGICAL_OPERATORS,
  ...BITWISE_OPERATORS
};

/** Operator conversion utilities */
export class OperatorConverter {
  /** Convert Python assignment operator to IB Pseudocode */
  static convertAssignment(operator: string, variable: string): string {
    const ibOperator = ASSIGNMENT_OPERATORS[operator];
    if (!ibOperator) {
      throw new Error(`Unsupported assignment operator: ${operator}`);
    }
    
    if (operator === '=') {
      return '=';
    }
    
    // For compound assignments, replace {var} with the actual variable
    return ibOperator.replace('{var}', variable);
  }
  
  /** Convert Python comparison operator to IB Pseudocode */
  static convertComparison(operator: string): string {
    const ibOperator = COMPARISON_OPERATORS[operator];
    if (!ibOperator) {
      throw new Error(`Unsupported comparison operator: ${operator}`);
    }
    return ibOperator;
  }
  
  /** Convert Python arithmetic operator to IB Pseudocode */
  static convertArithmetic(operator: string): string {
    const ibOperator = ARITHMETIC_OPERATORS[operator];
    if (!ibOperator) {
      throw new Error(`Unsupported arithmetic operator: ${operator}`);
    }
    return ibOperator;
  }
  
  /** Convert Python logical operator to IB Pseudocode */
  static convertLogical(operator: string): string {
    const ibOperator = LOGICAL_OPERATORS[operator];
    if (!ibOperator) {
      throw new Error(`Unsupported logical operator: ${operator}`);
    }
    return ibOperator;
  }
  
  /** Convert any Python operator to IB Pseudocode */
  static convert(operator: string, variable?: string): string {
    // Try assignment operators first (if variable is provided)
    if (variable && ASSIGNMENT_OPERATORS[operator]) {
      return this.convertAssignment(operator, variable);
    }
    
    // Try other operator types
    if (COMPARISON_OPERATORS[operator]) {
      return this.convertComparison(operator);
    }
    
    if (ARITHMETIC_OPERATORS[operator]) {
      return this.convertArithmetic(operator);
    }
    
    if (LOGICAL_OPERATORS[operator]) {
      return this.convertLogical(operator);
    }
    
    if (BITWISE_OPERATORS[operator]) {
      return BITWISE_OPERATORS[operator];
    }
    
    throw new Error(`Unsupported operator: ${operator}`);
  }
  
  /** Check if operator is supported */
  static isSupported(operator: string): boolean {
    return operator in ALL_OPERATORS;
  }
  
  /** Get all supported operators */
  static getSupportedOperators(): string[] {
    return Object.keys(ALL_OPERATORS);
  }
  
  /** Expand compound assignment to full assignment */
  static expandCompoundAssignment(variable: string, operator: string, value: string): string {
    if (operator === '=') {
      return `${variable} = ${value}`;
    }
    
    const baseOperator = operator.slice(0, -1); // Remove '=' from end
    const ibOperator = this.convertArithmetic(baseOperator);
    
    return `${variable} = ${variable} ${ibOperator} ${value}`;
  }
}

/** Operator precedence for expression parsing */
export const OPERATOR_PRECEDENCE: Record<string, number> = {
  'or': 1,
  'and': 2,
  'not': 3,
  'in': 4,
  'not in': 4,
  'is': 4,
  'is not': 4,
  '<': 5,
  '<=': 5,
  '>': 5,
  '>=': 5,
  '!=': 5,
  '==': 5,
  '|': 6,
  '^': 7,
  '&': 8,
  '<<': 9,
  '>>': 9,
  '+': 10,
  '-': 10,
  '*': 11,
  '/': 11,
  '//': 11,
  '%': 11,
  '**': 12
};

/** Check if operator is left-associative */
export function isLeftAssociative(operator: string): boolean {
  return operator !== '**'; // Only ** is right-associative
}