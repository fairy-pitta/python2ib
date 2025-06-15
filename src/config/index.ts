import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import { ConfigurationError } from '../errors/index.js';
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
const CONFIG_FILENAMES = [
  '.python2ibrc',
  '.python2ibrc.json',
  'python2ib.config.json',
  'python2ib.config.js'
];

/**
 * Load configuration from file
 */
export function loadConfigFromFile(configPath?: string): Partial<ConvertOptions> {
  let configFilePath: string | null = null;

  if (configPath) {
    // Use specified config file
    if (!existsSync(configPath)) {
      throw new ConfigurationError(`Configuration file not found: ${configPath}`, configPath);
    }
    configFilePath = configPath;
  } else {
    // Search for config file in current directory
    for (const filename of CONFIG_FILENAMES) {
      const fullPath = join(process.cwd(), filename);
      if (existsSync(fullPath)) {
        configFilePath = fullPath;
        break;
      }
    }
  }

  if (!configFilePath) {
    return {}; // No config file found, use defaults
  }

  try {
    const configContent = readFileSync(configFilePath, 'utf8');
    
    if (configFilePath.endsWith('.js')) {
      // Handle JavaScript config files (basic support)
      throw new ConfigurationError(
        'JavaScript config files are not yet supported. Please use JSON format.',
        configFilePath
      );
    }
    
    const config = JSON.parse(configContent);
    validateConfig(config, configFilePath);
    return config;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new ConfigurationError(
        `Invalid JSON in configuration file: ${error.message}`,
        configFilePath
      );
    }
    throw error;
  }
}

/**
 * Validate configuration object
 */
function validateConfig(config: any, configPath: string): void {
  if (typeof config !== 'object' || config === null) {
    throw new ConfigurationError(
      'Configuration must be a JSON object',
      configPath
    );
  }

  // Validate indentSize
  if ('indentSize' in config) {
    if (typeof config.indentSize !== 'number' || config.indentSize < 0) {
      throw new ConfigurationError(
        'indentSize must be a non-negative number',
        configPath
      );
    }
  }

  // Validate outputFormat
  if ('outputFormat' in config) {
    if (!['plain', 'markdown'].includes(config.outputFormat)) {
      throw new ConfigurationError(
        'outputFormat must be "plain" or "markdown"',
        configPath
      );
    }
  }

  // Validate boolean fields
  const booleanFields = ['preserveComments', 'strictMode'];
  for (const field of booleanFields) {
    if (field in config && typeof config[field] !== 'boolean') {
      throw new ConfigurationError(
        `${field} must be a boolean`,
        configPath
      );
    }
  }

  // Validate nested objects
  const objectFields = ['customOperators', 'customKeywords', 'outputOptions', 'conversionRules'];
  for (const field of objectFields) {
    if (field in config && (typeof config[field] !== 'object' || config[field] === null)) {
      throw new ConfigurationError(
        `${field} must be an object`,
        configPath
      );
    }
  }
}

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
export function createSampleConfig(outputPath: string = '.python2ibrc'): void {
  const sampleConfig = {
    indentSize: 4,
    outputFormat: 'plain',
    preserveComments: true,
    strictMode: false,
    customOperators: {
      '+=': '← {left} + {right}',
      '-=': '← {left} - {right}',
      '*=': '← {left} * {right}',
      '/=': '← {left} / {right}'
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

  writeFileSync(outputPath, JSON.stringify(sampleConfig, null, 2));
}