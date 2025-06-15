import { describe, it, expect } from 'vitest';

import { convertPythonToIB } from '../src/converter';

/**
 * Tests based on actual IB Pseudocode examples from IB-pseudocode-rules.md
 * These represent real-world scenarios that students would encounter
 */
describe('IB Pseudocode Examples Conversion', () => {
  
  describe('Array Averaging Example', () => {
    it('should convert array averaging algorithm', () => {
      const python = `count = 0
total = 0
for i in range(1000):
    if stock[i] > 0:
        count = count + 1
        total = total + stock[i]
if count != 0:
    avg = total / count
    print(avg)
else:
    print("No non-zero values")`;
      
      const expected = `COUNT = 0
TOTAL = 0
loop I from 0 to 999
    if STOCK[I] > 0 then
        COUNT = COUNT + 1
        TOTAL = TOTAL + STOCK[I]
    end if
end loop
if NOT COUNT = 0 then
    AVG = TOTAL / COUNT
    output AVG
else
    output "No non-zero values"
end if`;
      
      expect(convertPythonToIB(python)).toBe(expected);
    });
  });

  describe('Copy Unique from Collection Example', () => {
    it('should convert unique copying algorithm', () => {
      const python = `count = 0
while names.has_next():
    data = names.get_next()
    found = False
    for i in range(count):
        if data == list_arr[i]:
            found = True
    if found == False:
        list_arr[count] = data
        count = count + 1`;
      
      const expected = `COUNT = 0
loop while NAMES.hasNext()
    DATA = NAMES.getNext()
    FOUND = false
    loop I from 0 to COUNT - 1
        if DATA = LIST[I] then
            FOUND = true
        end if
    end loop
    if FOUND = false then
        LIST[COUNT] = DATA
        COUNT = COUNT + 1
    end if
end loop`;
      
      expect(convertPythonToIB(python)).toBe(expected);
    });
  });

  describe('Factors Example', () => {
    it('should convert factor finding algorithm', () => {
      const python = `num = 140
f = 1
factors = 0
while f * f <= num:
    if num % f == 0:
        d = num // f
        print(f, "*", d)
        if f == 1:
            factors = factors + 0
        elif f == d:
            factors = factors + 1
        else:
            factors = factors + 2
    f = f + 1
print(factors)`;
      
      const expected = `NUM = 140
F = 1
FACTORS = 0
loop while F * F <= NUM
    if NUM mod F = 0 then
        D = NUM div F
        output F, "*", D
        if F = 1 then
            FACTORS = FACTORS + 0
        else if F = D then
            FACTORS = FACTORS + 1
        else
            FACTORS = FACTORS + 2
        end if
    end if
    F = F + 1
end loop
output FACTORS`;
      
      expect(convertPythonToIB(python)).toBe(expected);
    });
  });

  describe('Reverse Collection Example', () => {
    it('should convert collection reversal using stack', () => {
      const python = `count = 0
while survey.has_next():
    stack.push(survey.get_next())
    count = count + 1
for i in range(count):
    myarray[i] = stack.pop()`;
      
      const expected = `COUNT = 0
loop while SURVEY.hasNext()
    STACK.push(SURVEY.getNext())
    COUNT = COUNT + 1
end loop
loop I from 0 to COUNT - 1
    MYARRAY[I] = STACK.pop()
end loop`;
      
      expect(convertPythonToIB(python)).toBe(expected);
    });
  });

  describe('String Comparison Example', () => {
    it('should convert string comparison from IB rules', () => {
      const python = `myword = "the"
if myword == "the":
    print(myword)`;
      
      const expected = `MYWORD = "the"
if MYWORD = "the" then
    output MYWORD
end if`;
      
      expect(convertPythonToIB(python)).toBe(expected);
    });
  });

  describe('Collection Methods Example', () => {
    it('should convert collection iteration pattern', () => {
      const python = `col.reset_next()
while col.has_next():
    item = col.get_next()
    print(item)`;
      
      const expected = `COL.resetNext()
loop while COL.hasNext()
    ITEM = COL.getNext()
    output ITEM
end loop`;
      
      expect(convertPythonToIB(python)).toBe(expected);
    });
  });

  describe('Stack Operations Example', () => {
    it('should convert stack operations', () => {
      const python = `stack.push(42)
val = stack.pop()
if not stack.is_empty():
    print("Stack not empty")`;
      
      const expected = `STACK.push(42)
VAL = STACK.pop()
if NOT STACK.isEmpty() then
    output "Stack not empty"
end if`;
      
      expect(convertPythonToIB(python)).toBe(expected);
    });
  });

  describe('Queue Operations Example', () => {
    it('should convert queue operations', () => {
      const python = `queue.enqueue("A")
x = queue.dequeue()
if not queue.is_empty():
    print("Queue not empty")`;
      
      const expected = `QUEUE.enqueue("A")
X = QUEUE.dequeue()
if NOT QUEUE.isEmpty() then
    output "Queue not empty"
end if`;
      
      expect(convertPythonToIB(python)).toBe(expected);
    });
  });

  describe('Complex Algorithm Example', () => {
    it('should convert binary search algorithm', () => {
      const python = `def binary_search(arr, target):
    left = 0
    right = len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`;
      
      const expected = `FUNCTION binarySearch(ARR, TARGET) RETURNS value
    LEFT = 0
    RIGHT = SIZE(ARR) - 1
    loop while LEFT <= RIGHT
        MID = (LEFT + RIGHT) div 2
        if ARR[MID] = TARGET then
            RETURN MID
        else if ARR[MID] < TARGET then
            LEFT = MID + 1
        else
            RIGHT = MID - 1
        end if
    end loop
    RETURN -1
end FUNCTION`;
      
      expect(convertPythonToIB(python)).toBe(expected);
    });
  });

  describe('Input/Output Pattern Example', () => {
    it('should convert typical input/output pattern', () => {
      const python = `name = input("Enter your name: ")
age = int(input("Enter your age: "))
if age >= 18:
    print(f"Hello {name}, you are an adult")
else:
    print(f"Hello {name}, you are a minor")`;
      
      const expected = `output "Enter your name: "
INPUT NAME
output "Enter your age: "
INPUT AGE
if AGE >= 18 then
    output "Hello " + NAME + ", you are an adult"
else
    output "Hello " + NAME + ", you are a minor"
end if`;
      
      expect(convertPythonToIB(python)).toBe(expected);
    });
  });
});