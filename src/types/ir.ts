/**
 * Intermediate Representation (IR) for Python to IB Pseudocode conversion
 * 
 * This IR uses a recursive tree structure where each node can have children,
 * allowing for proper representation of nested structures (IF/WHILE/FOR/FUNCTION blocks)
 */

export interface IR {
  /** The kind of IR node (e.g., 'assign', 'if', 'output', 'for', 'procedure', 'function') */
  kind: IRKind;
  
  /** The text to be output for this line */
  text: string;
  
  /** Child IR nodes for nested structures */
  children: IR[];
  
  /** Additional metadata for specific IR types */
  meta?: IRMeta;
}

/** All possible IR node types */
export type IRKind = 
  // Basic statements
  | 'assign'           // x ← 5
  | 'output'           // OUTPUT x
  | 'input'            // INPUT x
  | 'comment'          // // comment
  | 'expression'       // standalone expression
  | 'sequence'         // sequence of statements
  
  // Control structures
  | 'if'               // IF condition
  | 'elseif'           // ELSEIF condition
  | 'else'             // ELSE
  | 'endif'            // ENDIF
  | 'while'            // WHILE condition
  | 'endwhile'         // ENDWHILE
  | 'for'              // FOR i ← start TO end
  | 'next'             // NEXT i
  
  // Functions and procedures
  | 'procedure'        // PROCEDURE name(params)
  | 'function'         // FUNCTION name(params) RETURNS type
  | 'endprocedure'     // ENDPROCEDURE
  | 'endfunction'      // ENDFUNCTION
  | 'return'           // RETURN [value]
  
  // Error handling
  | 'try'              // TRY
  | 'except'           // EXCEPT
  | 'endtry'           // ENDTRY
  
  // Special
  | 'block'            // Generic block container
  | 'program';         // Root program node

/** Metadata for IR nodes */
export interface IRMeta {
  // Common metadata
  lineNumber?: number;
  
  // Assignment metadata
  variable?: string;
  
  // Function metadata
  functionName?: string;
  parameters?: string[];
  returnType?: string;
  
  // Control flow metadata
  condition?: string;
  
  // Loop metadata
  start?: string;
  end?: string;
  step?: string;
  
  // Expression metadata
  value?: string;
  
  // Error metadata
  errorType?: string;
  exceptionType?: string;
  
  // Additional metadata
  [key: string]: any;
}

/** Factory functions for creating IR nodes */
export class IRFactory {
  static program(): IR {
    return {
      kind: 'program',
      text: '',
      children: [],
      meta: {}
    };
  }
  
  static assign(variable: string, value: string, lineNumber?: number): IR {
    return {
      kind: 'assign',
      text: `${variable} = ${value}`,
      children: [],
      meta: { variable, lineNumber }
    };
  }
  
  static output(expression: string, lineNumber?: number): IR {
    return {
      kind: 'output',
      text: `output ${expression}`,
      children: [],
      meta: { lineNumber }
    };
  }
  
  static input(variable?: string, lineNumber?: number): IR {
    const text = variable ? `${variable} = INPUT` : 'INPUT';
    return {
      kind: 'input',
      text,
      children: [],
      meta: { variable, lineNumber }
    };
  }
  
  static if(condition: string, lineNumber?: number): IR {
    return {
      kind: 'if',
      text: `if ${condition} then`,
      children: [],
      meta: { condition, lineNumber }
    };
  }
  
  static elseif(condition: string, lineNumber?: number): IR {
    return {
      kind: 'elseif',
      text: `else if ${condition} then`,
      children: [],
      meta: { condition, lineNumber }
    };
  }
  
  static else(lineNumber?: number): IR {
    return {
      kind: 'else',
      text: 'else',
      children: [],
      meta: { lineNumber }
    };
  }
  
  static endif(lineNumber?: number): IR {
    return {
      kind: 'endif',
      text: 'end if',
      children: [],
      meta: { lineNumber }
    };
  }
  
  static while(condition: string, lineNumber?: number): IR {
    return {
      kind: 'while',
      text: `loop while ${condition}`,
      children: [],
      meta: { condition, lineNumber }
    };
  }

  static endwhile(lineNumber?: number): IR {
    return {
      kind: 'endwhile',
      text: 'end loop',
      children: [],
      meta: { lineNumber }
    };
  }
  
  static for(
    variable: string,
    start: string,
    end: string,
    step?: string,
    lineNumber?: number
  ): IR {
    const stepText = step && step !== '1' ? ` step ${step}` : '';
    return {
      kind: 'for',
      text: `loop ${variable} from ${start} to ${end}${stepText}`,
      children: [],
      meta: { variable, start, end, step: step || '1', lineNumber }
    };
  }

  static next(variable: string, lineNumber?: number): IR {
    return {
      kind: 'next',
      text: `end loop`,
      children: [],
      meta: { variable, lineNumber }
    };
  }
  
  static function(
    name: string,
    parameters: string[],
    returnType: string,
    lineNumber?: number
  ): IR {
    const params = parameters.join(', ');
    return {
      kind: 'function',
      text: `FUNCTION ${name}(${params}) RETURNS ${returnType}`,
      children: [],
      meta: { functionName: name, parameters, returnType, lineNumber }
    };
  }
  
  static endfunction(lineNumber?: number): IR {
    return {
      kind: 'endfunction',
      text: 'end FUNCTION',
      children: [],
      meta: { lineNumber }
    };
  }
  
  static procedure(name: string, parameters: string[], lineNumber?: number): IR {
    const params = parameters.join(', ');
    return {
      kind: 'procedure',
      text: `PROCEDURE ${name}(${params})`,
      children: [],
      meta: { functionName: name, parameters, lineNumber }
    };
  }
  
  static endprocedure(lineNumber?: number): IR {
    return {
      kind: 'endprocedure',
      text: 'end PROCEDURE',
      children: [],
      meta: { lineNumber }
    };
  }
  
  static return(value?: string, lineNumber?: number): IR {
    const text = value ? `RETURN ${value}` : 'RETURN';
    return {
      kind: 'return',
      text,
      children: [],
      meta: { value, lineNumber }
    };
  }
  
  static comment(text: string, lineNumber?: number): IR {
    return {
      kind: 'comment',
      text: `// ${text}`,
      children: [],
      meta: { lineNumber }
    };
  }
  
  static expression(text: string, lineNumber?: number): IR {
    return {
      kind: 'expression',
      text,
      children: [],
      meta: { lineNumber }
    };
  }
  
  static block(lineNumber?: number): IR {
    return {
      kind: 'block',
      text: '',
      children: [],
      meta: { lineNumber }
    };
  }
}