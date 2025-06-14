import { convertPythonToIB } from './dist/index.js';

// Test complex case
const python = `# 複数構文のテスト
def factorial(n):
    if n <= 1:
        return 1
    else:
        return n * factorial(n - 1)

numbers = [1, 2, 3, 4, 5]
for num in numbers:
    print(factorial(num))

while len(numbers) > 0:
    numbers.pop()`;

console.log('=== Python Input ===');
console.log(python);
console.log('\n=== Current Output ===');
try {
    const result = convertPythonToIB(python);
    console.log(result);
} catch (error) {
    console.error('Error:', error.message);
}