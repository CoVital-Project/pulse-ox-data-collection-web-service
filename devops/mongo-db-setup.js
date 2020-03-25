
// @ts-ignore
use instancename;
db.createUser(
    { user: 'backenduser', pwd: 'backendpassword', roles: [{ 'role': 'readWrite', 'db': 'instancename' }] },
    { w: "majority", wtimeout: 5000 }
);

db.init.insert({ "init": "true" });