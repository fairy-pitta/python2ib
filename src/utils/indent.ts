/**
 * Indentation utilities for IB Pseudocode output
 */

import { IndentStyle } from '../types/config.js';

/** Indentation manager class */
export class IndentManager {
  private style: IndentStyle;
  private size: number;
  private currentLevel: number = 0;
  
  constructor(style: IndentStyle = 'spaces', size: number = 4) {
    this.style = style;
    this.size = size;
  }
  
  /** Get current indentation string */
  get current(): string {
    return this.getIndent(this.currentLevel);
  }
  
  /** Get indentation string for specific level */
  getIndent(level: number): string {
    if (level < 0) level = 0;
    
    const unit = this.style === 'spaces' ? ' ' : '\t';
    const count = this.style === 'spaces' ? level * this.size : level;
    
    return unit.repeat(count);
  }
  
  /** Increase indentation level */
  increase(): void {
    this.currentLevel++;
  }
  
  /** Decrease indentation level */
  decrease(): void {
    if (this.currentLevel > 0) {
      this.currentLevel--;
    }
  }
  
  /** Set specific indentation level */
  setLevel(level: number): void {
    this.currentLevel = Math.max(0, level);
  }
  
  /** Get current indentation level */
  getLevel(): number {
    return this.currentLevel;
  }
  
  /** Reset indentation to level 0 */
  reset(): void {
    this.currentLevel = 0;
  }
  
  /** Apply indentation to a line of text */
  applyToLine(text: string, level?: number): string {
    const indent = level !== undefined ? this.getIndent(level) : this.current;
    return indent + text;
  }
  
  /** Apply indentation to multiple lines */
  applyToLines(lines: string[], level?: number): string[] {
    return lines.map(line => this.applyToLine(line, level));
  }
}

/** Utility functions for indentation */
export const IndentUtils = {
  /** Create indentation string */
  create(level: number, style: IndentStyle = 'spaces', size: number = 4): string {
    if (level < 0) level = 0;
    
    const unit = style === 'spaces' ? ' ' : '\t';
    const count = style === 'spaces' ? level * size : level;
    
    return unit.repeat(count);
  },
  
  /** Count indentation level of a line */
  countLevel(line: string, style: IndentStyle = 'spaces', size: number = 4): number {
    let count = 0;
    const unit = style === 'spaces' ? ' ' : '\t';
    
    for (const char of line) {
      if (char === unit) {
        count++;
      } else {
        break;
      }
    }
    
    return style === 'spaces' ? Math.floor(count / size) : count;
  },
  
  /** Remove indentation from a line */
  remove(line: string): string {
    return line.replace(/^[\s\t]+/, '');
  },
  
  /** Normalize indentation in text block */
  normalize(text: string, style: IndentStyle = 'spaces', size: number = 4): string {
    const lines = text.split('\n');
    const manager = new IndentManager(style, size);
    
    return lines.map(line => {
      const trimmed = IndentUtils.remove(line);
      if (trimmed === '') return '';
      
      // Simple heuristic for indentation level based on keywords
      if (trimmed.startsWith('IF ') || trimmed.startsWith('WHILE ') || 
          trimmed.startsWith('FOR ') || trimmed.startsWith('PROCEDURE ') ||
          trimmed.startsWith('FUNCTION ') || trimmed.startsWith('TRY')) {
        const result = manager.applyToLine(trimmed);
        manager.increase();
        return result;
      } else if (trimmed.startsWith('ELSEIF ') || trimmed.startsWith('ELSE') ||
                 trimmed.startsWith('EXCEPT')) {
        manager.decrease();
        const result = manager.applyToLine(trimmed);
        manager.increase();
        return result;
      } else if (trimmed.startsWith('ENDIF') || trimmed.startsWith('ENDWHILE') ||
                 trimmed.startsWith('NEXT ') || trimmed.startsWith('ENDPROCEDURE') ||
                 trimmed.startsWith('ENDFUNCTION') || trimmed.startsWith('ENDTRY')) {
        manager.decrease();
        return manager.applyToLine(trimmed);
      } else {
        return manager.applyToLine(trimmed);
      }
    }).join('\n');
  }
};