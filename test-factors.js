import { convertPythonToIB } from './dist/index.js';

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
loop until F * F > NUM
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

console.log('Python code:');
console.log(python);
console.log('\n--- Converting ---\n');

const result = convertPythonToIB(python);
console.log('Converted result:');
console.log(result);
console.log('\nExpected result:');
console.log(expected);
console.log('\nMatch:', result === expected);