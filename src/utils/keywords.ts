/**
 * Keyword conversion mappings for Python to IB Pseudocode
 */

/** Python keywords to IB Pseudocode mapping */
export const KEYWORD_MAPPING: Record<string, string> = {
  // Control flow
  'if': 'IF',
  'elif': 'ELSEIF',
  'else': 'ELSE',
  'while': 'WHILE',
  'for': 'FOR',
  'break': 'BREAK',
  'continue': 'CONTINUE',
  'pass': '// pass',
  
  // Functions
  'def': 'PROCEDURE', // Will be changed to FUNCTION if return is detected
  'return': 'RETURN',
  'yield': 'YIELD',
  
  // Exception handling
  'try': 'TRY',
  'except': 'EXCEPT',
  'finally': 'FINALLY',
  'raise': 'RAISE',
  
  // Boolean values
  'True': 'TRUE',
  'False': 'FALSE',
  'None': 'NULL',
  
  // Logical operators (handled in operators.ts but included for reference)
  'and': 'AND',
  'or': 'OR',
  'not': 'NOT',
  
  // Import statements (not directly supported in IB Pseudocode)
  'import': '// import',
  'from': '// from',
  'as': '// as',
  
  // Class-related (not supported in basic IB Pseudocode)
  'class': '// class',
  'self': 'this',
  
  // Other keywords
  'global': '// global',
  'nonlocal': '// nonlocal',
  'lambda': '// lambda',
  'with': '// with',
  'assert': '// assert',
  'del': '// del'
};

/** Built-in function mappings */
export const BUILTIN_FUNCTION_MAPPING: Record<string, string> = {
  'print': 'output',
  'input': 'INPUT',
  'len': 'SIZE',
  'str': 'STRING',
  'int': 'INTEGER',
  'float': 'REAL',
  'bool': 'BOOLEAN',
  'list': 'ARRAY',
  'dict': 'COLLECTION',
  'set': 'SET',
  'tuple': 'TUPLE',
  'range': 'RANGE',
  'enumerate': 'ENUMERATE',
  'zip': 'ZIP',
  'map': 'MAP',
  'filter': 'FILTER',
  'sum': 'SUM',
  'max': 'MAX',
  'min': 'MIN',
  'abs': 'ABS',
  'round': 'ROUND',
  'sorted': 'SORTED',
  'reversed': 'REVERSED'
};

/** Data type mappings */
export const TYPE_MAPPING: Record<string, string> = {
  'int': 'INTEGER',
  'float': 'REAL',
  'str': 'STRING',
  'bool': 'BOOLEAN',
  'list': 'ARRAY',
  'dict': 'COLLECTION',
  'set': 'SET',
  'tuple': 'TUPLE',
  'NoneType': 'NULL'
};

/** IB Pseudocode reserved words that should not be used as variable names */
export const IB_RESERVED_WORDS = new Set([
  'IF', 'ELSEIF', 'ELSE', 'ENDIF',
  'WHILE', 'ENDWHILE',
  'FOR', 'TO', 'STEP', 'NEXT',
  'PROCEDURE', 'ENDPROCEDURE',
  'FUNCTION', 'ENDFUNCTION', 'RETURNS',
  'TRY', 'EXCEPT', 'ENDTRY',
  'INPUT', 'output',
  'AND', 'OR', 'NOT',
  'TRUE', 'FALSE', 'NULL',
  'INTEGER', 'REAL', 'STRING', 'BOOLEAN',
  'ARRAY', 'COLLECTION', 'SET', 'TUPLE',
  'DIV', 'MOD',
  'BREAK', 'CONTINUE', 'RETURN'
]);

/** Keyword conversion utilities */
export class KeywordConverter {
  /** Convert Python keyword to IB Pseudocode */
  static convertKeyword(keyword: string): string {
    const ibKeyword = KEYWORD_MAPPING[keyword];
    if (!ibKeyword) {
      throw new Error(`Unsupported keyword: ${keyword}`);
    }
    return ibKeyword;
  }
  
  /** Convert Python built-in function to IB Pseudocode */
  static convertBuiltinFunction(functionName: string): string {
    const ibFunction = BUILTIN_FUNCTION_MAPPING[functionName];
    if (!ibFunction) {
      throw new Error(`Unsupported built-in function: ${functionName}`);
    }
    return ibFunction;
  }
  
  /** Convert Python type to IB Pseudocode type */
  static convertType(typeName: string): string {
    const ibType = TYPE_MAPPING[typeName];
    if (!ibType) {
      return typeName.toUpperCase(); // Fallback to uppercase
    }
    return ibType;
  }
  
  /** Check if a keyword is supported */
  static isKeywordSupported(keyword: string): boolean {
    return keyword in KEYWORD_MAPPING;
  }
  
  /** Check if a built-in function is supported */
  static isBuiltinSupported(functionName: string): boolean {
    return functionName in BUILTIN_FUNCTION_MAPPING;
  }
  
  /** Check if a variable name conflicts with IB reserved words */
  static isReservedWord(name: string): boolean {
    return IB_RESERVED_WORDS.has(name.toUpperCase());
  }
  
  /** Suggest alternative name if variable conflicts with reserved word */
  static suggestAlternativeName(name: string): string {
    if (!this.isReservedWord(name)) {
      return name;
    }
    
    // Add underscore suffix to avoid conflict
    let alternative = name + '_';
    let counter = 1;
    
    while (this.isReservedWord(alternative)) {
      alternative = name + '_' + counter;
      counter++;
    }
    
    return alternative;
  }
  
  /** Get all supported keywords */
  static getSupportedKeywords(): string[] {
    return Object.keys(KEYWORD_MAPPING);
  }
  
  /** Get all supported built-in functions */
  static getSupportedBuiltins(): string[] {
    return Object.keys(BUILTIN_FUNCTION_MAPPING);
  }
  
  /** Convert Python boolean literal to IB Pseudocode */
  static convertBooleanLiteral(value: boolean): string {
    return value ? 'TRUE' : 'FALSE';
  }
  
  /** Convert Python None to IB Pseudocode */
  static convertNone(): string {
    return 'NULL';
  }
}

/** Special handling for specific Python constructs */
export const SPECIAL_CONSTRUCTS = {
  /** Handle print() function conversion */
  convertPrint(args: string[]): string {
    if (args.length === 0) {
      return 'output ""';
    }
    if (args.length === 1) {
      return `output ${args[0]}`;
    }
    // Multiple arguments - join with spaces
    return `output ${args.join(' + " " + ')}`;
  },
  
  /** Handle input() function conversion */
  convertInput(prompt?: string): string {
    if (prompt) {
      return `OUTPUT ${prompt}\nINPUT`;
    }
    return 'INPUT';
  },
  
  /** Convert range() call to IB Pseudocode FOR loop parameters */
  convertRange(args: string[]): { start: string; end: string; step?: string } {
    const calculateEnd = (endArg: string): string => {
      // Try to parse as number and subtract 1
      const num = parseInt(endArg, 10);
      if (!isNaN(num)) {
        return (num - 1).toString();
      }
      // If expression already contains subtraction at the end, increment the number
      if (endArg.match(/ - \d+$/)) {
        return endArg.replace(/ - (\d+)$/, (_, num) => ` - ${parseInt(num) + 1}`);
      }
      // If expression contains subtraction but not at the end, wrap and subtract 1
      if (endArg.includes(' - ')) {
        return `(${endArg}) - 1`;
      }
      // If not a number, return expression
      return `${endArg} - 1`;
    };
    
    if (args.length === 1) {
      // range(n) -> 0 to n-1
      return { start: '0', end: calculateEnd(args[0]) };
    } else if (args.length === 2) {
      // range(start, end) -> start to end-1
      return { start: args[0], end: calculateEnd(args[1]) };
    } else if (args.length === 3) {
      // range(start, end, step) -> start to end-1 step step
      return { start: args[0], end: calculateEnd(args[1]), step: args[2] };
    }
    
    // Default case
    return { start: '0', end: '0' };
  },
  
  /** Handle len() function conversion */
  convertLen(arg: string): string {
    return `SIZE(${arg})`;
  }
};