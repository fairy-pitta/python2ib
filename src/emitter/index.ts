/**
 * Main emitter for converting IR to IB Pseudocode text
 */

import { IR } from '../types/ir.js';
import { ConvertOptions } from '../types/config.js';
import { IndentManager, IndentUtils } from '../utils/indent.js';

/** Main emitter class for IR to IB Pseudocode conversion */
export class IBPseudocodeEmitter {
  private indentManager: IndentManager;
  private config: Required<ConvertOptions>;
  private output: string[] = [];
  
  constructor(config: Required<ConvertOptions>) {
    this.config = config;
    this.indentManager = new IndentManager(config.indentStyle, config.indentSize);
  }
  
  /** Main emit method */
  emit(ir: IR): string {
    this.output = [];
    this.emitNode(ir);
    
    let result = this.output.join('\n');
    
    // Apply post-processing
    if (this.config.normalizeIndentation) {
      result = IndentUtils.normalize(result, this.config.indentStyle, this.config.indentSize);
    }
    
    // Ensure proper line endings
    result = result.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    // Remove trailing newlines for single statements
    result = result.replace(/\n+$/, '');
    
    return result;
  }
  
  /** Emit a single IR node */
  private emitNode(node: IR): void {
    switch (node.kind) {
      case 'program':
        this.emitProgram(node);
        break;
        
      case 'assign':
        this.emitAssign(node);
        break;
        
      case 'output':
        this.emitOutput(node);
        break;
        
      case 'input':
        this.emitInput(node);
        break;
        
      case 'if':
        this.emitIf(node);
        break;
        
      case 'endif':
        this.emitEndif(node);
        break;
        
      case 'elseif':
        this.emitElseif(node);
        break;
        
      case 'else':
        this.emitElse(node);
        break;
        
      case 'while':
        this.emitWhile(node);
        break;
        
      case 'until':
        this.emitUntil(node);
        break;
        
      case 'endwhile':
        this.emitEndwhile(node);
        break;
        
      case 'for':
        this.emitFor(node);
        break;
        
      case 'next':
        this.emitNext(node);
        break;
        
      case 'function':
        this.emitFunction(node);
        break;
        
      case 'endfunction':
        this.emitEndfunction(node);
        break;
        
      case 'procedure':
        this.emitProcedure(node);
        break;
        
      case 'endprocedure':
        this.emitEndprocedure(node);
        break;
        
      case 'return':
        this.emitReturn(node);
        break;
        
      case 'comment':
        this.emitComment(node);
        break;
        
      case 'expression':
        this.emitExpression(node);
        break;
        
      case 'block':
        this.emitBlock(node);
        break;
        
      case 'sequence':
        this.emitSequence(node);
        break;
        
      default:
        this.emitUnsupported(node);
        break;
    }
  }
  
  /** Emit block */
  private emitBlock(node: IR): void {
    for (const child of node.children) {
      this.emitNode(child);
    }
  }
  
  /** Emit sequence */
  private emitSequence(node: IR): void {
    for (const child of node.children) {
      this.emitNode(child);
    }
  }
  
  /** Emit program (root) */
  private emitProgram(node: IR): void {
    for (const child of node.children) {
      this.emitNode(child);
    }
  }
  
  /** Emit assignment */
  private emitAssign(node: IR): void {
    const line = this.indentManager.current + node.text;
    this.output.push(line);
  }
  
  /** Emit output statement */
  private emitOutput(node: IR): void {
    const line = this.indentManager.current + node.text;
    this.output.push(line);
  }
  
  /** Emit input statement */
  private emitInput(node: IR): void {
    const line = this.indentManager.current + node.text;
    this.output.push(line);
  }
  
  /** Emit if statement */
  private emitIf(node: IR): void {
    const line = this.indentManager.current + node.text;
    this.output.push(line);
    
    // Increase indent for body
    this.indentManager.increase();
    
    // Emit children
    for (const child of node.children) {
      this.emitNode(child);
    }
  }
  
  /** Emit endif */
  private emitEndif(node: IR): void {
    // Decrease indent before emitting ENDIF
    this.indentManager.decrease();
    const line = this.indentManager.current + node.text;
    this.output.push(line);
  }
  
  /** Emit elseif */
  private emitElseif(node: IR): void {
    // Temporarily decrease indent for ELSEIF
    this.indentManager.decrease();
    const line = this.indentManager.current + node.text;
    this.output.push(line);
    this.indentManager.increase();
    
    // Emit children
    for (const child of node.children) {
      this.emitNode(child);
    }
  }
  
  /** Emit else */
  private emitElse(node: IR): void {
    // Temporarily decrease indent for ELSE
    this.indentManager.decrease();
    const line = this.indentManager.current + node.text;
    this.output.push(line);
    this.indentManager.increase();
    
    // Emit children
    for (const child of node.children) {
      this.emitNode(child);
    }
  }
  
  /** Emit while loop */
  private emitWhile(node: IR): void {
    const line = this.indentManager.current + node.text;
    this.output.push(line);
    
    // Increase indent for body
    this.indentManager.increase();
    
    // Emit children
    for (const child of node.children) {
      this.emitNode(child);
    }
  }
  
  /** Emit until loop */
  private emitUntil(node: IR): void {
    const line = this.indentManager.current + node.text;
    this.output.push(line);
    
    // Increase indent for body
    this.indentManager.increase();
    
    // Emit children
    for (const child of node.children) {
      this.emitNode(child);
    }
  }
  
  /** Emit endwhile */
  private emitEndwhile(node: IR): void {
    // Decrease indent before emitting ENDWHILE
    this.indentManager.decrease();
    const line = this.indentManager.current + node.text;
    this.output.push(line);
  }
  
  /** Emit for loop */
  private emitFor(node: IR): void {
    const line = this.indentManager.current + node.text;
    this.output.push(line);
    
    // Increase indent for body
    this.indentManager.increase();
    
    // Emit children
    for (const child of node.children) {
      this.emitNode(child);
    }
  }
  
  /** Emit next (end of for loop) */
  private emitNext(node: IR): void {
    // Decrease indent before emitting NEXT
    this.indentManager.decrease();
    const line = this.indentManager.current + node.text;
    this.output.push(line);
  }
  
  /** Emit function definition */
  private emitFunction(node: IR): void {
    const line = this.indentManager.current + node.text;
    this.output.push(line);
    
    // Increase indent for body
    this.indentManager.increase();
    
    // Emit children
    for (const child of node.children) {
      this.emitNode(child);
    }
  }
  
  /** Emit endfunction */
  private emitEndfunction(node: IR): void {
    // Decrease indent before emitting ENDFUNCTION
    this.indentManager.decrease();
    const line = this.indentManager.current + node.text;
    this.output.push(line);
  }
  
  /** Emit procedure definition */
  private emitProcedure(node: IR): void {
    const line = this.indentManager.current + node.text;
    this.output.push(line);
    
    // Increase indent for body
    this.indentManager.increase();
    
    // Emit children
    for (const child of node.children) {
      this.emitNode(child);
    }
  }
  
  /** Emit endprocedure */
  private emitEndprocedure(node: IR): void {
    // Decrease indent before emitting ENDPROCEDURE
    this.indentManager.decrease();
    const line = this.indentManager.current + node.text;
    this.output.push(line);
  }
  
  /** Emit return statement */
  private emitReturn(node: IR): void {
    const line = this.indentManager.current + node.text;
    this.output.push(line);
  }

  /** Emit comment */
  private emitComment(node: IR): void {
    const line = this.indentManager.current + node.text;
    this.output.push(line);
  }
  
  /** Emit expression */
  private emitExpression(node: IR): void {
    const line = this.indentManager.current + node.text;
    this.output.push(line);
  }
  

  
  /** Emit unsupported node */
  private emitUnsupported(node: IR): void {
    const unsupportedComment = `// UNSUPPORTED: ${node.kind} - ${node.text}`;
    const line = this.indentManager.current + unsupportedComment;
    this.output.push(line);
  }
  
  /** Get current indentation level */
  getCurrentIndentLevel(): number {
    return this.indentManager.getLevel();
  }
  
  /** Reset emitter state */
  reset(): void {
    this.output = [];
    this.indentManager.reset();
  }
}

/** Convenience function for emitting IR to IB Pseudocode */
export function emitIBPseudocode(ir: IR, config: Required<ConvertOptions>): string {
  const emitter = new IBPseudocodeEmitter(config);
  return emitter.emit(ir);
}

/** Convenience function with default config */
export function emitIBPseudocodeDefault(ir: IR): string {
  const defaultConfig: Required<ConvertOptions> = {
    format: 'plain',
    indentStyle: 'spaces',
    indentSize: 4,
    includeLineNumbers: false,
    includeOriginalCode: false,
    validateSyntax: true,
    preserveEmptyLines: true,
    variableMapping: {},
    functionMapping: {},
    strictMode: false,
    normalizeIndentation: false
  };
  
  return emitIBPseudocode(ir, defaultConfig);
}