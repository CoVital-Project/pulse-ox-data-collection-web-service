// this module's purpose is to prove that our main webapp can import other modules.
// it also exists so that we can prove that our test harness works as sum.test.js executes via jest.
function sum(a, b) {
  return a + b;
}
module.exports = sum;
