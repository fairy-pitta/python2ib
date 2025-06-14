import { convertPythonToIB } from './dist/converter.js';

const python = `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]`;

const expected = `PROCEDURE bubbleSort(ARR)
    N = SIZE(ARR)
    loop I from 0 to N - 1
        loop J from 0 to N - I - 2
            if ARR[J] > ARR[J + 1] then
                TEMP = ARR[J]
                ARR[J] = ARR[J + 1]
                ARR[J + 1] = TEMP
            end if
        end loop
    end loop
end PROCEDURE`;

console.log('=== Python Input ===');
console.log(JSON.stringify(python));
console.log('\n=== Expected Output ===');
console.log(JSON.stringify(expected));

try {
    const result = convertPythonToIB(python);
    console.log('\n=== Actual Output ===');
    console.log(JSON.stringify(result));
    
    console.log('\n=== Character by Character Comparison ===');
    const minLength = Math.min(expected.length, result.length);
    for (let i = 0; i < minLength; i++) {
        if (expected[i] !== result[i]) {
            console.log(`Difference at position ${i}:`);
            console.log(`Expected: '${expected[i]}' (${expected.charCodeAt(i)})`);
            console.log(`Actual:   '${result[i]}' (${result.charCodeAt(i)})`);
            break;
        }
    }
    
    if (expected.length !== result.length) {
        console.log(`Length difference: expected ${expected.length}, got ${result.length}`);
    }
    
    console.log('\n=== Match Result ===');
    console.log('Match:', result === expected);
} catch (error) {
    console.log('\n=== Error ===');
    console.log(error.message);
    console.log(error.stack);
}