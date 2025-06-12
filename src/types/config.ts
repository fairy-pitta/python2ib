/**
 * Configuration types for Python to IB Pseudocode conversion
 */

/** Output format options */
export type OutputFormat = 'plain' | 'markdown';

/** Indentation style options */
export type IndentStyle = 'spaces' | 'tabs';

/** Main configuration interface */
export interface ConvertOptions {
  /** Output format (default: 'plain') */
  format?: OutputFormat;
  
  /** Indentation style (default: 'spaces') */
  indentStyle?: IndentStyle;
  
  /** Number of spaces/tabs per indent level (default: 4) */
  indentSize?: number;
  
  /** Whether to include line numbers in output (default: false) */
  includeLineNumbers?: boolean;
  
  /** Whether to include original Python code as comments (default: false) */
  includeOriginalCode?: boolean;
  
  /** Whether to validate IB Pseudocode syntax (default: true) */
  validateSyntax?: boolean;
  
  /** Whether to preserve empty lines (default: true) */
  preserveEmptyLines?: boolean;
  
  /** Enable strict mode for validation (default: false) */
  strictMode?: boolean;
  
  /** Normalize indentation in output */
  normalizeIndentation?: boolean;
  
  /** Custom variable name mappings */
  variableMapping?: Record<string, string>;
  
  /** Custom function name mappings */
  functionMapping?: Record<string, string>;
}

/** Default configuration */
export const DEFAULT_CONFIG: Required<ConvertOptions> = {
  format: 'plain',
  indentStyle: 'spaces',
  indentSize: 4,
  includeLineNumbers: false,
  includeOriginalCode: false,
  validateSyntax: true,
  preserveEmptyLines: true,
  strictMode: false,
  normalizeIndentation: false,
  variableMapping: {},
  functionMapping: {}
};

/** Merge user options with defaults */
export function mergeConfig(options?: ConvertOptions): Required<ConvertOptions> {
  return {
    ...DEFAULT_CONFIG,
    ...options,
    variableMapping: {
      ...DEFAULT_CONFIG.variableMapping,
      ...options?.variableMapping
    },
    functionMapping: {
      ...DEFAULT_CONFIG.functionMapping,
      ...options?.functionMapping
    }
  };
}

/** Validation for configuration options */
export function validateConfig(config: ConvertOptions): string[] {
  const errors: string[] = [];
  
  if (config.indentSize !== undefined && (config.indentSize < 1 || config.indentSize > 8)) {
    errors.push('indentSize must be between 1 and 8');
  }
  
  if (config.format && !['plain', 'markdown'].includes(config.format)) {
    errors.push('format must be either "plain" or "markdown"');
  }
  
  if (config.indentStyle && !['spaces', 'tabs'].includes(config.indentStyle)) {
    errors.push('indentStyle must be either "spaces" or "tabs"');
  }
  
  return errors;
}