const { convertPythonToIB } = require('./src/index.ts');

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

console.log('=== ACTUAL OUTPUT ===');
const actual = convertPythonToIB(python);
console.log(actual);
console.log('\n=== EXPECTED OUTPUT ===');
console.log(expected);
console.log('\n=== COMPARISON ===');
console.log('Match:', actual === expected);

// Line by line comparison
const actualLines = actual.split('\n');
const expectedLines = expected.split('\n');
console.log('\n=== LINE BY LINE COMPARISON ===');
for (let i = 0; i < Math.max(actualLines.length, expectedLines.length); i++) {
  const actualLine = actualLines[i] || '';
  const expectedLine = expectedLines[i] || '';
  const match = actualLine === expectedLine;
  console.log(`Line ${i + 1}: ${match ? '✓' : '✗'}`);
  if (!match) {
    console.log(`  Actual:   "${actualLine}"`);
    console.log(`  Expected: "${expectedLine}"`);
  }
}