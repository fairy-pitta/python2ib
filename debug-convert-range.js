import { SPECIAL_CONSTRUCTS } from './dist/utils/keywords.js';

const rangeArgs = ['3'];

console.log('=== Range Args ===');
console.log(rangeArgs);
console.log();

try {
    const range = SPECIAL_CONSTRUCTS.convertRange(rangeArgs);
    console.log('=== Converted Range ===');
    console.log('Start:', range.start);
    console.log('End:', range.end);
    console.log('Step:', range.step);
} catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
}