import { parsePythonSync } from './parser/index.js';
import { emitIBPseudocode } from './emitter/index.js';
import { ConvertOptions, DEFAULT_CONFIG } from './types/config.js';

/**
 * Convert Python code to IB Pseudocode format
 * @param pythonCode - The Python source code to convert
 * @param options - Conversion options (optional)
 * @returns The converted IB Pseudocode as a string
 */
export function convertPythonToIB(pythonCode: string, options?: ConvertOptions): string {
  try {
    // Merge options with defaults
    const config = { ...DEFAULT_CONFIG, ...options };
    
    // Step 1: Parse Python code to IR (Intermediate Representation)
    const ir = parsePythonSync(pythonCode, config);
    
    // Step 2: Emit IB Pseudocode from IR
    const pseudocode = emitIBPseudocode(ir, config);
    
    return pseudocode;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Python to IB conversion failed: ${error.message}`);
    }
    throw new Error('Python to IB conversion failed: Unknown error');
  }
}

/**
 * Convert Python code to IB Pseudocode with default options
 * @param pythonCode - The Python source code to convert
 * @returns The converted IB Pseudocode as a string
 */
export function convertPythonToIBDefault(pythonCode: string): string {
  return convertPythonToIB(pythonCode, DEFAULT_CONFIG);
}

/**
 * Validate Python code syntax before conversion
 * @param pythonCode - The Python source code to validate
 * @returns true if valid, throws error if invalid
 */
export function validatePythonCode(pythonCode: string): boolean {
  try {
    parsePythonSync(pythonCode);
    return true;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Invalid Python syntax: ${error.message}`);
    }
    throw new Error('Invalid Python syntax: Unknown error');
  }
}