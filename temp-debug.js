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

try {
    const result = convertPythonToIB(python);
    console.log('=== Actual Output (formatted) ===');
    console.log(result);
    console.log('\n=== Expected Output (formatted) ===');
    console.log(expected);
    
    console.log('\n=== Line by Line Comparison ===');
    const actualLines = result.split('\n');
    const expectedLines = expected.split('\n');
    
    const maxLines = Math.max(actualLines.length, expectedLines.length);
    for (let i = 0; i < maxLines; i++) {
        const actualLine = actualLines[i] || '[MISSING]';
        const expectedLine = expectedLines[i] || '[MISSING]';
        const match = actualLine === expectedLine ? '✓' : '✗';
        console.log(`${match} Line ${i + 1}:`);
        console.log(`  Expected: "${expectedLine}"`);
        console.log(`  Actual:   "${actualLine}"`);
        if (actualLine !== expectedLine) {
            console.log(`  Issue: Lines don't match`);
        }
    }
    
    console.log('\n=== Specific Issues Analysis ===');
    
    // Check for tuple assignment handling
    if (!result.includes('TEMP')) {
        console.log('❌ Missing tuple assignment (TEMP variable)');
        console.log('   The tuple assignment "arr[j], arr[j + 1] = arr[j + 1], arr[j]" should generate TEMP variable');
    } else {
        console.log('✅ TEMP variable found');
    }
    
    // Check for range calculation
    if (result.includes('N - I - 1 - 1')) {
        console.log('❌ Incorrect range calculation: found "N - I - 1 - 1", should be "N - I - 2"');
        console.log('   The range(0, n - i - 1) should convert to "0 to N - I - 2"');
    } else if (result.includes('N - I - 2')) {
        console.log('✅ Correct range calculation found');
    } else {
        console.log('❓ Range calculation unclear');
    }
    
    // Check for incomplete assignment
    if (result.includes('ARR[J]\n')) {
        console.log('❌ Incomplete tuple assignment detected');
        console.log('   Found "ARR[J]" followed by newline, indicating incomplete processing');
    } else {
        console.log('✅ No incomplete assignments detected');
    }
    
} catch (error) {
    console.log('=== Error ===');
    console.log(error.message);
    console.log(error.stack);
}