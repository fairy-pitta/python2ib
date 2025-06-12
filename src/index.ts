/**
 * Main API for Python to IB Pseudocode converter
 */

/**
 * Main entry point for the Python to IB Pseudocode converter
 */

// Export main converter functions
export * from './converter.js';

// Export types
export * from './types/ir.js';
export * from './types/config.js';

// Export utilities
export * from './utils/keywords.js';
export * from './utils/operators.js';
export * from './utils/indent.js';

// Export parser
export * from './parser/index.js';

// Export emitter
export * from './emitter/index.js';

import { Parser } from './parser/index.js';
import { IBPseudocodeEmitter, emitIBPseudocode } from './emitter/index.js';
import { ConvertOptions, mergeConfig, validateConfig } from './types/config.js';
import { IR } from './types/ir.js';

/** Main converter class */
export class PythonToIBConverter {
  private config: Required<ConvertOptions>;
  private parser: Parser;
  private emitter: IBPseudocodeEmitter;
  
  constructor(options: Partial<ConvertOptions> = {}) {
    this.config = mergeConfig(options);
    const errors = validateConfig(this.config);
    if (errors.length > 0) {
      throw new Error(`Invalid configuration: ${errors.join(', ')}`);
    }
    
    this.parser = new Parser(this.config);
    this.emitter = new IBPseudocodeEmitter(this.config);
  }
  
  /** Convert Python code to IB Pseudocode (async) */
  async convert(pythonCode: string): Promise<string> {
    try {
      const ir = await this.parser.parse(pythonCode);
      return this.emitter.emit(ir);
    } catch (error) {
      throw new Error(`Conversion failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /** Convert Python code to IB Pseudocode (sync) */
  convertSync(pythonCode: string): string {
    try {
      const ir = this.parser.parseSync(pythonCode);
      return this.emitter.emit(ir);
    } catch (error) {
      throw new Error(`Conversion failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /** Convert Python code to IR only */
  async parseToIR(pythonCode: string): Promise<IR> {
    return this.parser.parse(pythonCode);
  }
  
  /** Convert Python code to IR only (sync) */
  parseToIRSync(pythonCode: string): IR {
    return this.parser.parseSync(pythonCode);
  }
  
  /** Convert IR to IB Pseudocode */
  emitFromIR(ir: IR): string {
    return this.emitter.emit(ir);
  }
  
  /** Validate Python syntax */
  validateSyntax(pythonCode: string): { isValid: boolean; errors: string[] } {
    return this.parser.validateSyntax(pythonCode);
  }
  
  /** Get supported Python constructs */
  getSupportedConstructs(): string[] {
    return this.parser.getSupportedConstructs();
  }
  
  /** Get unsupported Python constructs */
  getUnsupportedConstructs(): string[] {
    return this.parser.getUnsupportedConstructs();
  }
  
  /** Update configuration */
  updateConfig(options: Partial<ConvertOptions>): void {
    this.config = mergeConfig({ ...this.config, ...options });
    const errors = validateConfig(this.config);
    if (errors.length > 0) {
      throw new Error(`Invalid configuration: ${errors.join(', ')}`);
    }
    
    // Recreate parser and emitter with new config
    this.parser = new Parser(this.config);
    this.emitter = new IBPseudocodeEmitter(this.config);
  }
  
  /** Get current configuration */
  getConfig(): Required<ConvertOptions> {
    return { ...this.config };
  }
  
  /** Reset converter state */
  reset(): void {
    this.emitter.reset();
  }
}

/** Convenience functions */

/** Convert Python to IB Pseudocode with default settings (sync) */
export function convertPythonToIB(pythonCode: string, options: Partial<ConvertOptions> = {}): string {
  const converter = new PythonToIBConverter(options);
  return converter.convertSync(pythonCode);
}

/** Convert Python to IB Pseudocode with default settings (sync) */
export function convertPythonToIBSync(pythonCode: string, options: Partial<ConvertOptions> = {}): string {
  const converter = new PythonToIBConverter(options);
  return converter.convertSync(pythonCode);
}

/** Parse Python to IR with default settings (async) */
export async function parsePythonToIR(pythonCode: string, options: Partial<ConvertOptions> = {}): Promise<IR> {
  const converter = new PythonToIBConverter(options);
  return converter.parseToIR(pythonCode);
}

/** Parse Python to IR with default settings (sync) */
export function parsePythonToIRSync(pythonCode: string, options: Partial<ConvertOptions> = {}): IR {
  const converter = new PythonToIBConverter(options);
  return converter.parseToIRSync(pythonCode);
}

/** Emit IR to IB Pseudocode with custom options */
export function emitIRToIB(ir: IR, options: Partial<ConvertOptions> = {}): string {
  const config = mergeConfig(options);
  return emitIBPseudocode(ir, config);
}

/** Quick conversion with minimal setup */
export function quickConvert(pythonCode: string): string {
  return convertPythonToIBSync(pythonCode);
}

/** Validate Python code syntax */
export function validatePythonSyntax(pythonCode: string): { isValid: boolean; errors: string[] } {
  const converter = new PythonToIBConverter();
  return converter.validateSyntax(pythonCode);
}

/** Get information about supported/unsupported constructs */
export function getConstructInfo(): {
  supported: string[];
  unsupported: string[];
} {
  const converter = new PythonToIBConverter();
  return {
    supported: converter.getSupportedConstructs(),
    unsupported: converter.getUnsupportedConstructs()
  };
}

// Re-export types and utilities
// Temporarily disabled to fix module resolution issues
// export type { ConvertOptions, OutputFormat, IndentStyle } from './types/config.js';
// export type { IR, IRKind, IRMeta } from './types/ir.js';
// export { DEFAULT_CONFIG, mergeConfig, validateConfig } from './types/config.js';
// export { IRFactory } from './types/ir.js';
// export { Parser, parsePython, parsePythonSync } from './parser/index.js';
// export { IBPseudocodeEmitter, emitIBPseudocode, emitIBPseudocodeDefault } from './emitter/index.js';
// export { PythonToIRVisitor } from './parser/visitor/python-to-ir-visitor.js';
// export { BaseVisitor, VisitorUtils } from './parser/visitor/base-visitor.js';
// export { IndentManager, IndentUtils } from './utils/indent.js';
// export { OperatorConverter } from './utils/operators.js';
// export { KeywordConverter, SPECIAL_CONSTRUCTS } from './utils/keywords.js';

// Default export
export default PythonToIBConverter;