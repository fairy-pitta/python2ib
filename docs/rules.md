Python vs IB Pseudocode Examples (IB Computer Science HL)

This document provides side-by-side examples of Python code and IB Computer Science pseudocode (using the official IB pseudocode style) for various topics in the HL syllabus. Each section is organized by topic, covering core concepts and HL extensions (such as object-oriented programming, file handling, algorithms, and data structures). The IB pseudocode follows the approved notation: keywords are lowercase (if, loop, etc.), variables are in uppercase by convention, and methods use dot-notation or mixedCase names ￼ ￼.

Variables and Assignments

Both Python and IB pseudocode use variables to store data. In IB pseudocode, the assignment operator is = (same symbol as equality, context-dependent) ￼. Variable names are typically written in uppercase in IB pseudocode for clarity ￼. Comments are marked with //. Below is an example of assigning values and performing arithmetic:

Python:

x = 5
y = x + 2
print(y)  # This will output 7

IB Pseudocode:

X = 5
Y = X + 2
output Y    // displays 7 on the screen

Explanation: In both versions, we create a variable (x or X), assign it the value 5, then create another variable (y or Y) as the sum of the first variable and 2. The result is printed/output to the console. The IB pseudocode uses the output keyword to indicate printing to an output device ￼.

Input and Output

Reading input and writing output are fundamental. Python uses the input() function and print() for output, whereas IB pseudocode uses the INPUT and OUTPUT keywords. Multiple items can be output in pseudocode by separating them with commas ￼.

Python:

name = input("Enter your name: ")
age = int(input("Enter your age: "))  # Convert input to integer
print("Hello", name)
print("You are", age, "years old.")
if age >= 18:
    print("You are an adult.")
else:
    print("You are a minor.")

IB Pseudocode:

INPUT NAME
INPUT AGE
output "Hello", NAME
output "You are", AGE, "years old."
if AGE >= 18 then
    output "You are an adult."
else
    output "You are a minor."
end if

In the pseudocode above, INPUT NAME prompts the user and stores the value in the variable NAME ￼. The OUTPUT statements then display greetings and age. The if…else structure is used to output a message depending on the age (adult vs minor). This example demonstrates user interaction and conditional output in IB pseudocode ￼.

Conditionals (If/Else)

Conditional statements allow branching logic. Python uses if, elif, else, whereas IB pseudocode uses if, else if, else (or elif in some resources) with similar structure ￼ ￼. The keyword then may be used in IB pseudocode (it is optional) ￼. Logical operators are spelled out (AND, OR, NOT) in IB pseudocode ￼.

Example: Determine letter grade from a numeric score.

Python:

score = 75  # for example
if score >= 90:
    print("Grade = A")
elif score >= 80:
    print("Grade = B")
elif score >= 70:
    print("Grade = C")
else:
    print("Grade = F")

IB Pseudocode:

IF SCORE >= 90 THEN
    output "Grade = A"
ELSE IF SCORE >= 80 THEN
    output "Grade = B"
ELSE IF SCORE >= 70 THEN
    output "Grade = C"
ELSE
    output "Grade = F"
END IF

In pseudocode, the structure is similar to Python’s if/elif/else. Each condition is checked in order ￼. Only the first condition that evaluates to true will execute its block, then the chain ends with an ELSE for the default case. Note that in IB pseudocode we can write else if on a new line (some resources show it as ELSE IF or ElseIf). The above logic will print the appropriate letter grade based on the score.

Loops (While and For)

Loops allow repeating a block of code multiple times. Python has while loops and for loops (the latter iterating over sequences or ranges). IB pseudocode provides a loop while ... end loop construct for while-loops, and a loop ... from ... to ... end loop construct for for-loops ￼ ￼.

While Loop

Python (while example):

count = 0
while count < 5:
    print(count)
    count = count + 1

IB Pseudocode (while example):

COUNT = 0
loop while COUNT < 5
    output COUNT
    COUNT = COUNT + 1
end loop

This loop will iterate as long as the condition is true. In this example, it prints 0,1,2,3,4 and then stops when COUNT < 5 is no longer true. The IB pseudocode uses loop while ... end loop to denote a pre-condition loop ￼. Note that the update of the counter (COUNT = COUNT + 1) is done inside the loop.

For Loop

Python (for example):

for i in range(1, 6):   # range(1,6) generates 1,2,3,4,5
    print(i)

IB Pseudocode (for example):

loop for I from 1 to 5
    output I
end loop

This for-loop iterates I from 1 to 5 inclusive, printing each value. The IB pseudocode uses loop for <VAR> from <start> to <end> syntax ￼. (IB pseudocode by default assumes stepping by 1 each time; more complex increments could be handled with a while-loop if needed). Both versions output: 1, 2, 3, 4, 5.

Note: IB pseudocode does not explicitly use Python’s range() function, but the from ... to ... construct serves a similar purpose. Also, IB pseudocode supports loop control like BREAK to exit a loop early or CONTINUE to skip to the next iteration, if needed ￼.

Functions and Procedures

In Python, functions are defined with def and can return values. In IB pseudocode, a subroutine (function or procedure) is defined with the keyword method and concluded with end method ￼. If a value is to be returned, the pseudocode can use a return statement, or alternatively output the result directly depending on the context. Method (function) names in IB pseudocode are written in MixedCase, and parameters are listed in parentheses.

Example: A simple function to square a number.

Python:

def square(n):
    return n * n

result = square(5)
print(result)   # Outputs 25

IB Pseudocode:

method square(N)
    return N * N
end method

NUM = square(5)
output NUM    // Outputs 25

Here, the Python function square returns the square of the input. The IB pseudocode defines a method square that returns N * N ￼. We then call the method and store the result in NUM, and output it. In IB pseudocode, you may also simply do output square(5) instead of storing into a variable. Both approaches are acceptable. If the subroutine didn’t need to return a value (i.e., it’s a procedure), it could just perform output or other actions internally (in which case using output inside the method would be analogous to a void function in other languages).

(The IB pseudocode style does not differentiate syntactically between procedures and functions; the context (presence of return) indicates if a value is returned. Also, IB pseudocode uses pass-by-value for parameters and allows at most one returned value ￼ ￼.)

Arrays and Lists

Python’s list type corresponds to arrays or collections in IB terminology. In IB pseudocode, you can represent a static array with square brackets or use the new Array(size) construct. Basic operations include indexing elements, updating values, and iterating. There is also a notion of a collection in IB pseudocode (an abstract dynamic list with its own methods), which we’ll mention in the next section.

Example: Creating a list/array, accessing and modifying elements, and checking length.

Python:

nums = [42, 13, 78]      # a list of 3 integers
print(nums[0])           # 42 (first element)
nums[1] = 11             # change second element to 11
print(len(nums))         # 3 (length of the list)
print(nums[0:2])         # [42, 11] (slice of first two elements)

IB Pseudocode:

NUMS = [42, 13, 78]     // an array of 3 integers
output NUMS[0]          // 42
NUMS[1] = 11            // now array becomes [42, 11, 78]
output NUMS.Length()    // 3
output NUMS.Slice(0, 2) // [42, 11]

In Python, lists have built-in functions like len() and slicing syntax. In IB pseudocode, an array’s length might be given or tracked separately; some pseudocode conventions allow ArrayName.Length() to get the size ￼. In the example, NUMS.Length() returns 3. We also showed NUMS.Slice(0,2) to get a sub-array (this is a conceptual method to illustrate slicing) ￼. If such methods are not provided on exam, one could loop to copy elements. Indexing starts at 0 in IB pseudocode arrays by default ￼, just like Python. Attempting to access an out-of-range index would be an error in a real program, but pseudocode questions usually ensure indexes are valid.

Iterating through an array in IB pseudocode can be done with a loop for I from 0 to NUMS.Length() - 1 ￼. For example:

loop I from 0 to NUMS.Length() - 1
    output NUMS[I]
end loop

would print each element of NUMS. This parallels Python’s for i in range(len(nums)): or directly iterating over elements.

Strings

Strings in Python are sequences of characters, with many methods (e.g., slicing, concatenation). IB pseudocode treats strings similarly to arrays of characters and typically provides basic operations like getting length or substrings. In IB pseudocode, string methods are indicated with dot notation as well (e.g., STR.Length() for length) ￼. Concatenation can be done with the + operator or by outputting multiple items.

Example: Basic string operations.

Python:

s = "Hello"
print(len(s))      # 5
print(s[0:3])      # "Hel"
print(s[2:4])      # "ll"
print(s[4:11])     # "o"
name = "John"
greeting = "Hello " + name
print(greeting)    # "Hello John"

IB Pseudocode:

STR = "Hello"
output STR.Length()         // 5
output STR.SubStr(0, 3)     // "Hel"
output STR.SubStr(2, 2)     // "ll"
output STR.SubStr(4, 7)     // "o"
NAME = "John"
GREETING = "Hello " + NAME
output GREETING            // "Hello John"

The Length() method returns the length of the string ￼. The SubStr(start, length) method returns a substring starting at the given index and of the given length ￼. In the above pseudocode, STR.SubStr(4, 7) returns "o" because it starts at index 4 (the letter “o” in “Hello”) and goes for 7 characters or until the string ends ￼. In practice, IB pseudocode does not define many extensive string methods, so algorithms involving strings (e.g., searching for a character) might be done with loops and comparisons.

For concatenation, we used "Hello " + NAME. The plus operator can serve for string concatenation in pseudocode (just as in Python) ￼. Alternatively, one could use multiple outputs or a method if provided.

Recursion

Recursion is the technique of a function calling itself to solve a problem. It is part of the HL syllabus and often illustrated with mathematical functions like factorial or Fibonacci ￼. The key to recursion is having a base case to stop and recursive calls that approach that base case.

Example: Recursive factorial function (n! = n × (n-1) × … × 1, with 0! = 1).

Python (recursion):

def factorial(n):
    if n <= 1:        # base case
        return 1
    else:
        return n * factorial(n-1)   # recursive case

print(factorial(5))   # Outputs 120

IB Pseudocode (recursion):

method factorial(N)
    if N <= 1 then
        return 1
    else
        return N * factorial(N - 1)
    end if
end method

output factorial(5)   // Outputs 120

In both versions, if the input n (or N) is 0 or 1, the function returns 1 (base case) – this stops the recursion. Otherwise, it returns n * factorial(n-1), which calls itself with a smaller number. Eventually, the recursion reaches the base case and unwinds, computing the factorial. The IB pseudocode is very similar to the Python code here, just with syntactic differences. In an exam context, you might be expected to trace or write such pseudocode to demonstrate understanding of recursion (HL students should be comfortable with recursion for algorithms like factorial, Fibonacci, and divide-and-conquer sorts) ￼.

Object-Oriented Programming (Classes and Objects)

Object-oriented programming (OOP) is an HL topic. Python supports OOP with the class keyword. IB exams (Paper 1) might ask students to write pseudocode to define a class, its attributes, and methods, or to interpret given class pseudocode ￼. (In Paper 2 HL Option D, Java syntax is used via the Java Examination Tool Subset (JETS) ￼, but here we will use pseudocode style for demonstration.)

Example: Define a simple Person class with attributes and a method, then use it.

Python (OOP example):

class Person:
    def __init__(self, name, age):
        # constructor initializes attributes
        self.name = name
        self.age = age

    def greet(self):
        print("Hello, my name is", self.name)

# Using the class:
p = Person("Alice", 30)
p.greet()   # Prints: Hello, my name is Alice

IB Pseudocode (OOP example):

CLASS Person
    // attributes
    NAME
    AGE

    // constructor method
    method Person(NAME_PARAM, AGE_PARAM)
        NAME = NAME_PARAM
        AGE = AGE_PARAM
    end method

    // instance method
    method greet()
        output "Hello, my name is ", NAME
    end method
END CLASS

// Using the class:
P = new Person("Alice", 30)
P.greet()

In the pseudocode, CLASS Person ... END CLASS encapsulates the class definition. We list two attributes NAME and AGE. The constructor is defined as a method with the same name Person(...) that takes parameters (here NAME_PARAM and AGE_PARAM) and assigns them to the object’s attributes. The greet method outputs a greeting using the object’s NAME. To create an object instance, we use P = new Person("Alice", 30), then call P.greet().

This pseudocode mirrors typical class definitions. IB pseudocode does not have a formal this keyword; we assume inside methods that using the attribute name refers to the attribute of the current object. In an exam, you might be asked to construct pseudocode for a class or interpret how methods would work – for example, given UML or a scenario ￼ ￼. Key OOP concepts include encapsulation (attributes and methods packaged in classes), and you might also see inheritance or polymorphism in option material (though typically, Paper 1 focuses on class design and usage basics).

(Note: In IB exams, class-based questions in Paper 1 use pseudocode format, while the Option D (Java) questions use Java syntax. The example above is in pseudocode. The principles of classes – attributes, methods, instantiation – remain the same.)

File Handling (Read/Write Files)

File input/output is another practical topic (often HL). Python handles files with built-in functions like open(), and pseudocode has equivalent abstractions. In IB pseudocode, common operations are opening a file for reading or writing, reading lines, writing lines, and closing the file. These are often expressed with generic functions: e.g., openRead("filename"), openWrite("filename"), readLine(), writeLine(), and endOfFile() for checking end-of-file condition ￼ ￼.

Example: Read from a text file and then write to another file. (Pseudo assumes the files exist and are accessible.)

Python:

# Reading from a file
file = open("data.txt", "r")
for line in file:
    line = line.strip()         # remove newline character
    print(line)                 # output the line
file.close()

# Writing to a file
outFile = open("output.txt", "w")
outFile.write("Hello\n")
outFile.write("IB Computer Science\n")
outFile.close()

IB Pseudocode:

FILE = openRead("data.txt")
loop while NOT endOfFile(FILE)
    LINE = FILE.readLine()
    output LINE
end loop
close(FILE)

OUTFILE = openWrite("output.txt")
OUTFILE.writeLine("Hello")
OUTFILE.writeLine("IB Computer Science")
close(OUTFILE)

In the pseudocode, openRead("data.txt") opens the file for reading and returns a file handle (here stored in FILE) ￼. We then use a loop to read until end-of-file: endOfFile(FILE) returns true when we’ve read all data ￼. Inside the loop, FILE.readLine() reads a line from the file into LINE. We output the line. After the loop, we close(FILE) to release the file resource. For writing, openWrite("output.txt") opens a file for writing (creating or truncating it). We use OUTFILE.writeLine(...) to write lines of text ￼. Finally, close(OUTFILE) closes the output file ￼.

In an IB exam setting, you may be asked to write pseudocode to read from or write to files (for example, reading a CSV of data). The key is to show opening, looping to read or writing in the correct sequence, and closing the file. The pseudocode shown above demonstrates the typical structure.

Common Algorithms (Searching & Sorting)

Finally, we present some classic algorithms from the IB syllabus: searching algorithms (linear search and binary search) and sorting algorithms (bubble sort and merge sort). These algorithms are frequently discussed, and IB often expects students to understand and possibly write or trace them in pseudocode ￼ ￼. We provide both Python and pseudocode versions for each.

Linear Search

Linear search (sequential search) checks each element in a list/array one by one until it finds the target value or reaches the end ￼ ￼. It works on both sorted and unsorted data but is O(n) time complexity (inefficient for large lists).

Problem: Given an array ARRAY of length N and a value TARGET, find the index of TARGET in the array (or report not found).

Python (linear search):

found = False
for i in range(len(array)):
    if array[i] == target:
        print("Found at position", i)
        found = True
        break
if not found:
    print("Not found")

IB Pseudocode (linear search):

FOUND = false
loop INDEX from 0 to N - 1      // N is length of ARRAY
    if ARRAY[INDEX] = TARGET then
        output "Found at position ", INDEX
        FOUND = true
        break
    end if
end loop

if NOT FOUND then
    output "Not found"
end if

In this algorithm, we iterate through each index. If we find the target, we output the index and set a flag FOUND to true, then break out of the loop (in pseudocode, break exits the loop early, similar to Python) ￼. After the loop, if the flag is still false, we output “Not found”. In Python, we used a for loop and break. In pseudocode, a loop ... from ... to is used for iteration. The logic is straightforward. Linear search’s advantage is simplicity, but as noted, it can be slow for large arrays (checking each element) ￼.

Binary Search

Binary search is a faster algorithm to find an element in a sorted array. It uses a divide-and-conquer approach by repeatedly cutting the search range in half ￼. Time complexity is O(log n). Important: The array must be sorted for binary search to work correctly ￼ ￼.

Problem: Find TARGET in a sorted array ARRAY of length N.

Python (binary search, iterative):

low = 0
high = len(array) - 1
found = False
while low <= high and not found:
    mid = (low + high) // 2
    if array[mid] == target:
        found = True
    elif array[mid] < target:
        low = mid + 1      # target is in upper half
    else:
        high = mid - 1     # target is in lower half

if found:
    print("Found at position", mid)
else:
    print("Not found")

IB Pseudocode (binary search, iterative):

LOW = 0
HIGH = N - 1
FOUND = false

loop while LOW <= HIGH AND NOT FOUND
    MID = (LOW + HIGH) div 2
    if ARRAY[MID] = TARGET then
        FOUND = true
    else if ARRAY[MID] < TARGET then
        LOW = MID + 1      // target in upper half
    else
        HIGH = MID - 1     // target in lower half
    end if
end loop

if FOUND then
    output "Found at position ", MID
else
    output "Not found"
end if

This algorithm maintains a search window between LOW and HIGH indices. We check the middle element MID. If it matches the target, we found it. If the middle is less than the target, we know the target (if it exists) lies in the upper half of the array (so we move LOW up). If the middle is greater than the target, we move HIGH down to search the lower half ￼. The loop continues until the element is found or the window closes (LOW > HIGH means target not present). The pseudocode uses div for integer division to calculate MID ￼. We also use the logical operator AND and a NOT condition in the loop condition, which is allowed in IB pseudocode ￼. After the loop, it outputs the result accordingly. Binary search dramatically reduces the number of comparisons needed, but it requires data to be sorted in advance ￼.

Bubble Sort

Bubble sort is a simple sorting algorithm that repeatedly steps through the list, comparing adjacent pairs and swapping them if they are in the wrong order ￼. It continues passes through the list until no swaps are needed (meaning the list is sorted). Bubble sort is easy to understand but inefficient (O(n^2) time complexity), so mainly used for education or small datasets.

Python (bubble sort):

lst = [5, 2, 9, 1, 5, 6]  # example list
n = len(lst)
for i in range(n-1):
    for j in range(n-1):
        if lst[j] > lst[j+1]:
            # swap adjacent out-of-order elements
            lst[j], lst[j+1] = lst[j+1], lst[j]
print(lst)  # now sorted

IB Pseudocode (bubble sort):

N = length of LIST
loop for I from 0 to N - 2          // N-1 passes
    loop for J from 0 to N - 2      // compare adjacent pairs
        if LIST[J] > LIST[J+1] then
            // swap LIST[J] and LIST[J+1]
            TEMP = LIST[J]
            LIST[J] = LIST[J+1]
            LIST[J+1] = TEMP
        end if
    end loop
end loop

// Now LIST is sorted in ascending order

In this implementation, we perform (N-1) passes (I from 0 to N-2). On each pass, we iterate through the list (J from 0 to N-2) and compare each pair of adjacent elements. If an element is greater than the one following it, we swap them. After one full pass, the largest element will have “bubbled up” to the end of the list. The pseudocode explicitly swaps using a temporary variable, as is typical in algorithm descriptions. After all passes, the list is sorted. (In practice, one could check if any swap was made and break early if not, but we show the basic version.) The IB pseudocode reflects the algorithm definition; one could also use a while loop that runs until no swaps occur, but the above double-loop is a clear rendition of bubble sort logic ￼.

Merge Sort

Merge sort is a more advanced sorting algorithm (HL level) that uses recursion (divide-and-conquer). It splits the list into halves, recursively sorts each half, then merges the sorted halves. Its time complexity is O(n log n), which is much more efficient than bubble sort for large lists ￼.

Python (merge sort):

def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left_half = merge_sort(arr[:mid])
    right_half = merge_sort(arr[mid:])
    return merge(left_half, right_half)

def merge(left, right):
    result = []
    i = j = 0
    # merge two sorted lists
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    # collect any remaining elements
    result.extend(left[i:]) 
    result.extend(right[j:])
    return result

# Example usage:
unsorted = [38, 27, 43, 3, 9, 82, 10]
sorted_list = merge_sort(unsorted)
print(sorted_list)  
# Outputs sorted list: [3, 9, 10, 27, 38, 43, 82]

IB Pseudocode (merge sort):

method mergeSort(A)
    if length of A <= 1 then
        return A
    end if
    MID = (length of A) div 2
    LEFT = mergeSort( A[0 : MID - 1] )
    RIGHT = mergeSort( A[MID : length of A - 1] )
    return merge(LEFT, RIGHT)
end method

method merge(L1, L2)
    RESULT = new Collection()    // or new Array()
    I = 0
    J = 0
    loop while I < length of L1 AND J < length of L2
        if L1[I] <= L2[J] then
            RESULT.addItem( L1[I] )
            I = I + 1
        else
            RESULT.addItem( L2[J] )
            J = J + 1
        end if
    end loop
    // Add remaining elements (one of L1 or L2 may have leftovers)
    loop while I < length of L1
        RESULT.addItem( L1[I] )
        I = I + 1
    end loop
    loop while J < length of L2
        RESULT.addItem( L2[J] )
        J = J + 1
    end loop
    return RESULT
end method

// Example usage:
UNSORTED = [38, 27, 43, 3, 9, 82, 10]
SORTED = mergeSort(UNSORTED)
output SORTED    // [3, 9, 10, 27, 38, 43, 82]

Let’s break down the pseudocode:
	•	mergeSort(A): If the array has 0 or 1 elements, it’s already sorted, so return it. Otherwise, split the array into two halves LEFT and RIGHT (using indices – here A[0 : MID - 1] denotes the first half, and A[MID : length-1] the second half). Recursively call mergeSort on each half. Then merge the two sorted halves by calling merge(LEFT, RIGHT).
	•	merge(L1, L2): This takes two sorted lists and merges them into one sorted list. We create an empty collection RESULT to accumulate the merged output. Using two indices I and J, we loop while both lists have elements left. We compare the front elements of L1 and L2 and add the smaller (or equal) one to RESULT, incrementing the corresponding index. Once one list is exhausted, we exit the first loop. Then we have two loops to add any remaining elements from L1 or L2 to RESULT (only one of these loops will actually add items, since the other list would be empty at that point). Finally, return RESULT.

The use of RESULT.addItem(x) is based on IB’s collection operations (where a collection is like a dynamic array/list) ￼. We could also have used an array and managed an index for insertion. The above pseudocode closely follows the logic of the Python version. Merge sort uses recursion (notice mergeSort calls itself) and thus is a good example of an algorithm linking both the recursion and sorting topics in HL. It is more complex, but also much faster on large data sets than algorithms like bubble sort ￼. Merge sort’s divide-and-conquer approach is often highlighted in IB exams to discuss algorithm efficiency and recursion.

⸻

Each of the examples above illustrates how a given concept or algorithm can be implemented in Python and in IB pseudocode. The pseudocode syntax and structure are designed to be easily read and written by humans and are used on IB exams to demonstrate algorithmic thinking without getting bogged down in language-specific details ￼. By studying these side-by-side, students can learn to “translate” their understanding from Python (or other programming languages) into IB pseudocode, which is a key skill for Paper 1 of IB Computer Science ￼ ￼.

References

Below is a list of sources and documents referenced in compiling the above examples:
	•	International Baccalaureate (IB) – Approved notation for developing pseudocode (IB resource outlining pseudocode syntax and conventions) ￼ ￼.
	•	IB Computer Science Pseudocode examples and reference – IB standard pseudocode structures and methods (e.g., loops, array and string operations, etc.) ￼ ￼ ￼.
	•	DeepJain Pseudocode Guides – Educational resources explaining IB-style pseudocode for various constructs (Input/Output, If statements, Loops) ￼ ￼ ￼.
	•	RevisionDojo IB CS Guides (2025) – Articles on IB Computer Science algorithms and OOP, used for context on syllabus expectations (e.g., key algorithms and OOP principles) ￼ ￼ ￼.
	•	IB Computer Science Text/Notes – IB Computer Science – Computational Thinking (Mr. Lawson’s Classroom notes) for searching/sorting definitions and pseudocode snippets (binary search, selection sort) ￼ ￼.
	•	PseudoEditor (UK GCSE/A-level pseudocode reference) – Guide for file handling in pseudocode, whose functions (openRead, readLine, endOfFile, openWrite, writeLine, close) align with common pseudocode usage ￼ ￼ ￼.
	•	IB CompSci Hub / IB Documentation – General IB Computer Science references for pseudocode and Java subset (JETS) for OOP (to ensure proper understanding of IB-specific details) ￼.

All code examples have been adapted to follow the official IB pseudocode style while reflecting equivalent logic in Python. These examples span the full range of the IB Computer Science HL syllabus, from fundamental programming constructs to advanced algorithms and data structures, as guided by the referenced IB materials and reputable IB-aligned resources.