/**
 * Main visitor for converting Python AST to IR
 */

import { BaseVisitor, VisitorUtils } from './base-visitor.js';
import { PythonASTNode } from '../ast-parser.js';
import { IR, IRFactory } from '../../types/ir.js';
import { ConvertOptions } from '../../types/config.js';
import { OperatorConverter } from '../../utils/operators.js';
import { KeywordConverter, SPECIAL_CONSTRUCTS } from '../../utils/keywords.js';

/** Main Python to IR visitor */
export class PythonToIRVisitor extends BaseVisitor {
  constructor(config: Required<ConvertOptions>) {
    super(config);
  }
  
  /** Visit Module (root node) */
  visitModule(node: PythonASTNode): IR {
    const program = IRFactory.program();
    
    for (const stmt of node.body) {
      const ir = this.visit(stmt);
      if (ir) {
        program.children.push(ir);
      }
    }
    
    return program;
  }
  
  /** Visit Assignment statement */
  visitAssign(node: PythonASTNode): IR {
    if (!VisitorUtils.isSimpleAssignment(node)) {
      return this.createError('Complex assignments not supported', node.lineno);
    }
    
    const targetNode = node.targets[0];
    let mappedTarget: string;
    
    if (targetNode.type === 'Name') {
      const target = VisitorUtils.getAssignmentTarget(targetNode);
      mappedTarget = this.mapVariableName(target);
    } else if (targetNode.type === 'Subscript') {
      // Handle array/list assignment like names[0] = "Alice"
      mappedTarget = this.extractExpression(targetNode);
    } else {
      return this.createError('Unsupported assignment target', node.lineno);
    }
    
    const value = this.extractExpression(node.value);
    
    // Handle compound assignment operators
    if (node.operator && node.operator !== '=') {
      const expandedAssignment = OperatorConverter.expandCompoundAssignment(
        mappedTarget, node.operator, value
      );
      return {
        kind: 'assign',
        text: expandedAssignment,
        children: [],
        meta: { variable: mappedTarget, lineNumber: node.lineno }
      };
    }
    
    return IRFactory.assign(mappedTarget, value, node.lineno);
  }
  
  /** Visit Expression statement */
  visitExpr(node: PythonASTNode): IR {
    const value = node.value;
    
    // Handle special function calls
    if (VisitorUtils.isPrintCall(value)) {
      return this.visitPrintCall(value);
    }
    
    if (VisitorUtils.isInputCall(value)) {
      return this.visitInputCall(value);
    }
    
    // Handle other function calls
    if (VisitorUtils.isFunctionCall(value)) {
      const funcName = VisitorUtils.getFunctionName(value);
      const args = value.args.map((arg: PythonASTNode) => this.extractExpression(arg));
      
      return {
        kind: 'expression',
        text: `${this.mapFunctionName(funcName)}(${args.join(', ')})`,
        children: [],
        meta: { lineNumber: node.lineno }
      };
    }
    
    // Generic expression
    const expression = this.extractExpression(value);
    return {
      kind: 'expression',
      text: expression,
      children: [],
      meta: { lineNumber: node.lineno }
    };
  }
  
  /** Visit Print function call */
  private visitPrintCall(node: PythonASTNode): IR {
    const args = node.args.map((arg: PythonASTNode) => this.extractExpression(arg));
    
    if (args.length === 0) {
      return IRFactory.output('""', node.lineno);
    }
    
    if (args.length === 1) {
      return IRFactory.output(args[0], node.lineno);
    }
    
    // Multiple arguments - join with spaces
    const joinedArgs = args.join(' + " " + ');
    return IRFactory.output(joinedArgs, node.lineno);
  }
  
  /** Visit Input function call */
  private visitInputCall(node: PythonASTNode): IR {
    // For input() calls in expressions, we need to handle them specially
    // This is typically used in assignments like: x = input("prompt")
    const args = node.args.map((arg: PythonASTNode) => this.extractExpression(arg));
    
    if (args.length > 0) {
      // Has prompt - create OUTPUT followed by INPUT
      const prompt = args[0];
      return {
        kind: 'block',
        text: '',
        children: [
          IRFactory.output(prompt, node.lineno),
          {
            kind: 'input',
            text: 'INPUT',
            children: [],
            meta: { lineNumber: node.lineno }
          }
        ],
        meta: { lineNumber: node.lineno }
      };
    }
    
    return {
      kind: 'input',
      text: 'INPUT',
      children: [],
      meta: { lineNumber: node.lineno }
    };
  }
  
  /** Visit If statement */
  visitIf(node: PythonASTNode): IR {
    if (!node.test) {
      console.warn('visitIf: node.test is undefined', node);
      return IRFactory.comment('Invalid IF statement', node.lineno);
    }
    
    const condition = this.extractExpression(node.test);
    const ifNode = IRFactory.if(condition, node.lineno);
    
    // Process if body
    if (node.body && Array.isArray(node.body)) {
      for (const stmt of node.body) {
        const childNode = this.visit(stmt);
        if (childNode) {
          ifNode.children.push(childNode);
        }
      }
    }
    
    const children: IR[] = [ifNode];
    
    // Process elif/else (orelse)
    if (node.orelse && Array.isArray(node.orelse)) {
      let i = 0;
      while (i < node.orelse.length) {
        const elseStmt = node.orelse[i];
        
        if (elseStmt.type === 'If') {
          // This is an elif
          const elifCondition = this.extractExpression(elseStmt.test);
          const elifNode = IRFactory.elseif(elifCondition, elseStmt.lineno);
          
          // Process elif body
          if (elseStmt.body && Array.isArray(elseStmt.body)) {
            for (const stmt of elseStmt.body) {
              const childNode = this.visit(stmt);
              if (childNode) {
                elifNode.children.push(childNode);
              }
            }
          }
          
          children.push(elifNode);
          
          // Handle nested elif/else by continuing the loop
          if (elseStmt.orelse && Array.isArray(elseStmt.orelse)) {
            // Add the nested orelse to the current processing queue
            node.orelse.splice(i + 1, 0, ...elseStmt.orelse);
          }
        } else if (elseStmt.type === 'Else') {
          // This is an else block
          const elseNode = IRFactory.else(elseStmt.lineno);
          
          // Process else body
          if (elseStmt.body && Array.isArray(elseStmt.body)) {
            for (const stmt of elseStmt.body) {
              const childNode = this.visit(stmt);
              if (childNode) {
                elseNode.children.push(childNode);
              }
            }
          }
          
          children.push(elseNode);
        } else {
          // This is a direct statement (old format compatibility)
          const elseNode = IRFactory.else(elseStmt.lineno);
          
          // Process all remaining statements as else body
          for (let j = i; j < node.orelse.length; j++) {
            const childNode = this.visit(node.orelse[j]);
            if (childNode) {
              elseNode.children.push(childNode);
            }
          }
          
          children.push(elseNode);
          break; // Processed all remaining statements
        }
        i++;
      }
    }
    
    // Add ENDIF
    const endifNode = IRFactory.endif(node.lineno);
    children.push(endifNode);
    
    return {
      kind: 'block',
      text: '',
      children,
      meta: { lineNumber: node.lineno }
    };
  }
  
  /** Visit While statement */
  visitWhile(node: PythonASTNode): IR {
    const condition = this.extractExpression(node.test);
    const whileNode = IRFactory.while(condition, node.lineno);
    
    // Process body
    if (node.body && Array.isArray(node.body)) {
      for (const stmt of node.body) {
        const childNode = this.visit(stmt);
        if (childNode) {
          whileNode.children.push(childNode);
        }
      }
    }
    
    // Add ENDWHILE
    const endwhileNode = IRFactory.endwhile(node.lineno);
    
    return {
      kind: 'block',
      text: '',
      children: [whileNode, endwhileNode],
      meta: { lineNumber: node.lineno }
    };
  }
  
  /** Visit For statement */
  visitFor(node: PythonASTNode): IR {
    const target = this.extractExpression(node.target);
    const mappedTarget = this.mapVariableName(target);
    
    // Check if it's a range() call
    if (VisitorUtils.isRangeCall(node.iter)) {
      const rangeArgs = node.iter.args.map((arg: PythonASTNode) => this.extractExpression(arg));
      const range = SPECIAL_CONSTRUCTS.convertRange(rangeArgs);
      
      const forNode = IRFactory.for(
        mappedTarget,
        range.start,
        range.end,
        range.step,
        node.lineno
      );
      
      // Process body
      if (node.body && Array.isArray(node.body)) {
        for (const stmt of node.body) {
          const childNode = this.visit(stmt);
          if (childNode) {
            forNode.children.push(childNode);
          }
        }
      }
      
      // Add NEXT
      const nextNode = IRFactory.next(mappedTarget, node.lineno);
      
      return {
        kind: 'block',
        text: '',
        children: [forNode, nextNode],
        meta: { lineNumber: node.lineno }
      };
    }
    
    // Non-range iteration (not fully supported)
    return this.createWarning(
      `For loop over ${this.extractExpression(node.iter)} not fully supported`,
      node.lineno
    );
  }
  
  /** Visit Function definition */
  visitFunctionDef(node: PythonASTNode): IR {
    const name = this.mapFunctionName(node.name);
    const params = node.args.args.map((arg: any) => arg.arg || arg.id || String(arg));
    
    // Check if function has return statements
    const hasReturn = this.hasReturnStatement(node.body || []);
    
    let funcNode: IR;
    let endNode: IR;
    
    if (hasReturn) {
      // Function with return value
      funcNode = IRFactory.function(name, params, 'UNKNOWN', node.lineno);
      endNode = IRFactory.endfunction(node.lineno);
    } else {
      // Procedure without return value
      funcNode = IRFactory.procedure(name, params, node.lineno);
      endNode = IRFactory.endprocedure(node.lineno);
    }
    
    // Process body (placeholder)
    funcNode.children.push(IRFactory.block(node.lineno));
    
    return {
      kind: 'block',
      text: '',
      children: [funcNode, endNode],
      meta: { lineNumber: node.lineno }
    };
  }
  
  /** Visit Return statement */
  visitReturn(node: PythonASTNode): IR {
    if (node.value) {
      const value = this.extractExpression(node.value);
      return IRFactory.return(value, node.lineno);
    }
    
    return IRFactory.return(undefined, node.lineno);
  }
  
  /** Visit Comment */
  visitComment(node: PythonASTNode): IR {
    return IRFactory.comment(node.value, node.lineno);
  }
  
  /** Visit Call expression */
  visitCall(node: PythonASTNode): IR {
    const funcName = VisitorUtils.getFunctionName(node);
    
    // Handle built-in functions
    if (KeywordConverter.isBuiltinSupported(funcName)) {
      const ibFuncName = KeywordConverter.convertBuiltinFunction(funcName);
      const args = node.args.map((arg: PythonASTNode) => this.extractExpression(arg));
      
      // Special handling for specific functions
      switch (funcName) {
        case 'print':
          return this.visitPrintCall(node);
          
        case 'input':
          return this.visitInputCall(node);
          
        case 'len':
          if (args.length === 1) {
            return {
              kind: 'expression',
              text: `LENGTH(${args[0]})`,
              children: [],
              meta: { lineNumber: node.lineno }
            };
          }
          break;
          
        default:
          return {
            kind: 'expression',
            text: `${ibFuncName}(${args.join(', ')})`,
            children: [],
            meta: { lineNumber: node.lineno }
          };
      }
    }
    
    // User-defined function call
    const mappedName = this.mapFunctionName(funcName);
    const args = node.args.map((arg: PythonASTNode) => this.extractExpression(arg));
    
    return {
      kind: 'expression',
      text: `${mappedName}(${args.join(', ')})`,
      children: [],
      meta: { lineNumber: node.lineno }
    };
  }
  
  /** Override extractCall to handle special cases */
  protected override extractCall(node: PythonASTNode): string {
    const funcName = VisitorUtils.getFunctionName(node);
    
    // Handle built-in functions
    if (KeywordConverter.isBuiltinSupported(funcName)) {
      const ibFuncName = KeywordConverter.convertBuiltinFunction(funcName);
      const args = node.args.map((arg: PythonASTNode) => this.extractExpression(arg));
      
      switch (funcName) {
        case 'len':
          return args.length === 1 ? `LENGTH(${args[0]})` : `LENGTH(${args.join(', ')})`;
          
        case 'str':
          return args.length === 1 ? `STRING(${args[0]})` : `STRING(${args.join(', ')})`;
          
        case 'int':
          return args.length === 1 ? `INTEGER(${args[0]})` : `INTEGER(${args.join(', ')})`;
          
        case 'float':
          return args.length === 1 ? `REAL(${args[0]})` : `REAL(${args.join(', ')})`;
          
        default:
          return `${ibFuncName}(${args.join(', ')})`;
      }
    }
    
    // User-defined function
    const mappedName = this.mapFunctionName(funcName);
    const args = node.args.map((arg: PythonASTNode) => this.extractExpression(arg));
    
    return `${mappedName}(${args.join(', ')})`;
  }
  
  /** Handle unsupported constructs with more specific messages */
  protected override visitUnsupported(node: PythonASTNode): IR {
    const specificMessages: Record<string, string> = {
      'ListComp': 'List comprehensions are not supported in IB Pseudocode',
      'Lambda': 'Lambda functions are not supported in IB Pseudocode',
      'ClassDef': 'Class definitions are not supported in basic IB Pseudocode',
      'With': 'Context managers (with statements) are not supported',
      'Try': 'Exception handling is partially supported',
      'Import': 'Import statements are not supported in IB Pseudocode',
      'ImportFrom': 'Import statements are not supported in IB Pseudocode',
      'Global': 'Global declarations are not supported',
      'Nonlocal': 'Nonlocal declarations are not supported'
    };
    
    const message = specificMessages[node.type] || `Unsupported Python construct: ${node.type}`;
    
    return {
      kind: 'comment',
      text: `// ${message}`,
      children: [],
      meta: { lineNumber: node.lineno }
    };
  }
}