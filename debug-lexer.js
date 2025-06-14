import { PythonLexer } from './dist/parser/ast-parser.js';

const python = `for num in numbers:
    print(num)`;

console.log('=== Python Input ===');
console.log(python);
console.log();

try {
    const lexer = new PythonLexer(python);
    const tokens = lexer.tokenize();
    console.log('=== Tokens ===');
    tokens.forEach((token, index) => {
        console.log(`${index}: ${token.type} = "${token.value}"`);
    });
} catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
}