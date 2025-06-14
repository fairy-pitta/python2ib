import { convertPythonToIB } from './dist/converter.js';

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

console.log('Result:');
console.log(convertPythonToIB(python));
console.log('\n---\nExpected:');
console.log(`COUNT = 0
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
end loop`);