const api = require('../src/api').api;
api.init();

let User = api.inputDocument.components.schemas.User;

test('it has a User schema', () => {
  expect(User.properties.age.type).toEqual('number');
});
