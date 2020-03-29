const { Enforcer } = require('openapi-enforcer');
const schemaDoc = require('../src/api_schema');

test('schema is valid OpenAPIV3', () =>{
    return Enforcer(schemaDoc, { fullResult: true} )
        .then( ({ error, warning }) => {
            expect(error).toBeUndefined();
            expect(warning).toBeUndefined();
        }).catch((err) => {
            expect(err).toBeUndefined();
    });
});
