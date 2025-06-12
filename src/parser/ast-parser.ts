/**
 * Python AST parser using a simple recursive descent approach
 * This is a simplified parser for educational Python constructs
 */

/** Python AST node types */
export interface PythonASTNode {
  type: string;
  lineno?: number;
  col_offset?: number;
  [key: string]: any;
}

/** Token types for lexical analysis */
export enum TokenType {
  // Literals
  NUMBER = 'NUMBER',
  STRING = 'STRING',
  IDENTIFIER = 'IDENTIFIER',
  
  // Keywords
  IF = 'IF',
  ELIF = 'ELIF',
  ELSE = 'ELSE',
  WHILE = 'WHILE',
  FOR = 'FOR',
  DEF = 'DEF',
  RETURN = 'RETURN',
  PRINT = 'PRINT',
  INPUT = 'INPUT',
  IN = 'IN',
  AND = 'AND',
  OR = 'OR',
  NOT = 'NOT',
  TRUE = 'TRUE',
  FALSE = 'FALSE',
  NONE = 'NONE',
  
  // Operators
  ASSIGN = 'ASSIGN',
  PLUS = 'PLUS',
  MINUS = 'MINUS',
  MULTIPLY = 'MULTIPLY',
  DIVIDE = 'DIVIDE',
  FLOOR_DIVIDE = 'FLOOR_DIVIDE',
  MODULO = 'MODULO',
  POWER = 'POWER',
  EQUAL = 'EQUAL',
  NOT_EQUAL = 'NOT_EQUAL',
  LESS = 'LESS',
  LESS_EQUAL = 'LESS_EQUAL',
  GREATER = 'GREATER',
  GREATER_EQUAL = 'GREATER_EQUAL',
  
  // Compound assignment
  PLUS_ASSIGN = 'PLUS_ASSIGN',
  MINUS_ASSIGN = 'MINUS_ASSIGN',
  MULTIPLY_ASSIGN = 'MULTIPLY_ASSIGN',
  DIVIDE_ASSIGN = 'DIVIDE_ASSIGN',
  
  // Delimiters
  LPAREN = 'LPAREN',
  RPAREN = 'RPAREN',
  LBRACKET = 'LBRACKET',
  RBRACKET = 'RBRACKET',
  COMMA = 'COMMA',
  COLON = 'COLON',
  
  // Special
  NEWLINE = 'NEWLINE',
  INDENT = 'INDENT',
  DEDENT = 'DEDENT',
  COMMENT = 'COMMENT',
  EOF = 'EOF'
}

/** Token interface */
export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

/** Simple lexer for Python code */
export class PythonLexer {
  private code: string;
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;
  private tokens: Token[] = [];
  
  constructor(code: string) {
    this.code = code;
  }
  
  /** Tokenize the Python code */
  tokenize(): Token[] {
    this.tokens = [];
    this.position = 0;
    this.line = 1;
    this.column = 1;
    let atLineStart = true;
    
    while (this.position < this.code.length) {
      // Handle indentation at the start of lines
      if (atLineStart) {
        this.handleIndentation();
        atLineStart = false;
      }
      
      this.skipWhitespace();
      
      if (this.position >= this.code.length) break;
      
      const char = this.code[this.position];
      
      // Comments
      if (char === '#') {
        this.readComment();
        continue;
      }
      
      // Newlines
      if (char === '\n') {
        this.addToken(TokenType.NEWLINE, char);
        this.advance();
        this.line++;
        this.column = 1;
        atLineStart = true;
        continue;
      }
      
      // Numbers
      if (this.isDigit(char)) {
        this.readNumber();
        continue;
      }
      
      // Strings
      if (char === '"' || char === "'") {
        this.readString();
        continue;
      }
      
      // Identifiers and keywords
      if (this.isAlpha(char) || char === '_') {
        this.readIdentifier();
        continue;
      }
      
      // Two-character operators
      if (this.position + 1 < this.code.length) {
        const twoChar = this.code.substr(this.position, 2);
        const tokenType = this.getTwoCharOperator(twoChar);
        if (tokenType) {
          this.addToken(tokenType, twoChar);
          this.advance(2);
          continue;
        }
      }
      
      // Single-character operators and delimiters
      const tokenType = this.getSingleCharOperator(char);
      if (tokenType) {
        this.addToken(tokenType, char);
        this.advance();
        continue;
      }
      
      // Unknown character
      throw new Error(`Unexpected character '${char}' at line ${this.line}, column ${this.column}`);
    }
    
    this.addToken(TokenType.EOF, '');
    return this.tokens;
  }
  
  private advance(count: number = 1): void {
    this.position += count;
    this.column += count;
  }
  
  private addToken(type: TokenType, value: string): void {
    this.tokens.push({
      type,
      value,
      line: this.line,
      column: this.column - value.length
    });
  }
  
  private skipWhitespace(): void {
    while (this.position < this.code.length && 
           (this.code[this.position] === ' ' || this.code[this.position] === '\t')) {
      this.advance();
    }
  }
  
  private handleIndentation(): void {
    let indentLevel = 0;
    const start = this.position;
    
    // Count spaces and tabs at the beginning of the line
    while (this.position < this.code.length && 
           (this.code[this.position] === ' ' || this.code[this.position] === '\t')) {
      if (this.code[this.position] === ' ') {
        indentLevel++;
      } else if (this.code[this.position] === '\t') {
        indentLevel += 4; // Treat tab as 4 spaces
      }
      this.advance();
    }
    
    // Only add INDENT token if there's actual indentation and content on the line
    if (indentLevel > 0 && this.position < this.code.length && 
        this.code[this.position] !== '\n' && this.code[this.position] !== '#') {
      const indentText = this.code.substring(start, this.position);
      this.addToken(TokenType.INDENT, indentText);
    }
  }
  
  private readComment(): void {
    const start = this.position;
    while (this.position < this.code.length && this.code[this.position] !== '\n') {
      this.advance();
    }
    const value = this.code.substring(start + 1, this.position).trim(); // Skip '#' and trim whitespace
    this.addToken(TokenType.COMMENT, value);
  }
  
  private readNumber(): void {
    const start = this.position;
    while (this.position < this.code.length && 
           (this.isDigit(this.code[this.position]) || this.code[this.position] === '.')) {
      this.advance();
    }
    const value = this.code.substring(start, this.position);
    this.addToken(TokenType.NUMBER, value);
  }
  
  private readString(): void {
    const quote = this.code[this.position];
    this.advance(); // Skip opening quote
    
    const start = this.position;
    while (this.position < this.code.length && this.code[this.position] !== quote) {
      if (this.code[this.position] === '\\') {
        this.advance(2); // Skip escape sequence
      } else {
        this.advance();
      }
    }
    
    if (this.position >= this.code.length) {
      throw new Error(`Unterminated string at line ${this.line}`);
    }
    
    const value = this.code.substring(start, this.position);
    this.advance(); // Skip closing quote
    this.addToken(TokenType.STRING, value);
  }
  
  private readIdentifier(): void {
    const start = this.position;
    while (this.position < this.code.length && 
           (this.isAlphaNumeric(this.code[this.position]) || this.code[this.position] === '_')) {
      this.advance();
    }
    
    const value = this.code.substring(start, this.position);
    const tokenType = this.getKeywordType(value) || TokenType.IDENTIFIER;
    this.addToken(tokenType, value);
  }
  
  private isDigit(char: string): boolean {
    return char >= '0' && char <= '9';
  }
  
  private isAlpha(char: string): boolean {
    return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z');
  }
  
  private isAlphaNumeric(char: string): boolean {
    return this.isAlpha(char) || this.isDigit(char);
  }
  
  private getKeywordType(value: string): TokenType | null {
    const keywords: Record<string, TokenType> = {
      'if': TokenType.IF,
      'elif': TokenType.ELIF,
      'else': TokenType.ELSE,
      'while': TokenType.WHILE,
      'for': TokenType.FOR,
      'def': TokenType.DEF,
      'return': TokenType.RETURN,
      'print': TokenType.PRINT,
      'input': TokenType.INPUT,
      'in': TokenType.IN,
      'and': TokenType.AND,
      'or': TokenType.OR,
      'not': TokenType.NOT,
      'True': TokenType.TRUE,
      'False': TokenType.FALSE,
      'None': TokenType.NONE
    };
    
    return keywords[value] || null;
  }
  
  private getTwoCharOperator(value: string): TokenType | null {
    const operators: Record<string, TokenType> = {
      '==': TokenType.EQUAL,
      '!=': TokenType.NOT_EQUAL,
      '<=': TokenType.LESS_EQUAL,
      '>=': TokenType.GREATER_EQUAL,
      '//': TokenType.FLOOR_DIVIDE,
      '**': TokenType.POWER,
      '+=': TokenType.PLUS_ASSIGN,
      '-=': TokenType.MINUS_ASSIGN,
      '*=': TokenType.MULTIPLY_ASSIGN,
      '/=': TokenType.DIVIDE_ASSIGN
    };
    
    return operators[value] || null;
  }
  
  private getSingleCharOperator(char: string): TokenType | null {
    const operators: Record<string, TokenType> = {
      '=': TokenType.ASSIGN,
      '+': TokenType.PLUS,
      '-': TokenType.MINUS,
      '*': TokenType.MULTIPLY,
      '/': TokenType.DIVIDE,
      '%': TokenType.MODULO,
      '<': TokenType.LESS,
      '>': TokenType.GREATER,
      '(': TokenType.LPAREN,
      ')': TokenType.RPAREN,
      '[': TokenType.LBRACKET,
      ']': TokenType.RBRACKET,
      ',': TokenType.COMMA,
      ':': TokenType.COLON
    };
    
    return operators[char] || null;
  }
}

/** Simple AST parser for Python */
export class ASTParser {
  private tokens: Token[] = [];
  private current: number = 0;
  
  /** Parse Python code to AST */
  async parse(code: string): Promise<PythonASTNode> {
    return this.parseSync(code);
  }
  
  /** Parse Python code to AST synchronously */
  parseSync(code: string): PythonASTNode {
    const lexer = new PythonLexer(code);
    this.tokens = lexer.tokenize();
    this.current = 0;
    
    return this.parseProgram();
  }
  
  private parseProgram(): PythonASTNode {
    const statements: PythonASTNode[] = [];
    
    while (!this.isAtEnd()) {
      if (this.check(TokenType.NEWLINE)) {
        this.advance();
        continue;
      }
      
      const stmt = this.parseStatement();
      if (stmt) {
        statements.push(stmt);
      }
    }
    
    return {
      type: 'Module',
      body: statements
    };
  }
  
  private parseStatement(): PythonASTNode | null {
    try {
      if (this.check(TokenType.COMMENT)) {
        return this.parseComment();
      }
      
      if (this.check(TokenType.IF)) {
        return this.parseIf();
      }
      
      if (this.check(TokenType.WHILE)) {
        return this.parseWhile();
      }
      
      if (this.check(TokenType.FOR)) {
        return this.parseFor();
      }
      
      if (this.check(TokenType.DEF)) {
        return this.parseFunction();
      }
      
      if (this.check(TokenType.RETURN)) {
        return this.parseReturn();
      }
      
      // Try assignment or expression
      return this.parseAssignmentOrExpression();
    } catch (error) {
      // Skip to next statement on error
      this.synchronize();
      return null;
    }
  }
  
  private parseComment(): PythonASTNode {
    const token = this.advance();
    return {
      type: 'Comment',
      value: token.value,
      lineno: token.line
    };
  }
  
  private parseIf(): PythonASTNode {
    this.consume(TokenType.IF, "Expected 'if'");
    const test = this.parseExpression();
    this.consume(TokenType.COLON, "Expected ':' after if condition");
    
    // Skip newlines
    while (this.check(TokenType.NEWLINE)) {
      this.advance();
    }
    
    // Parse body (indented block)
    const body = this.parseBlock();
    
    // Parse elif/else
    const orelse: PythonASTNode[] = [];
    
    while (this.check(TokenType.ELIF)) {
      this.advance(); // consume 'elif'
      const elifTest = this.parseExpression();
      this.consume(TokenType.COLON, "Expected ':' after elif condition");
      
      // Skip newlines
      while (this.check(TokenType.NEWLINE)) {
        this.advance();
      }
      
      const elifBody = this.parseBlock();
      
      orelse.push({
        type: 'If',
        test: elifTest,
        body: elifBody,
        orelse: [],
        lineno: this.previous().line
      });
    }
    
    if (this.check(TokenType.ELSE)) {
      this.advance(); // consume 'else'
      this.consume(TokenType.COLON, "Expected ':' after else");
      
      // Skip newlines
      while (this.check(TokenType.NEWLINE)) {
        this.advance();
      }
      
      const elseBody = this.parseBlock();
      // Create an else node instead of spreading the body
      if (elseBody.length > 0) {
        orelse.push({
          type: 'Else',
          body: elseBody,
          lineno: this.previous().line
        });
      }
    }
    
    return {
      type: 'If',
      test,
      body,
      orelse,
      lineno: this.previous().line
    };
  }
  
  private parseWhile(): PythonASTNode {
    this.consume(TokenType.WHILE, "Expected 'while'");
    const test = this.parseExpression();
    this.consume(TokenType.COLON, "Expected ':' after while condition");
    
    // Parse body statements
    const body: PythonASTNode[] = [];
    this.skipNewlines(); // Skip any newlines after colon
    
    // Parse indented block
    if (this.check(TokenType.INDENT)) {
      this.advance(); // consume INDENT
      
      while (!this.check(TokenType.DEDENT) && !this.isAtEnd()) {
        if (this.check(TokenType.NEWLINE)) {
          this.advance();
          continue;
        }
        const stmt = this.parseStatement();
        if (stmt) {
          body.push(stmt);
        }
      }
      
      if (this.check(TokenType.DEDENT)) {
        this.advance(); // consume DEDENT
      }
    }
    
    return {
      type: 'While',
      test,
      body,
      lineno: this.previous().line
    };
  }
  
  private parseFor(): PythonASTNode {
    this.consume(TokenType.FOR, "Expected 'for'");
    const target = this.parseExpression();
    this.consume(TokenType.IN, "Expected 'in' in for loop");
    const iter = this.parseExpression();
    this.consume(TokenType.COLON, "Expected ':' after for clause");
    
    // Parse body statements
    const body: PythonASTNode[] = [];
    this.skipNewlines(); // Skip any newlines after colon
    
    // Parse indented block
    if (this.check(TokenType.INDENT)) {
      this.advance(); // consume INDENT
      
      while (!this.check(TokenType.DEDENT) && !this.isAtEnd()) {
        if (this.check(TokenType.NEWLINE)) {
          this.advance();
          continue;
        }
        
        const stmt = this.parseStatement();
        if (stmt) {
          body.push(stmt);
        }
      }
      
      if (this.check(TokenType.DEDENT)) {
        this.advance(); // consume DEDENT
      }
    }
    
    return {
      type: 'For',
      target,
      iter,
      body,
      lineno: this.previous().line
    };
  }
  
  private parseFunction(): PythonASTNode {
    this.consume(TokenType.DEF, "Expected 'def'");
    const name = this.consume(TokenType.IDENTIFIER, "Expected function name").value;
    this.consume(TokenType.LPAREN, "Expected '(' after function name");
    
    const args: string[] = [];
    if (!this.check(TokenType.RPAREN)) {
      do {
        args.push(this.consume(TokenType.IDENTIFIER, "Expected parameter name").value);
      } while (this.match(TokenType.COMMA));
    }
    
    this.consume(TokenType.RPAREN, "Expected ')' after parameters");
    this.consume(TokenType.COLON, "Expected ':' after function signature");
    
    return {
      type: 'FunctionDef',
      name,
      args: { args },
      body: [], // Will be filled by visitor
      lineno: this.previous().line
    };
  }
  
  private parseReturn(): PythonASTNode {
    const token = this.advance();
    let value: PythonASTNode | null = null;
    
    if (!this.check(TokenType.NEWLINE) && !this.isAtEnd()) {
      value = this.parseExpression();
    }
    
    return {
      type: 'Return',
      value,
      lineno: token.line
    };
  }
  
  private parseAssignmentOrExpression(): PythonASTNode {
    const expr = this.parseExpression();
    
    // Check for assignment
    if (this.match(TokenType.ASSIGN, TokenType.PLUS_ASSIGN, TokenType.MINUS_ASSIGN, 
                   TokenType.MULTIPLY_ASSIGN, TokenType.DIVIDE_ASSIGN)) {
      const operator = this.previous();
      const value = this.parseExpression();
      
      return {
        type: 'Assign',
        targets: [expr],
        value,
        operator: operator.value,
        lineno: operator.line
      };
    }
    
    return {
      type: 'Expr',
      value: expr,
      lineno: expr.lineno
    };
  }
  
  private parseExpression(): PythonASTNode {
    return this.parseOr();
  }
  
  private parseOr(): PythonASTNode {
    let expr = this.parseAnd();
    
    while (this.match(TokenType.OR)) {
      const operator = this.previous();
      const right = this.parseAnd();
      expr = {
        type: 'BoolOp',
        op: 'Or',
        values: [expr, right],
        lineno: operator.line
      };
    }
    
    return expr;
  }
  
  private parseAnd(): PythonASTNode {
    let expr = this.parseEquality();
    
    while (this.match(TokenType.AND)) {
      const operator = this.previous();
      const right = this.parseEquality();
      expr = {
        type: 'BoolOp',
        op: 'And',
        values: [expr, right],
        lineno: operator.line
      };
    }
    
    return expr;
  }
  
  private parseEquality(): PythonASTNode {
    let expr = this.parseComparison();
    
    while (this.match(TokenType.EQUAL, TokenType.NOT_EQUAL)) {
      const operator = this.previous();
      const right = this.parseComparison();
      expr = {
        type: 'Compare',
        left: expr,
        ops: [operator.value === '==' ? 'Eq' : 'NotEq'],
        comparators: [right],
        lineno: operator.line
      };
    }
    
    return expr;
  }
  
  private parseComparison(): PythonASTNode {
    let expr = this.parseTerm();
    
    while (this.match(TokenType.GREATER, TokenType.GREATER_EQUAL, 
                      TokenType.LESS, TokenType.LESS_EQUAL)) {
      const operator = this.previous();
      const right = this.parseTerm();
      const opMap: Record<string, string> = {
        '>': 'Gt',
        '>=': 'GtE',
        '<': 'Lt',
        '<=': 'LtE'
      };
      
      expr = {
        type: 'Compare',
        left: expr,
        ops: [opMap[operator.value]],
        comparators: [right],
        lineno: operator.line
      };
    }
    
    return expr;
  }
  
  private parseTerm(): PythonASTNode {
    let expr = this.parseFactor();
    
    while (this.match(TokenType.MINUS, TokenType.PLUS)) {
      const operator = this.previous();
      const right = this.parseFactor();
      expr = {
        type: 'BinOp',
        left: expr,
        op: operator.value === '+' ? 'Add' : 'Sub',
        right,
        lineno: operator.line
      };
    }
    
    return expr;
  }
  
  private parseFactor(): PythonASTNode {
    let expr = this.parseUnary();
    
    while (this.match(TokenType.DIVIDE, TokenType.MULTIPLY, TokenType.MODULO, 
                      TokenType.FLOOR_DIVIDE)) {
      const operator = this.previous();
      const right = this.parseUnary();
      const opMap: Record<string, string> = {
        '/': 'Div',
        '*': 'Mult',
        '%': 'Mod',
        '//': 'FloorDiv'
      };
      
      expr = {
        type: 'BinOp',
        left: expr,
        op: opMap[operator.value],
        right,
        lineno: operator.line
      };
    }
    
    return expr;
  }
  
  private parseUnary(): PythonASTNode {
    if (this.match(TokenType.NOT, TokenType.MINUS)) {
      const operator = this.previous();
      const right = this.parseUnary();
      return {
        type: 'UnaryOp',
        op: operator.value === 'not' ? 'Not' : 'USub',
        operand: right,
        lineno: operator.line
      };
    }
    
    return this.parsePower();
  }
  
  private parsePower(): PythonASTNode {
    let expr = this.parseCall();
    
    if (this.match(TokenType.POWER)) {
      const operator = this.previous();
      const right = this.parseUnary(); // Right associative
      expr = {
        type: 'BinOp',
        left: expr,
        op: 'Pow',
        right,
        lineno: operator.line
      };
    }
    
    return expr;
  }
  
  private parseCall(): PythonASTNode {
    let expr = this.parsePrimary();
    
    while (true) {
      if (this.match(TokenType.LPAREN)) {
        expr = this.finishCall(expr);
      } else if (this.match(TokenType.LBRACKET)) {
        expr = this.finishSubscript(expr);
      } else {
        break;
      }
    }
    
    return expr;
  }
  
  private finishCall(callee: PythonASTNode): PythonASTNode {
    const args: PythonASTNode[] = [];
    
    if (!this.check(TokenType.RPAREN)) {
      do {
        args.push(this.parseExpression());
      } while (this.match(TokenType.COMMA));
    }
    
    this.consume(TokenType.RPAREN, "Expected ')' after arguments");
    
    return {
      type: 'Call',
      func: callee,
      args,
      lineno: callee.lineno
    };
  }
  
  private finishSubscript(value: PythonASTNode): PythonASTNode {
    const slice = this.parseExpression();
    this.consume(TokenType.RBRACKET, "Expected ']' after subscript");
    
    return {
      type: 'Subscript',
      value,
      slice,
      lineno: value.lineno
    };
  }
  
  private parsePrimary(): PythonASTNode {
    if (this.match(TokenType.TRUE)) {
      return {
        type: 'Constant',
        value: true,
        lineno: this.previous().line
      };
    }
    
    if (this.match(TokenType.FALSE)) {
      return {
        type: 'Constant',
        value: false,
        lineno: this.previous().line
      };
    }
    
    if (this.match(TokenType.NONE)) {
      return {
        type: 'Constant',
        value: null,
        lineno: this.previous().line
      };
    }
    
    if (this.match(TokenType.NUMBER)) {
      const value = this.previous().value;
      return {
        type: 'Constant',
        value: value.includes('.') ? parseFloat(value) : parseInt(value),
        lineno: this.previous().line
      };
    }
    
    if (this.match(TokenType.STRING)) {
      return {
        type: 'Constant',
        value: this.previous().value,
        lineno: this.previous().line
      };
    }
    
    if (this.match(TokenType.IDENTIFIER, TokenType.PRINT)) {
      return {
        type: 'Name',
        id: this.previous().value,
        lineno: this.previous().line
      };
    }
    
    if (this.match(TokenType.LPAREN)) {
      const expr = this.parseExpression();
      this.consume(TokenType.RPAREN, "Expected ')' after expression");
      return expr;
    }
    
    throw new Error(`Unexpected token: ${this.peek().value} at line ${this.peek().line}`);
  }
  
  /** Parse an indented block of statements */
  private parseBlock(): PythonASTNode[] {
    const statements: PythonASTNode[] = [];
    
    this.skipNewlines();
    
    // Look for indented statements
    while (!this.isAtEnd()) {
      // Check if we have an INDENT token (indicating an indented block)
      if (this.check(TokenType.INDENT)) {
        this.advance(); // consume INDENT
        const stmt = this.parseStatement();
        if (stmt) {
          statements.push(stmt);
        }
        this.skipNewlines();
      } else if (this.check(TokenType.ELIF) || this.check(TokenType.ELSE) || 
                 this.check(TokenType.DEF) || this.check(TokenType.IF) || 
                 this.check(TokenType.WHILE) || this.check(TokenType.FOR) ||
                 this.check(TokenType.EOF)) {
        // End of current block
        break;
      } else {
        // No indentation, might be end of block or same-level statement
        const stmt = this.parseStatement();
        if (stmt) {
          statements.push(stmt);
        }
        this.skipNewlines();
        // If we parsed a statement without indentation, it might be the end of the block
        if (!this.check(TokenType.INDENT)) {
          break;
        }
      }
    }
    
    return statements;
  }
  
  private skipNewlines(): void {
    while (this.check(TokenType.NEWLINE)) {
      this.advance();
    }
  }
  
  // Helper methods
  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }
  
  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }
  
  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }
  
  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }
  
  private peek(): Token {
    return this.tokens[this.current];
  }
  
  private previous(): Token {
    return this.tokens[this.current - 1];
  }
  
  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance();
    
    const current = this.peek();
    throw new Error(`${message}. Got '${current.value}' at line ${current.line}`);
  }
  
  private synchronize(): void {
    this.advance();
    
    while (!this.isAtEnd()) {
      if (this.previous().type === TokenType.NEWLINE) return;
      
      switch (this.peek().type) {
        case TokenType.IF:
        case TokenType.WHILE:
        case TokenType.FOR:
        case TokenType.DEF:
        case TokenType.RETURN:
          return;
      }
      
      this.advance();
    }
  }
}