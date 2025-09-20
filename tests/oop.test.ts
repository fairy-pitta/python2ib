import { describe, it, expect } from 'vitest';
import { convertPythonToIB } from '../src/index.js';

describe('Object-Oriented Programming Tests', () => {
  describe('Class Definition', () => {
    it('should convert simple class definition', () => {
      const python = `class Person:
    pass`;
      const result = convertPythonToIB(python);
      expect(result).toContain('CLASS Person');
      expect(result).toContain('ENDCLASS');
    });

    it('should convert class with constructor', () => {
      const python = `class Person:
    def __init__(self, name):
        self.name = name`;
      const result = convertPythonToIB(python);
      expect(result).toContain('CLASS Person');
      expect(result).toContain('CONSTRUCTOR');
      expect(result).toContain('name = name');
      expect(result).toContain('ENDCONSTRUCTOR');
      expect(result).toContain('ENDCLASS');
    });

    it('should convert class with multiple attributes in constructor', () => {
      const python = `class Student:
    def __init__(self, name, age, grade):
        self.name = name
        self.age = age
        self.grade = grade`;
      const result = convertPythonToIB(python);
      expect(result).toContain('CLASS Student');
      expect(result).toContain('CONSTRUCTOR(NAME, AGE, GRADE)');
      expect(result).toContain('SELF.name = name');
      expect(result).toContain('SELF.age = age');
      expect(result).toContain('SELF.grade = grade');
    });
  });

  describe('Method Definition', () => {
    it('should convert instance method without return', () => {
      const python = `class Person:
    def greet(self):
        print("Hello")`;
      const result = convertPythonToIB(python);
      expect(result).toContain('CLASS Person');
      expect(result).toContain('procedure greet()');
      expect(result).toContain('output "Hello"');
      expect(result).toContain('end procedure');
    });

    it('should convert instance method with return', () => {
      const python = `class Person:
    def get_name(self):
        return self.name`;
      const result = convertPythonToIB(python);
      expect(result).toContain('CLASS Person');
      expect(result).toContain('function getName()');
      expect(result).toContain('return SELF.name');
      expect(result).toContain('end function');
    });

    it('should convert method with parameters', () => {
      const python = `class Calculator:
    def add(self, a, b):
        return a + b`;
      const result = convertPythonToIB(python);
      expect(result).toContain('CLASS Calculator');
      expect(result).toContain('function add(A, B)');
      expect(result).toContain('return A + B');
    });

    it('should convert method that modifies instance variables', () => {
      const python = `class Counter:
    def increment(self):
        self.count = self.count + 1`;
      const result = convertPythonToIB(python);
      expect(result).toContain('procedure increment()');
      expect(result).toContain('SELF.count = SELF.count + 1');
    });
  });

  describe('Class Instantiation', () => {
    it('should convert object instantiation', () => {
      const python = `person = Person()`;
      const result = convertPythonToIB(python);
      expect(result).toContain('PERSON = NEW Person()');
    });

    it('should convert object instantiation with parameters', () => {
      const python = `student = Student("Alice", 20, "A")`;
      const result = convertPythonToIB(python);
      expect(result).toContain('STUDENT = NEW Student("Alice", 20, "A")');
    });
  });

  describe('Method Calls', () => {
    it('should convert method call without parameters', () => {
      const python = `person.greet()`;
      const result = convertPythonToIB(python);
      expect(result).toContain('PERSON.greet()');
    });

    it('should convert method call with parameters', () => {
      const python = `result = calculator.add(5, 3)`;
      const result = convertPythonToIB(python);
      expect(result).toContain('RESULT = CALCULATOR.add(5, 3)');
    });

    it('should convert chained method calls', () => {
      const python = `result = person.get_address().get_city()`;
      const result = convertPythonToIB(python);
      expect(result).toContain('RESULT = PERSON.get_address().get_city()');
    });
  });

  describe('Attribute Access', () => {
    it('should convert attribute access', () => {
      const python = `name = person.name`;
      const result = convertPythonToIB(python);
      expect(result).toContain('NAME = PERSON.name');
    });

    it('should convert attribute assignment', () => {
      const python = `person.age = 25`;
      const result = convertPythonToIB(python);
      expect(result).toContain('PERSON.age = 25');
    });

    it('should convert nested attribute access', () => {
      const python = `city = person.address.city`;
      const result = convertPythonToIB(python);
      expect(result).toContain('CITY = PERSON.address.city');
    });
  });

  describe('Inheritance', () => {
    it('should convert simple inheritance', () => {
      const python = `class Student(Person):
    pass`;
      const result = convertPythonToIB(python);
      expect(result).toContain('CLASS Student INHERITS Person');
      expect(result).toContain('ENDCLASS');
    });

    it('should convert inheritance with constructor', () => {
      const python = `class Student(Person):
    def __init__(self, name, grade):
        super().__init__(name)
        self.grade = grade`;
      const result = convertPythonToIB(python);
      expect(result).toContain('CLASS Student INHERITS Person');
      expect(result).toContain('CONSTRUCTOR(NAME, GRADE)');
      expect(result).toContain('super().__init__(NAME)');
      expect(result).toContain('SELF.grade = grade');
    });

    it('should convert method overriding', () => {
      const python = `class Student(Person):
    def greet(self):
        print("Hi, I am a student")`;
      const result = convertPythonToIB(python);
      expect(result).toContain('CLASS Student INHERITS Person');
      expect(result).toContain('procedure greet()');
      expect(result).toContain('output "Hi, I am a student"');
    });
  });

  describe('Complex Class Examples', () => {
    it('should convert complete class with multiple methods', () => {
      const python = `class BankAccount:
    def __init__(self, balance):
        self.balance = balance
    
    def deposit(self, amount):
        self.balance = self.balance + amount
    
    def withdraw(self, amount):
        if self.balance >= amount:
            self.balance = self.balance - amount
            return True
        return False
    
    def get_balance(self):
        return self.balance`;
      
      const result = convertPythonToIB(python);
      expect(result).toContain('CLASS BankAccount');
      expect(result).toContain('CONSTRUCTOR(BALANCE)');
      expect(result).toContain('procedure deposit(AMOUNT)');
      expect(result).toContain('function withdraw(AMOUNT)');
      expect(result).toContain('function getBalance()');
      expect(result).toContain('if SELF.balance >= AMOUNT then');
      expect(result).toContain('return true');
      expect(result).toContain('return false');
      expect(result).toContain('ENDCLASS');
    });

    it('should convert class usage with instantiation and method calls', () => {
      const python = `account = BankAccount(1000)
account.deposit(500)
balance = account.get_balance()
print(balance)`;
      
      const result = convertPythonToIB(python);
      expect(result).toContain('ACCOUNT = NEW BankAccount(1000)');
      expect(result).toContain('ACCOUNT.deposit(500)');
      expect(result).toContain('BALANCE = ACCOUNT.get_balance()');
      expect(result).toContain('output BALANCE');
    });
  });

  describe('Static Methods and Class Methods', () => {
    it('should convert static method', () => {
      const python = `class MathUtils:
    @staticmethod
    def add(a, b):
        return a + b`;
      const result = convertPythonToIB(python);
      expect(result).toContain('CLASS MathUtils');
      expect(result).toContain('STATIC FUNCTION add(A, B) RETURNS value');
      expect(result).toContain('return A + B');
    });

    it('should convert class method', () => {
      const python = `class Person:
    @classmethod
    def create_anonymous(cls):
        return cls("Anonymous")`;
      const result = convertPythonToIB(python);
      expect(result).toContain('CLASS Person');
      expect(result).toContain('CLASS FUNCTION createAnonymous() RETURNS value');
      expect(result).toContain('return cls("Anonymous")');
    });
  });

  describe('Properties', () => {
    it('should convert property getter', () => {
      const python = `class Circle:
    @property
    def area(self):
        return 3.14 * self.radius * self.radius`;
      const result = convertPythonToIB(python);
      expect(result).toContain('CLASS Circle');
      expect(result).toContain('PROPERTY area');
      expect(result).toContain('GET');
      expect(result).toContain('return 3.14 * SELF.radius * SELF.radius');
      expect(result).toContain('ENDGET');
      expect(result).toContain('ENDPROPERTY');
    });

    it('should convert property setter', () => {
      const python = `class Circle:
    @area.setter
    def area(self, value):
        self.radius = (value / 3.14) ** 0.5`;
      const result = convertPythonToIB(python);
      expect(result).toContain('SET(value)');
      expect(result).toContain('radius = value div 3.14 ^ 0.5');
      expect(result).toContain('ENDSET');
    });
  });
});