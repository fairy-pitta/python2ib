// Browser version - ConfigurationError import removed
import type { ConvertOptions } from '../types/config.js';
import { DEFAULT_CONFIG as BASE_DEFAULT_CONFIG } from '../types/config.js';

/**
 * Default configuration
 */
export const DEFAULT_CONFIG: Required<ConvertOptions> = {
  ...BASE_DEFAULT_CONFIG
};

/**
 * Configuration file names to search for
 */
// Browser version - config file names not used
// const CONFIG_FILENAMES = ['.python2ibrc', '.python2ibrc.json', 'python2ib.config.json', 'python2ib.config.js'];

/**
 * Load configuration from file (Browser version - returns empty config)
 * In browser environment, configuration files are not supported
 */
export function loadConfigFromFile(configPath?: string): Partial<ConvertOptions> {
  // In browser environment, we cannot read files from filesystem
  // Return empty config to use defaults
  if (configPath) {
    console.warn('Configuration files are not supported in browser environment. Using default configuration.');
  }
  return {};
}

/**
 * Validate configuration object
 */
// Browser version - config validation disabled
// function validateConfig(config: any, configPath: string): void { ... }

/**
 * Merge configuration with defaults
 */
export function mergeConfig(
  userConfig: Partial<ConvertOptions> = {},
  fileConfig: Partial<ConvertOptions> = {}
): Required<ConvertOptions> {
  return {
    ...DEFAULT_CONFIG,
    ...fileConfig,
    ...userConfig,
    // Deep merge nested objects
    customOperators: {
      ...DEFAULT_CONFIG.customOperators,
      ...fileConfig.customOperators,
      ...userConfig.customOperators
    },
    customKeywords: {
      ...DEFAULT_CONFIG.customKeywords,
      ...fileConfig.customKeywords,
      ...userConfig.customKeywords
    },
    outputOptions: {
      ...DEFAULT_CONFIG.outputOptions,
      ...fileConfig.outputOptions,
      ...userConfig.outputOptions
    },
    conversionRules: {
      ...DEFAULT_CONFIG.conversionRules,
      ...fileConfig.conversionRules,
      ...userConfig.conversionRules
    }
  };
}

/**
 * Get final configuration by merging defaults, file config, and user options
 */
export function getConfig(
  userOptions: Partial<ConvertOptions> = {},
  configPath?: string
): Required<ConvertOptions> {
  const fileConfig = loadConfigFromFile(configPath);
  return mergeConfig(userOptions, fileConfig);
}

/**
 * Create a sample configuration file
 */
export function createSampleConfig(): string {
  const sampleConfig = {
    indentSize: 4,
    outputFormat: 'plain',
    preserveComments: true,
    strictMode: false,
    customOperators: {
      '+=': '{left} = {left} + {right}',
      '-=': '{left} = {left} - {right}',
      '*=': '{left} = {left} * {right}',
      '/=': '{left} = {left} / {right}'
    },
    customKeywords: {
      print: 'OUTPUT',
      input: 'INPUT',
      len: 'LENGTH',
      range: 'RANGE'
    },
    outputOptions: {
      includeLineNumbers: false,
      includeComments: true,
      wrapInCodeBlock: false
    },
    conversionRules: {
      forceExplicitTypes: false,
      convertFStrings: true,
      expandCompoundAssignments: true,
      simplifyExpressions: false
    }
  };

  // In browser environment, return the config as string instead of writing to file
  return JSON.stringify(sampleConfig, null, 2);
}