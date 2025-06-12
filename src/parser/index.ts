/**
 * Main parser entry point for Python to IB Pseudocode conversion
 */

import { IR } from '../types/ir.js';
import { ConvertOptions, mergeConfig } from '../types/config.js';
import { ASTParser } from './ast-parser.js';
import { PythonToIRVisitor } from './visitor/python-to-ir-visitor.js';

/** Main parser class */
export class Parser {
  private astParser: ASTParser;
  private visitor: PythonToIRVisitor;
  
  constructor(options?: ConvertOptions) {
    const config = mergeConfig(options);
    this.astParser = new ASTParser();
    this.visitor = new PythonToIRVisitor(config);
  }
  
  /** Parse Python code and convert to IR */
  async parse(pythonCode: string): Promise<IR> {
    try {
      // Step 1: Parse Python code to AST
      const ast = await this.astParser.parse(pythonCode);
      
      // Step 2: Convert AST to IR using visitor pattern
      const ir = this.visitor.visit(ast);
      
      return ir;
    } catch (error) {
      throw new Error(`Parser error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /** Parse Python code synchronously (for simple cases) */
  parseSync(pythonCode: string): IR {
    try {
      // Step 1: Parse Python code to AST
      const ast = this.astParser.parseSync(pythonCode);
      
      // Step 2: Convert AST to IR using visitor pattern
      const ir = this.visitor.visit(ast);
      
      return ir;
    } catch (error) {
      throw new Error(`Parser error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /** Validate Python syntax without full parsing */
  validateSyntax(pythonCode: string): { isValid: boolean; errors: string[] } {
    try {
      this.astParser.parseSync(pythonCode);
      return { isValid: true, errors: [] };
    } catch (error) {
      return {
        isValid: false,
        errors: [error instanceof Error ? error.message : String(error)]
      };
    }
  }
  
  /** Get supported Python constructs */
  getSupportedConstructs(): string[] {
    return [
      'Variable assignment (x = 5)',
      'Print statements (print(x))',
      'Input statements (input())',
      'If/elif/else statements',
      'While loops',
      'For loops with range()',
      'Function definitions (def)',
      'Return statements',
      'Comments',
      'Basic arithmetic operations',
      'Comparison operations',
      'Logical operations',
      'Compound assignment (+=, -=, etc.)'
    ];
  }
  
  /** Get unsupported Python constructs */
  getUnsupportedConstructs(): string[] {
    return [
      'List comprehensions',
      'Lambda functions',
      'Class definitions',
      'Decorators',
      'Context managers (with statements)',
      'Generators',
      'Async/await',
      'Match/case statements',
      'Complex imports',
      'Exception handling (try/except) - partial support'
    ];
  }
}

/** Convenience function for quick parsing */
export async function parsePython(pythonCode: string, options?: ConvertOptions): Promise<IR> {
  const parser = new Parser(options);
  return parser.parse(pythonCode);
}

/** Convenience function for synchronous parsing */
export function parsePythonSync(pythonCode: string, options?: ConvertOptions): IR {
  const parser = new Parser(options);
  return parser.parseSync(pythonCode);
}