/**
 * Base visitor class for AST traversal using the Visitor pattern
 */

import { PythonASTNode } from '../ast-parser.js';
import { IR } from '../../types/ir.js';
import { ConvertOptions } from '../../types/config.js';

/** Base visitor interface */
export interface Visitor<T = IR> {
  visit(node: PythonASTNode): T;
}

/** Abstract base visitor class */
export abstract class BaseVisitor implements Visitor<IR> {
  protected config: Required<ConvertOptions>;
  
  constructor(config: Required<ConvertOptions>) {
    this.config = config;
  }
  
  /** Main visit method - dispatches to specific visit methods */
  visit(node: PythonASTNode): IR {
    if (!node) {
      throw new Error('Cannot visit null or undefined node');
    }
    
    const methodName = `visit${node.type}`;
    const method = (this as any)[methodName];
    
    if (typeof method === 'function') {
      return method.call(this, node);
    }
    
    // Fallback for unsupported node types
    return this.visitUnsupported(node);
  }
  
  /** Visit multiple nodes and return array of IRs */
  visitMany(nodes: PythonASTNode[]): IR[] {
    return nodes.map(node => this.visit(node)).filter(ir => ir !== null);
  }
  
  /** Handle unsupported node types */
  protected visitUnsupported(node: PythonASTNode): IR {
    const message = `Unsupported Python construct: ${node.type}`;
    console.warn(message);
    
    return {
      kind: 'comment',
      text: `// ${message}`,
      children: [],
      meta: { lineNumber: node.lineno }
    };
  }
  
  /** Extract string representation from expression node */
  protected extractExpression(node: PythonASTNode, depth: number = 0): string {
    if (!node) {
      console.warn('extractExpression called with null/undefined node');
      return '';
    }
    if (!node.type) {
      console.warn('extractExpression called with node missing type:', node);
      return '';
    }
    
    if (depth > 100) {
      console.error(`extractExpression: Maximum recursion depth (100) exceeded for node type: ${node.type}`);
      return `/* MAX_DEPTH_EXCEEDED: ${node.type} */`;
    }
    
    switch (node.type) {
      case 'Constant':
        return this.formatConstant(node.value);
        
      case 'Name':
        return this.mapVariableName(node.id);
        
      case 'BinOp':
        return this.extractBinaryOperation(node, depth + 1);
        
      case 'UnaryOp':
        return this.extractUnaryOperation(node, depth + 1);
        
      case 'Compare':
        return this.extractComparison(node, depth + 1);
        
      case 'BoolOp':
        return this.extractBooleanOperation(node, depth + 1);
        
      case 'Call':
        return this.extractCall(node, depth + 1);
        
      case 'Subscript':
        return this.extractSubscript(node, depth + 1);
        
      case 'JoinedStr':
        return this.extractJoinedString(node, depth + 1);
        
      case 'Tuple':
        // For tuple expressions, join elements with commas
        return node.elts.map((elt: PythonASTNode) => this.extractExpression(elt, depth + 1)).join(', ');
        
      default:
        return `/* ${node.type} */`;
    }
  }
  
  /** Format constant values */
  protected formatConstant(value: any): string {
    if (value === null) return 'NULL';
    if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
    if (typeof value === 'string') return `"${value}"`;
    return String(value);
  }
  
  /** Extract binary operation expression */
  protected extractBinaryOperation(node: PythonASTNode, depth: number = 0): string {
    const left = this.extractExpression(node.left, depth);
    const right = this.extractExpression(node.right, depth);
    const operator = this.convertBinaryOperator(node.op);
    
    return `${left} ${operator} ${right}`;
  }
  
  /** Extract unary operation expression */
  protected extractUnaryOperation(node: PythonASTNode, depth: number = 0): string {
    const operand = this.extractExpression(node.operand, depth);
    const operator = this.convertUnaryOperator(node.op);
    
    return `${operator} ${operand}`;
  }
  
  /** Extract comparison expression */
  protected extractComparison(node: PythonASTNode, depth: number = 0): string {
    if (!node.left) {
      console.warn('extractComparison: node.left is undefined', node);
      return '';
    }
    if (!node.ops || !Array.isArray(node.ops)) {
      console.warn('extractComparison: node.ops is invalid', node);
      return this.extractExpression(node.left, depth);
    }
    if (!node.comparators || !Array.isArray(node.comparators)) {
      console.warn('extractComparison: node.comparators is invalid', node);
      return this.extractExpression(node.left, depth);
    }
    
    let result = this.extractExpression(node.left, depth);
    
    for (let i = 0; i < node.ops.length; i++) {
      const operator = this.convertComparisonOperator(node.ops[i]);
      const comparator = this.extractExpression(node.comparators[i], depth);
      result += ` ${operator} ${comparator}`;
    }
    
    return result;
  }
  
  /** Extract boolean operation expression */
  protected extractBooleanOperation(node: PythonASTNode, depth: number = 0): string {
    const operator = node.op === 'And' ? 'AND' : 'OR';
    const values = node.values.map((value: PythonASTNode) => this.extractExpression(value, depth));
    
    return values.join(` ${operator} `);
  }
  
  /** Extract function call expression */
  protected extractCall(node: PythonASTNode, depth: number = 0): string {
    const funcName = this.extractExpression(node.func, depth);
    const args = node.args.map((arg: PythonASTNode) => this.extractExpression(arg, depth));
    
    return `${funcName}(${args.join(', ')})`;
  }
  
  /** Extract subscript expression (array/list access) */
  protected extractSubscript(node: PythonASTNode, depth: number = 0): string {
    let value = this.extractExpression(node.value, depth);
    const slice = this.extractExpression(node.slice, depth);
    
    // Apply variable name mapping if the value is a simple variable name
    if (node.value.type === 'Name') {
      value = this.mapVariableName(node.value.id);
    }
    
    return `${value}[${slice}]`;
  }
  
  /** Extract joined string (f-string) expression */
  protected extractJoinedString(node: PythonASTNode, _depth: number = 0): string {
    if (!node.values || !Array.isArray(node.values)) {
      return '""';
    }
    
    // For f-strings like f"Hello {name}", we need to parse the string and extract variables
    const firstValue = node.values[0];
    if (firstValue && firstValue.type === 'Constant') {
      const stringValue = firstValue.value;
      
      // Simple f-string parsing: extract variables from {variable} patterns
      const parts: string[] = [];
      const regex = /\{([^}]+)\}/g;
      let lastIndex = 0;
      let match;
      
      while ((match = regex.exec(stringValue)) !== null) {
        // Add text before the variable
        if (match.index > lastIndex) {
          const textPart = stringValue.substring(lastIndex, match.index);
          if (textPart) {
            parts.push(`"${textPart}"`);
          }
        }
        
        // Add the variable (convert to uppercase)
        const variableName = match[1].trim();
        parts.push(this.mapVariableName(variableName));
        
        lastIndex = regex.lastIndex;
      }
      
      // Add remaining text after the last variable
      if (lastIndex < stringValue.length) {
        const textPart = stringValue.substring(lastIndex);
        if (textPart) {
          parts.push(`"${textPart}"`);
        }
      }
      
      // Join parts with " + "
      return parts.length > 0 ? parts.join(' + ') : '""';
    }
    
    return '""';
  }
  
  /** Convert Python binary operators to IB Pseudocode */
  protected convertBinaryOperator(op: string): string {
    const operators: Record<string, string> = {
      'Add': '+',
      'Sub': '-',
      'Mult': '*',
      'Div': '/',
      'FloorDiv': 'div',
      'Mod': 'mod',
      'Pow': '^'
    };
    
    return operators[op] || op;
  }
  
  /** Convert Python unary operators to IB Pseudocode */
  protected convertUnaryOperator(op: string): string {
    const operators: Record<string, string> = {
      'Not': 'NOT',
      'USub': '-',
      'UAdd': '+'
    };
    
    return operators[op] || op;
  }
  
  /** Convert Python comparison operators to IB Pseudocode */
  protected convertComparisonOperator(op: string): string {
    if (!op) {
      console.warn('convertComparisonOperator: op is undefined/null');
      return '?';
    }
    
    const operators: Record<string, string> = {
      'Eq': '=',
      'NotEq': '≠',
      'Lt': '<',
      'LtE': '≤',
      'Gt': '>',
      'GtE': '≥',
      'Is': '=',
      'IsNot': '≠',
      'In': 'IN',
      'NotIn': 'NOT IN'
    };
    
    return operators[op] || op;
  }
  
  /** Check if a function has return statements */
  protected hasReturnStatement(body: PythonASTNode[]): boolean {
    for (const stmt of body) {
      if (stmt.type === 'Return') {
        return true;
      }
      
      // Check nested structures
      if (stmt.type === 'If' && stmt.body) {
        if (this.hasReturnStatement(stmt.body)) return true;
        if (stmt.orelse && this.hasReturnStatement(stmt.orelse)) return true;
      }
      
      if (stmt.type === 'While' && stmt.body) {
        if (this.hasReturnStatement(stmt.body)) return true;
      }
      
      if (stmt.type === 'For' && stmt.body) {
        if (this.hasReturnStatement(stmt.body)) return true;
      }
    }
    
    return false;
  }
  
  /** Apply variable name mapping if configured */
  protected mapVariableName(name: string): string {
    // First check for custom mapping
    const mapped = this.config.variableMapping[name];
    if (mapped) {
      return mapped;
    }
    
    // Convert to uppercase for IB Pseudocode convention
    return name.toUpperCase();
  }
  
  /** Apply function name mapping if configured */
  protected mapFunctionName(name: string): string {
    // Check for explicit mapping first
    if (this.config.functionMapping[name]) {
      return this.config.functionMapping[name];
    }
    
    // Convert snake_case to camelCase
    return this.snakeToCamelCase(name);
  }
  
  /** Convert snake_case to camelCase */
  private snakeToCamelCase(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }
  
  /** Create error IR node */
  protected createError(message: string, lineNumber?: number): IR {
    return {
      kind: 'comment',
      text: `// ERROR: ${message}`,
      children: [],
      meta: { lineNumber }
    };
  }
  
  /** Create warning IR node */
  protected createWarning(message: string, lineNumber?: number): IR {
    return {
      kind: 'comment',
      text: `// WARNING: ${message}`,
      children: [],
      meta: { lineNumber }
    };
  }
}

/** Utility functions for visitor implementations */
export const VisitorUtils = {
  /** Check if assignment is simple (single target) */
  isSimpleAssignment(node: PythonASTNode): boolean {
    return node.type === 'Assign' && 
           node.targets.length === 1 && 
           (node.targets[0].type === 'Name' || node.targets[0].type === 'Subscript' || node.targets[0].type === 'Tuple');
  },
  
  /** Check if node is a function call */
  isFunctionCall(node: PythonASTNode): boolean {
    return node.type === 'Call';
  },
  
  /** Check if node is a print statement */
  isPrintCall(node: PythonASTNode): boolean {
    return node.type === 'Call' && 
           node.func.type === 'Name' && 
           node.func.id === 'print';
  },
  
  /** Check if node is an input statement */
  isInputCall(node: PythonASTNode): boolean {
    return node.type === 'Call' && 
           node.func.type === 'Name' && 
           node.func.id === 'input';
  },

  /** Check if node is an input call wrapped in type conversion (e.g., int(input())) */
  isWrappedInputCall(node: PythonASTNode): boolean {
    if (node.type === 'Call' && 
        node.func.type === 'Name' && 
        ['int', 'float', 'str'].includes(node.func.id) &&
        node.args.length === 1) {
      return this.isInputCall(node.args[0]);
    }
    return false;
  },

  /** Extract input call from wrapped input (e.g., extract input() from int(input())) */
  extractInputFromWrapped(node: PythonASTNode): PythonASTNode | null {
    if (this.isWrappedInputCall(node)) {
      return node.args[0];
    }
    return null;
  },
  
  /** Check if node is a range call */
  isRangeCall(node: PythonASTNode): boolean {
    return node.type === 'Call' && 
           node.func.type === 'Name' && 
           node.func.id === 'range';
  },
  
  /** Extract function name from call node */
  getFunctionName(node: PythonASTNode): string {
    if (node.type === 'Call' && node.func.type === 'Name') {
      return node.func.id;
    }
    return '';
  },
  
  /** Extract variable name from assignment target */
  getAssignmentTarget(node: PythonASTNode): string {
    if (node.type === 'Name') {
      return node.id;
    }
    if (node.type === 'Subscript') {
      // For subscript, we need to return the full expression like "names[0]"
      // This will be handled by extractExpression in the visitor
      return '';
    }
    return '';
  }
};