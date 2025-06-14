import { convertPythonToIB } from './dist/converter.js';

try {
  const python = 'x = 5\nprint(x)';
  const result = convertPythonToIB(python);
  console.log('Success:');
  console.log(result);
} catch (error) {
  console.error('Error:', error.message);
}