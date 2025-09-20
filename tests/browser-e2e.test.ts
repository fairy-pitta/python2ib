import { test, expect } from '@playwright/test';

test.describe('Browser E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the demo page
    await page.goto('http://localhost:8080/demo/');
    
    // Wait for the converter to be loaded
    await page.waitForFunction(() => {
      return typeof window.Python2IB !== 'undefined' && window.Python2IB.PythonToIBConverter;
    }, { timeout: 10000 });
  });

  test('should load demo page successfully', async ({ page }) => {
    // Check if the page title is correct
    await expect(page).toHaveTitle(/Python to IB Pseudocode Converter/);
    
    // Check if main elements are present
    await expect(page.locator('h1')).toContainText('Python to IB Pseudocode Converter');
    await expect(page.locator('#input')).toBeVisible();
    await expect(page.locator('#output')).toBeVisible();
    await expect(page.locator('#convertBtn')).toBeVisible();
  });

  test('should show success message when converter loads', async ({ page }) => {
    // Wait for success message
    await expect(page.locator('.success')).toContainText('Converter loaded successfully!');
  });

  test('should convert basic Python code to IB pseudocode', async ({ page }) => {
    const pythonCode = `x = 5
y = 10
result = x + y
print(result)`;
    
    // Input Python code
    await page.fill('#input', pythonCode);
    
    // Click convert button
    await page.click('#convertBtn');
    
    // Wait for conversion to complete
    await expect(page.locator('.success')).toContainText('Conversion completed successfully!');
    
    // Check if output contains expected pseudocode
    const output = await page.locator('#output').inputValue();
    expect(output).toContain('x = 5');
    expect(output).toContain('y = 10');
    expect(output).toContain('result = x + y');
    expect(output).toContain('output result');
  });

  test('should convert if-else statement correctly', async ({ page }) => {
    const pythonCode = `age = 18
if age >= 18:
    print("Adult")
else:
    print("Minor")`;
    
    await page.fill('#input', pythonCode);
    await page.click('#convertBtn');
    
    await expect(page.locator('.success')).toContainText('Conversion completed successfully!');
    
    const output = await page.locator('#output').inputValue();
    expect(output).toContain('age = 18');
    expect(output).toContain('IF age >= 18 THEN');
    expect(output).toContain('output "Adult"');
    expect(output).toContain('ELSE');
    expect(output).toContain('output "Minor"');
    expect(output).toContain('ENDIF');
  });

  test('should convert for loop correctly', async ({ page }) => {
    const pythonCode = `for i in range(5):
    print(i)`;
    
    await page.fill('#input', pythonCode);
    await page.click('#convertBtn');
    
    await expect(page.locator('.success')).toContainText('Conversion completed successfully!');
    
    const output = await page.locator('#output').inputValue();
    expect(output).toContain('FOR i = 0 TO 4');
    expect(output).toContain('output i');
    expect(output).toContain('NEXT i');
  });

  test('should convert function definition correctly', async ({ page }) => {
    const pythonCode = `def greet(name):
    print(f"Hello, {name}!")

def add(a, b):
    return a + b`;
    
    await page.fill('#input', pythonCode);
    await page.click('#convertBtn');
    
    await expect(page.locator('.success')).toContainText('Conversion completed successfully!');
    
    const output = await page.locator('#output').inputValue();
    expect(output).toContain('PROCEDURE greet(name)');
    expect(output).toContain('ENDPROCEDURE');
    expect(output).toContain('FUNCTION add(a, b)');
    expect(output).toContain('RETURN a + b');
    expect(output).toContain('ENDFUNCTION');
  });

  test('should load example code when clicked', async ({ page }) => {
    // Click on the first example
    await page.click('.example:first-child');
    
    // Check if input field is populated
    const inputValue = await page.locator('#input').inputValue();
    expect(inputValue).toContain('x = 10');
    expect(inputValue).toContain('y = 5');
  });

  test('should clear input and output when clear button is clicked', async ({ page }) => {
    // Add some content
    await page.fill('#input', 'x = 5');
    await page.click('#convertBtn');
    
    // Wait for conversion
    await expect(page.locator('.success')).toContainText('Conversion completed successfully!');
    
    // Click clear button
    await page.click('#clearBtn');
    
    // Check if fields are cleared
    await expect(page.locator('#input')).toHaveValue('');
    await expect(page.locator('#output')).toHaveValue('');
  });

  test('should show error for empty input', async ({ page }) => {
    // Try to convert without input
    await page.click('#convertBtn');
    
    // Check for error message
    await expect(page.locator('.error')).toContainText('Please enter some Python code to convert');
  });

  test('should handle conversion errors gracefully', async ({ page }) => {
    const invalidCode = 'invalid python syntax !!!';
    
    await page.fill('#input', invalidCode);
    await page.click('#convertBtn');
    
    // Should show error message
    await expect(page.locator('.error')).toContainText('Conversion error');
    
    // Output should be empty
    await expect(page.locator('#output')).toHaveValue('');
  });

  test('should support keyboard shortcut (Ctrl+Enter)', async ({ page }) => {
    const pythonCode = 'x = 42';
    
    await page.fill('#input', pythonCode);
    
    // Use keyboard shortcut
    await page.locator('#input').press('Control+Enter');
    
    // Wait for conversion
    await expect(page.locator('.success')).toContainText('Conversion completed successfully!');
    
    const output = await page.locator('#output').inputValue();
    expect(output).toContain('x = 42');
  });

  test('should maintain state after page reload (record reload test)', async ({ page }) => {
    const pythonCode = 'test_var = 123';
    
    // Input code and convert
    await page.fill('#input', pythonCode);
    await page.click('#convertBtn');
    
    // Wait for conversion
    await expect(page.locator('.success')).toContainText('Conversion completed successfully!');
    
    // Verify initial conversion
    let output = await page.locator('#output').inputValue();
    expect(output).toContain('test_var = 123');
    
    // Reload the page
    await page.reload();
    
    // Wait for converter to load again
    await page.waitForFunction(() => {
      return typeof window.Python2IB !== 'undefined' && window.Python2IB.PythonToIBConverter;
    }, { timeout: 10000 });
    
    // Verify converter loads successfully after reload
    await expect(page.locator('.success')).toContainText('Converter loaded successfully!');
    
    // Input the same code again and verify it still works
    await page.fill('#input', pythonCode);
    await page.click('#convertBtn');
    
    // Wait for conversion
    await expect(page.locator('.success')).toContainText('Conversion completed successfully!');
    
    // Verify conversion still works correctly after reload
    output = await page.locator('#output').inputValue();
    expect(output).toContain('test_var = 123');
  });

  test('should handle multiple conversions in sequence', async ({ page }) => {
    const testCases = [
      { input: 'a = 1', expected: 'a = 1' },
      { input: 'b = 2', expected: 'b = 2' },
      { input: 'c = a + b', expected: 'c = a + b' }
    ];
    
    for (const testCase of testCases) {
      // Clear previous content
      await page.click('#clearBtn');
      
      // Input new code
      await page.fill('#input', testCase.input);
      await page.click('#convertBtn');
      
      // Wait for conversion
      await expect(page.locator('.success')).toContainText('Conversion completed successfully!');
      
      // Verify output
      const output = await page.locator('#output').inputValue();
      expect(output).toContain(testCase.expected);
    }
  });
});