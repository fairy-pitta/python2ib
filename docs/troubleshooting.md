# Troubleshooting Guide

## Common Issues and Solutions

### Installation Issues

#### Issue: `npm install python2ib` fails

**Symptoms:**
```bash
npm ERR! 404 Not Found - GET https://registry.npmjs.org/python2ib
```

**Solution:**
1. Ensure you have Node.js 16+ installed
2. Check if the package name is correct
3. Try clearing npm cache: `npm cache clean --force`
4. If installing from source: `npm install` in the project directory

#### Issue: TypeScript compilation errors

**Symptoms:**
```bash
Error: Cannot find module 'python2ib' or its corresponding type declarations
```

**Solution:**
1. Ensure TypeScript is installed: `npm install -g typescript`
2. Check your `tsconfig.json` includes the correct module resolution
3. Try: `npm install @types/node`

### Conversion Issues

#### Issue: "Unsupported syntax" error

**Symptoms:**
```bash
UnsupportedSyntaxError: Class definitions are not supported
```

**Solution:**
1. Check the [limitations.md](./limitations.md) for unsupported features
2. Refactor your code to use supported constructs
3. Example fix:
   ```python
   # ❌ Unsupported
   class Calculator:
       def add(self, a, b):
           return a + b
   
   # ✅ Supported
   def add(a, b):
       return a + b
   ```

#### Issue: Incorrect pseudocode output

**Symptoms:**
- Missing END statements
- Wrong indentation
- Incorrect operator conversion

**Solution:**
1. Check input Python syntax is correct
2. Verify the Python code follows IB-compatible patterns
3. Example debugging:
   ```python
   # Input
   def greet(name):
       print(f"Hello {name}")
   
   # Expected output
   PROCEDURE greet(name)
       OUTPUT "Hello " + name
   ENDPROCEDURE
   ```

#### Issue: Function vs Procedure detection

**Symptoms:**
```python
# This function should be PROCEDURE but shows as FUNCTION
def print_message(msg):
    print(msg)
    return  # Empty return
```

**Solution:**
1. Remove empty `return` statements for procedures
2. Use explicit `return value` for functions
3. Example fix:
   ```python
   # ✅ Procedure (no return)
   def print_message(msg):
       print(msg)
   
   # ✅ Function (with return value)
   def get_message(name):
       return f"Hello {name}"
   ```

### CLI Issues

#### Issue: Command not found

**Symptoms:**
```bash
bash: python2ib: command not found
```

**Solution:**
1. Install globally: `npm install -g python2ib`
2. Or use npx: `npx python2ib input.py`
3. Check PATH includes npm global bin directory

#### Issue: File not found

**Symptoms:**
```bash
Error: ENOENT: no such file or directory, open 'input.py'
```

**Solution:**
1. Check file path is correct
2. Use absolute paths if needed
3. Ensure file has read permissions

#### Issue: Output file creation fails

**Symptoms:**
```bash
Error: EACCES: permission denied, open 'output.txt'
```

**Solution:**
1. Check write permissions in target directory
2. Use a different output location
3. Run with appropriate permissions

### API Usage Issues

#### Issue: Import errors in TypeScript

**Symptoms:**
```typescript
// ❌ This doesn't work
import { convertPythonToIB } from 'python2ib/converter';
```

**Solution:**
```typescript
// ✅ Correct import
import { convertPythonToIB } from 'python2ib';

// ✅ For parser functions
import { parseToIR } from 'python2ib/parser';
```

#### Issue: Runtime errors with complex Python code

**Symptoms:**
```bash
SyntaxError: Unexpected token in Python code
```

**Solution:**
1. Validate Python syntax first:
   ```python
   python -m py_compile your_file.py
   ```
2. Simplify complex expressions
3. Check for unsupported syntax

### Performance Issues

#### Issue: Slow conversion for large files

**Symptoms:**
- Conversion takes more than 30 seconds
- High memory usage

**Solution:**
1. Break large files into smaller modules
2. Remove unnecessary comments and whitespace
3. Use streaming for very large files:
   ```typescript
   import { createReadStream } from 'fs';
   import { convertPythonToIB } from 'python2ib';
   
   // Process file in chunks
   const stream = createReadStream('large_file.py', { encoding: 'utf8' });
   ```

#### Issue: Memory errors

**Symptoms:**
```bash
JavaScript heap out of memory
```

**Solution:**
1. Increase Node.js memory limit:
   ```bash
   node --max-old-space-size=4096 your_script.js
   ```
2. Process files in smaller batches
3. Clear variables after processing

### Output Format Issues

#### Issue: Incorrect indentation

**Symptoms:**
```
// Wrong indentation
IF x > 0
OUTPUT "positive"
ENDIF
```

**Solution:**
1. Check indentSize option:
   ```typescript
   convertPythonToIB(code, { indentSize: 4 });
   ```
2. Verify input Python has consistent indentation

#### Issue: Missing operators conversion

**Symptoms:**
```python
# Input
x += 5

# Wrong output
x += 5

# Expected output
x ← x + 5
```

**Solution:**
1. This should work automatically - report as bug if not
2. Workaround: use explicit assignment
   ```python
   x = x + 5
   ```

## Debugging Tips

### Enable Debug Mode

```typescript
import { convertPythonToIB, parseToIR } from 'python2ib';

// 1. Check IR generation
const ir = parseToIR(pythonCode);
console.log('IR:', JSON.stringify(ir, null, 2));

// 2. Check final output
const result = convertPythonToIB(pythonCode);
console.log('Result:', result);
```

### Validate Input

```python
# Test with minimal example first
def test():
    x = 5
    print(x)

test()
```

### Check Python Syntax

```bash
# Validate Python syntax
python -c "import ast; ast.parse(open('your_file.py').read())"
```

### Step-by-step Debugging

1. **Start simple**: Test with basic assignments
2. **Add complexity gradually**: Add control structures one by one
3. **Check each step**: Verify output at each stage
4. **Isolate issues**: Comment out problematic sections

## Getting Help

### Before Reporting Issues

1. **Check this troubleshooting guide**
2. **Review [limitations.md](./limitations.md)**
3. **Test with minimal example**
4. **Check existing issues on GitHub**

### Reporting Bugs

When reporting issues, include:

1. **Python input code** (minimal example)
2. **Expected output**
3. **Actual output**
4. **Error messages** (full stack trace)
5. **Environment info**:
   ```bash
   node --version
   npm --version
   npm list python2ib
   ```

### Community Support

- **GitHub Issues**: [https://github.com/fairy-pitta/python2ib/issues](https://github.com/fairy-pitta/python2ib/issues)
- **Discussions**: [https://github.com/fairy-pitta/python2ib/discussions](https://github.com/fairy-pitta/python2ib/discussions)

## FAQ

### Q: Why doesn't my class convert?
**A:** Classes are not supported. Use functions instead. See [limitations.md](./limitations.md).

### Q: Can I convert Jupyter notebooks?
**A:** Extract the Python code from cells first, then convert each cell separately.

### Q: How do I handle imports?
**A:** Remove import statements and include necessary functions directly in your code.

### Q: Why is the output different from expected IB format?
**A:** The converter follows standard IB pseudocode conventions. Check the [IB-pseudocode-rules.md](./IB-pseudocode-rules.md) for reference.

### Q: Can I customize the output format?
**A:** Yes, use the options parameter:
```typescript
convertPythonToIB(code, {
  indentSize: 2,
  outputFormat: 'markdown'
});
```