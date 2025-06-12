#!/usr/bin/env node
/**
 * CLI tool for Python to IB Pseudocode converter
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { PythonToIBConverter, ConvertOptions } from './index.js';

/** CLI configuration */
interface CLIOptions {
  input?: string;
  output?: string;
  config?: string;
  help?: boolean;
  version?: boolean;
  validate?: boolean;
  info?: boolean;
  indent?: 'spaces' | 'tabs';
  indentSize?: number;
  strict?: boolean;
  quiet?: boolean;
  verbose?: boolean;
}

/** Parse command line arguments */
function parseArgs(args: string[]): CLIOptions {
  const options: CLIOptions = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '-h':
      case '--help':
        options.help = true;
        break;
        
      case '-v':
      case '--version':
        options.version = true;
        break;
        
      case '-i':
      case '--input':
        options.input = args[++i];
        break;
        
      case '-o':
      case '--output':
        options.output = args[++i];
        break;
        
      case '-c':
      case '--config':
        options.config = args[++i];
        break;
        
      case '--validate':
        options.validate = true;
        break;
        
      case '--info':
        options.info = true;
        break;
        
      case '--indent':
        const indentType = args[++i];
        if (indentType === 'spaces' || indentType === 'tabs') {
          options.indent = indentType;
        } else {
          console.error(`Invalid indent type: ${indentType}. Use 'spaces' or 'tabs'.`);
          process.exit(1);
        }
        break;
        
      case '--indent-size':
        const size = parseInt(args[++i], 10);
        if (isNaN(size) || size < 1 || size > 8) {
          console.error(`Invalid indent size: ${args[i]}. Use a number between 1 and 8.`);
          process.exit(1);
        }
        options.indentSize = size;
        break;
        
      case '--strict':
        options.strict = true;
        break;
        
      case '-q':
      case '--quiet':
        options.quiet = true;
        break;
        
      case '--verbose':
        options.verbose = true;
        break;
        
      default:
        if (arg.startsWith('-')) {
          console.error(`Unknown option: ${arg}`);
          process.exit(1);
        } else if (!options.input) {
          options.input = arg;
        }
        break;
    }
  }
  
  return options;
}

/** Load configuration from file */
function loadConfig(configPath: string): Partial<ConvertOptions> {
  try {
    if (!existsSync(configPath)) {
      console.error(`Configuration file not found: ${configPath}`);
      process.exit(1);
    }
    
    const configContent = readFileSync(configPath, 'utf-8');
    return JSON.parse(configContent);
  } catch (error) {
    console.error(`Failed to load configuration: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

/** Show help message */
function showHelp(): void {
  console.log(`
Python to IB Pseudocode Converter

Usage:
  python2ib [options] <input-file>
  python2ib [options] -i <input-file> -o <output-file>

Options:
  -h, --help              Show this help message
  -v, --version           Show version information
  -i, --input <file>      Input Python file
  -o, --output <file>     Output file (default: stdout)
  -c, --config <file>     Configuration file (JSON)
  --validate              Validate Python syntax only
  --info                  Show supported/unsupported constructs
  --indent <type>         Indentation type: 'spaces' or 'tabs' (default: spaces)
  --indent-size <size>    Indentation size: 1-8 (default: 4)
  --strict                Enable strict mode
  -q, --quiet             Suppress non-error output
  --verbose               Enable verbose output

Examples:
  python2ib script.py
  python2ib -i script.py -o pseudocode.txt
  python2ib --validate script.py
  python2ib --info
  python2ib --indent tabs --indent-size 2 script.py
`);
}

/** Show version information */
function showVersion(): void {
  // In a real implementation, this would read from package.json
  console.log('Python to IB Pseudocode Converter v1.0.0');
}

/** Show construct information */
function showConstructInfo(): void {
  const converter = new PythonToIBConverter();
  const supported = converter.getSupportedConstructs();
  const unsupported = converter.getUnsupportedConstructs();
  
  console.log('\nSupported Python Constructs:');
  supported.forEach(construct => console.log(`  ✓ ${construct}`));
  
  console.log('\nUnsupported Python Constructs:');
  unsupported.forEach(construct => console.log(`  ✗ ${construct}`));
  
  console.log('');
}

/** Validate Python file */
function validatePython(filePath: string, verbose: boolean): void {
  try {
    const pythonCode = readFileSync(filePath, 'utf-8');
    const converter = new PythonToIBConverter();
    const result = converter.validateSyntax(pythonCode);
    
    if (result.isValid) {
      if (verbose) {
        console.log(`✓ ${filePath}: Valid Python syntax`);
      }
      process.exit(0);
    } else {
      console.error(`✗ ${filePath}: Invalid Python syntax`);
      result.errors.forEach(error => console.error(`  ${error}`));
      process.exit(1);
    }
  } catch (error) {
    console.error(`Failed to validate ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}



/** Main CLI function */
function main(): void {
  const args = process.argv.slice(2);
  const options = parseArgs(args);
  
  // Handle special commands
  if (options.help) {
    showHelp();
    return;
  }
  
  if (options.version) {
    showVersion();
    return;
  }
  
  if (options.info) {
    showConstructInfo();
    return;
  }
  
  // Validate input
  if (!options.input) {
    console.error('Error: No input file specified. Use --help for usage information.');
    process.exit(1);
  }
  
  const inputPath = resolve(options.input);
  
  if (!existsSync(inputPath)) {
    console.error(`Error: Input file not found: ${inputPath}`);
    process.exit(1);
  }
  
  // Handle validation mode
  if (options.validate) {
    validatePython(inputPath, options.verbose || false);
    return;
  }
  
  try {
    // Load configuration
    let config: Partial<ConvertOptions> = {};
    
    if (options.config) {
      config = loadConfig(options.config);
    }
    
    // Override with CLI options
    if (options.indent) {
      config.indentStyle = options.indent;
    }
    
    if (options.indentSize) {
      config.indentSize = options.indentSize;
    }
    
    if (options.strict) {
      config.strictMode = true;
    }
    
    // Read input file
    const pythonCode = readFileSync(inputPath, 'utf-8');
    
    if (options.verbose) {
      console.error(`Reading from: ${inputPath}`);
    }
    
    // Convert
    const converter = new PythonToIBConverter(config);
    const pseudocode = converter.convertSync(pythonCode);
    
    // Output
    if (options.output) {
      const outputPath = resolve(options.output);
      writeFileSync(outputPath, pseudocode, 'utf-8');
      
      if (!options.quiet) {
        console.error(`Output written to: ${outputPath}`);
      }
    } else {
      // Output to stdout
      console.log(pseudocode);
    }
    
    if (options.verbose) {
      console.error('Conversion completed successfully.');
    }
    
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

// Run CLI if this file is executed directly
if (require.main === module) {
  main();
}

export { main as runCLI, parseArgs, loadConfig };