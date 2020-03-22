// this file provides our first and only test, an excuse to run jest on every build so that we hopefully always ship working code and add tests for our new features
const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
