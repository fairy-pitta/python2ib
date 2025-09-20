# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-01-20

### Added
- Browser support with pre-built bundle (`python2ib.min.js`)
- Browser compatibility documentation (Chrome 88+, Firefox 85+, Safari 14+, Edge 88+)
- ES module support for browser environments
- Global `PythonToIB` object for browser usage
- Demo page with live conversion functionality

### Fixed
- Fixed Node.js CI badge URL in README.md
- Resolved `[object Promise]` issue in demo page by using synchronous conversion
- Improved browser bundle configuration

### Changed
- Updated README.md with comprehensive browser usage examples
- Enhanced documentation with browser-specific installation instructions

## [1.0.1] - 2025-06-15

### Fixed
- Updated GitHub repository links in README.md to correct URL
- Fixed repository URL references throughout documentation

## [1.0.0] - 2024-01-XX

### Added
- Initial release of Python to IB Pseudocode converter
- Support for basic Python constructs:
  - Variable assignments (`x = 5` → `x ← 5`)
  - Arithmetic operations (`+`, `-`, `*`, `/`, `//`, `%`, `**`)
  - Comparison operations (`==`, `!=`, `<`, `>`, `<=`, `>=`)
  - Logical operations (`and`, `or`, `not`)
  - Output statements (`print()` → `OUTPUT`)
  - Input statements (`input()` → `INPUT`)
  - If/else statements (`if`/`else` → `IF`/`ELSE`/`ENDIF`)
  - While loops (`while` → `WHILE`/`ENDWHILE`)
  - For loops with range (`for i in range()` → `FOR`/`NEXT`)
  - Function definitions (`def` → `FUNCTION`/`PROCEDURE`)
  - Return statements (`return` → `RETURN`)
  - Comments (`#` → `//`)
  - Built-in functions (`len()`, `str()`, `int()`, `float()`)
- CLI tool with comprehensive options
- TypeScript API for programmatic use
- Configurable output formatting
- Syntax validation and error reporting
- Progress display for large files
- Configuration file support (`.python2ibrc`)
- Comprehensive test suite (60+ test cases)
- Detailed documentation and examples

### Features
- **Error Handling**: Detailed error messages for unsupported syntax
- **Performance**: Optimized for large files with progress tracking
- **Flexibility**: Multiple output formats and configuration options
- **Reliability**: Extensive test coverage ensuring quality

### Documentation
- Complete API documentation
- Usage examples and tutorials
- Limitations and troubleshooting guides
- IB Pseudocode rules reference

### Technical Details
- Built with TypeScript for type safety
- Uses Python AST parsing for accurate conversion
- Modular architecture with visitor pattern
- Comprehensive error handling and validation
- ESM module support
- Node.js 16+ compatibility