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
  | 'assign'           // x = 5
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
  | 'until'            // UNTIL condition
  | 'endwhile'         // ENDWHILE
  | 'for'              // FOR i = start TO end
  | 'next'             // NEXT i
  
  // Functions and procedures
  | 'procedure'        // PROCEDURE name(params)
  | 'function'         // FUNCTION name(params) RETURNS type
  | 'endprocedure'     // ENDPROCEDURE
  | 'endfunction'      // ENDFUNCTION
  | 'return'           // RETURN [value]
  
  // Object-oriented constructs
  | 'class'            // CLASS name
  | 'endclass'         // ENDCLASS
  | 'constructor'      // CONSTRUCTOR(params)
  | 'endconstructor'   // ENDCONSTRUCTOR
  | 'method'           // METHOD name(params)
  | 'staticmethod'     // STATIC FUNCTION name(params)
  | 'classmethod'      // CLASS FUNCTION name(params)
  | 'property'         // PROPERTY name
  | 'getter'           // GET
  | 'setter'           // SET(params)
  | 'endproperty'     // ENDPROPERTY
  | 'endget'          // ENDGET
  | 'endset'          // ENDSET
  | 'pass'             // (empty statement)
  
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
    const text = variable ? `input ${variable}` : 'input';
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
  
  static until(condition: string, lineNumber?: number): IR {
    return {
      kind: 'until',
      text: `loop until ${condition}`,
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
      text: `function ${name}(${params}) returns ${returnType}`,
      children: [],
      meta: { functionName: name, parameters, returnType, lineNumber }
    };
  }
  
  static endfunction(lineNumber?: number): IR {
    return {
      kind: 'endfunction',
      text: 'end function',
      children: [],
      meta: { lineNumber }
    };
  }
  
  static procedure(name: string, parameters: string[], lineNumber?: number): IR {
    const params = parameters.join(', ');
    return {
      kind: 'procedure',
      text: `procedure ${name}(${params})`,
      children: [],
      meta: { functionName: name, parameters, lineNumber }
    };
  }
  
  static endprocedure(lineNumber?: number): IR {
    return {
      kind: 'endprocedure',
      text: 'end procedure',
      children: [],
      meta: { lineNumber }
    };
  }
  
  static return(value?: string, lineNumber?: number): IR {
    const text = value ? `return ${value}` : 'return';
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

  static class(name: string, lineNumber?: number): IR {
    return {
      kind: 'class',
      text: `CLASS ${name}`,
      children: [],
      meta: { lineNumber, className: name }
    };
  }

  static classWithInheritance(name: string, baseClass: string, lineNumber?: number): IR {
    return {
      kind: 'class',
      text: `CLASS ${name} INHERITS ${baseClass}`,
      children: [],
      meta: { lineNumber, baseClass }
    };
  }

  static endclass(lineNumber?: number): IR {
    return {
      kind: 'endclass',
      text: 'ENDCLASS',
      children: [],
      meta: { lineNumber }
    };
  }

  static classConstructor(parameters: string[], lineNumber?: number): IR {
    const params = parameters.length > 0 ? `(${parameters.join(', ')})` : '()';
    return {
      kind: 'constructor',
      text: `CONSTRUCTOR${params}`,
      children: [],
      meta: { lineNumber, parameters }
    };
  }

  static endconstructor(lineNumber?: number): IR {
    return {
      kind: 'endconstructor',
      text: 'ENDCONSTRUCTOR',
      children: [],
      meta: { lineNumber }
    };
  }

  static method(name: string, parameters: string[], lineNumber?: number): IR {
    const params = parameters.length > 0 ? `(${parameters.join(', ')})` : '()';
    return {
      kind: 'method',
      text: `METHOD ${name}${params}`,
      children: [],
      meta: { lineNumber, functionName: name, parameters }
    };
  }

  static staticMethod(name: string, parameters: string[], returnType: string, lineNumber?: number): IR {
    const params = parameters.join(', ');
    return {
      kind: 'staticmethod',
      text: `STATIC FUNCTION ${name}(${params}) RETURNS ${returnType}`,
      children: [],
      meta: { lineNumber, functionName: name, parameters, returnType }
    };
  }

  static classMethod(name: string, parameters: string[], returnType: string, lineNumber?: number): IR {
    const params = parameters.join(', ');
    return {
      kind: 'classmethod',
      text: `CLASS FUNCTION ${name}(${params}) RETURNS ${returnType}`,
      children: [],
      meta: { lineNumber, functionName: name, parameters, returnType }
    };
  }

  static pass(lineNumber?: number): IR {
    return {
      kind: 'pass',
      text: '',
      children: [],
      meta: { lineNumber }
    };
  }

  static property(name: string, lineNumber?: number): IR {
    return {
      kind: 'property',
      text: `PROPERTY ${name}`,
      children: [],
      meta: { lineNumber, functionName: name }
    };
  }

  static endproperty(lineNumber?: number): IR {
    return {
      kind: 'endproperty',
      text: 'ENDPROPERTY',
      children: [],
      meta: { lineNumber }
    };
  }

  static getter(lineNumber?: number): IR {
    return {
      kind: 'getter',
      text: 'GET',
      children: [],
      meta: { lineNumber }
    };
  }

  static endget(lineNumber?: number): IR {
    return {
      kind: 'endget',
      text: 'ENDGET',
      children: [],
      meta: { lineNumber }
    };
  }

  static setter(parameters: string[], lineNumber?: number): IR {
    const params = parameters.length > 0 ? `(${parameters.join(', ')})` : '()';
    return {
      kind: 'setter',
      text: `SET${params}`,
      children: [],
      meta: { lineNumber, parameters }
    };
  }

  static endset(lineNumber?: number): IR {
    return {
      kind: 'endset',
      text: 'ENDSET',
      children: [],
      meta: { lineNumber }
    };
  }
}