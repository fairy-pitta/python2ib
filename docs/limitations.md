# Limitations and Unsupported Features

## Overview

This document outlines the Python features that are currently not supported by the `python2ib` converter. The converter focuses on the core programming constructs typically used in IB Computer Science curriculum.

## Unsupported Python Features

### 1. Object-Oriented Programming

#### Classes and Objects
```python
# ❌ Not supported
class MyClass:
    def __init__(self):
        self.value = 10
    
    def method(self):
        return self.value

obj = MyClass()
```

**Reason:** IB Pseudocode does not have direct class/object syntax.

#### Inheritance
```python
# ❌ Not supported
class Child(Parent):
    pass
```

#### Class Methods and Static Methods
```python
# ❌ Not supported
class MyClass:
    @classmethod
    def class_method(cls):
        pass
    
    @staticmethod
    def static_method():
        pass
```

### 2. Advanced Function Features

#### Decorators
```python
# ❌ Not supported
@decorator
def my_function():
    pass
```

#### Lambda Functions
```python
# ❌ Not supported
lambda x: x * 2
```

#### Generator Functions
```python
# ❌ Not supported
def generator():
    yield 1
    yield 2
```

#### Async/Await
```python
# ❌ Not supported
async def async_function():
    await some_operation()
```

### 3. Advanced Data Structures

#### List Comprehensions
```python
# ❌ Not supported
squares = [x**2 for x in range(10)]
```

**Workaround:** Use explicit loops
```python
# ✅ Supported alternative
squares = []
for x in range(10):
    squares.append(x**2)
```

#### Dictionary Comprehensions
```python
# ❌ Not supported
squares_dict = {x: x**2 for x in range(10)}
```

#### Set Comprehensions
```python
# ❌ Not supported
unique_squares = {x**2 for x in range(10)}
```

### 4. Exception Handling

#### Try/Except Blocks
```python
# ❌ Not supported
try:
    risky_operation()
except ValueError:
    handle_error()
finally:
    cleanup()
```

**Reason:** IB Pseudocode typically doesn't include exception handling.

#### Raising Exceptions
```python
# ❌ Not supported
raise ValueError("Something went wrong")
```

### 5. Advanced Control Flow

#### Match/Case Statements (Python 3.10+)
```python
# ❌ Not supported
match value:
    case 1:
        print("One")
    case 2:
        print("Two")
```

**Workaround:** Use if/elif chains
```python
# ✅ Supported alternative
if value == 1:
    print("One")
elif value == 2:
    print("Two")
```

### 6. Import System

#### Module Imports
```python
# ❌ Not supported
import math
from datetime import datetime
```

**Reason:** IB Pseudocode doesn't have a module system.

### 7. Advanced String Features

#### F-strings (Partial Support)
```python
# ⚠️ Limited support
name = "Alice"
greeting = f"Hello, {name}!"  # Simple cases work

# ❌ Complex f-strings not supported
result = f"Result: {calculate(x) + y:.2f}"
```

### 8. File Operations

#### File I/O
```python
# ❌ Not supported
with open('file.txt', 'r') as f:
    content = f.read()
```

**Reason:** IB Pseudocode typically uses simplified INPUT/OUTPUT operations.

### 9. Advanced Operators

#### Walrus Operator
```python
# ❌ Not supported
if (n := len(items)) > 10:
    print(f"Too many items: {n}")
```

#### Unpacking Operators
```python
# ❌ Not supported
args = [1, 2, 3]
function(*args)

kwargs = {'a': 1, 'b': 2}
function(**kwargs)
```

### 10. Context Managers

```python
# ❌ Not supported
with context_manager() as cm:
    do_something()
```

## Partially Supported Features

### 1. Data Types

#### Lists
```python
# ✅ Basic operations supported
my_list = [1, 2, 3]
my_list.append(4)
item = my_list[0]

# ❌ Advanced methods not supported
my_list.sort(key=lambda x: x.lower())
```

#### Dictionaries
```python
# ✅ Basic operations supported
my_dict = {'a': 1, 'b': 2}
value = my_dict['a']
my_dict['c'] = 3

# ❌ Advanced methods not supported
my_dict.setdefault('d', 4)
```

### 2. String Operations

```python
# ✅ Basic operations supported
text = "Hello"
uppercase = text.upper()
length = len(text)

# ❌ Advanced string methods not supported
result = text.partition(',')
```

## Workarounds and Alternatives

### Replace Classes with Functions

**Instead of:**
```python
class Calculator:
    def add(self, a, b):
        return a + b
```

**Use:**
```python
def add(a, b):
    return a + b
```

### Replace List Comprehensions with Loops

**Instead of:**
```python
evens = [x for x in numbers if x % 2 == 0]
```

**Use:**
```python
evens = []
for x in numbers:
    if x % 2 == 0:
        evens.append(x)
```

### Replace Complex Expressions with Variables

**Instead of:**
```python
result = complex_function(another_function(x) + y)
```

**Use:**
```python
temp = another_function(x)
temp = temp + y
result = complex_function(temp)
```

## Future Enhancements

The following features may be added in future versions:

1. **Basic class support** - Simple classes without inheritance
2. **Enhanced list comprehension** - Convert to equivalent loops
3. **Basic exception handling** - Convert to conditional checks
4. **Module simulation** - Convert imports to function definitions

## Reporting Issues

If you encounter Python code that should be supported but isn't, please:

1. Check this limitations list first
2. Create a minimal example
3. Report the issue on [GitHub](https://github.com/fairy-pitta/python2ib/issues)

## Best Practices for IB-Compatible Python

To ensure your Python code converts well to IB Pseudocode:

1. **Use simple control structures** (if/else, while, for)
2. **Avoid complex expressions** - break them into steps
3. **Use descriptive variable names**
4. **Keep functions focused and simple**
5. **Avoid advanced Python features** listed above
6. **Use explicit loops instead of comprehensions**
7. **Handle edge cases with simple conditionals**