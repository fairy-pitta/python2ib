import { convertPythonToIB } from './dist/converter.js';

// Test simple tuple assignment
const simpleTuple = `a, b = b, a`;

// Test tuple assignment in bubble sort context
const bubbleTuple = `arr[j], arr[j + 1] = arr[j + 1], arr[j]`;

// Test full bubble sort
const fullBubble = `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]`;

console.log('=== Testing Simple Tuple Assignment ===');
try {
    const result1 = convertPythonToIB(simpleTuple);
    console.log('Input:', simpleTuple);
    console.log('Output:', result1);
    console.log('Contains TEMP:', result1.includes('TEMP'));
} catch (error) {
    console.log('Error:', error.message);
}

console.log('\n=== Testing Bubble Sort Tuple Assignment ===');
try {
    const result2 = convertPythonToIB(bubbleTuple);
    console.log('Input:', bubbleTuple);
    console.log('Output:', result2);
    console.log('Contains TEMP:', result2.includes('TEMP'));
} catch (error) {
    console.log('Error:', error.message);
}

console.log('\n=== Testing Full Bubble Sort ===');
try {
    const result3 = convertPythonToIB(fullBubble);
    console.log('Output:');
    console.log(result3);
    console.log('\nAnalysis:');
    console.log('- Contains TEMP:', result3.includes('TEMP'));
    console.log('- Contains incomplete ARR[J]:', result3.includes('ARR[J]\n'));
    console.log('- Range calculation:', result3.includes('N - I - 1 - 1') ? 'WRONG (N - I - 1 - 1)' : result3.includes('N - I - 2') ? 'CORRECT (N - I - 2)' : 'UNCLEAR');
} catch (error) {
    console.log('Error:', error.message);
    console.log(error.stack);
}