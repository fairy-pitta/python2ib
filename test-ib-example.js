import { convertPythonToIB } from './dist/converter.js';

try {
  const python = `name = input("Enter your name: ")
age = int(input("Enter your age: "))
if age >= 18:
    print(f"Hello {name}, you are an adult")
else:
    print(f"Hello {name}, you are a minor")`;
  
  console.log('Input Python code:');
  console.log(python);
  console.log('\n--- Converting ---\n');
  
  const result = convertPythonToIB(python);
  console.log('Converted result:');
  console.log(result);
  
  const expected = `output "Enter your name: "
INPUT NAME
output "Enter your age: "
INPUT AGE
if AGE >= 18 then
    output "Hello " + NAME + ", you are an adult"
else
    output "Hello " + NAME + ", you are a minor"
end if`;
  
  console.log('\nExpected result:');
  console.log(expected);
  
  console.log('\nMatch:', result === expected);
  
} catch (error) {
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
}