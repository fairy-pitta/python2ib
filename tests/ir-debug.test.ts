import { describe, it, expect } from 'vitest';
import { ASTParser, PythonLexer } from '../src/parser/ast-parser';
import { PythonToIRVisitor } from '../src/parser/visitor/python-to-ir-visitor';
import { IR } from '../src/types/ir';



function printIRTree(node: IR, depth = 0) {
  const indent = '  '.repeat(depth);
  console.log(`${indent}${node.kind}: "${node.text}"`);
  if (node.children && node.children.length > 0) {
    console.log(`${indent}  children (${node.children.length}):`);
    for (const child of node.children) {
      printIRTree(child, depth + 2);
    }
  }
}

describe('IR Structure Debug', () => {
  it('should debug IR structure for function definition', () => {
    const pythonCode = 'def greet(name):\n    print(f"Hello {name}")';
    console.log('=== Python Input ===');
    console.log(JSON.stringify(pythonCode));
    
    const parser = new ASTParser();
    
    // Debug tokenization
    const lexer = new PythonLexer(pythonCode);
    const tokens = lexer.tokenize();
    
    console.log('\n=== Tokens ===');
    tokens.forEach((token: any, index: number) => {
      console.log(`${index}: ${token.type} - "${token.value}" (line ${token.line})`);
    });
    
    const ast = parser.parseSync(pythonCode);
    
    console.log('\n=== AST Structure ===');
    console.log(JSON.stringify(ast, null, 2));
    
    const visitor = new PythonToIRVisitor({
      indentSize: 4,
      format: 'plain',
      indentStyle: 'spaces',
      includeLineNumbers: false,
      includeOriginalCode: false,
      validateSyntax: true,
      functionMapping: {},
      variableMapping: {}
    });
    const ir = visitor.visit(ast);
    
    console.log('\n=== IR Structure ===');
    console.log(JSON.stringify(ir, null, 2));
    
    console.log('\n=== IR Tree Structure ===');
    printIRTree(ir);
    
    expect(ir).toBeDefined();
  });
});