const express = require('express')
const app = express()
const sum = require('./sum')
const port = 3000

let n = sum(1,1)
app.get('/', (req, res) => res.send(`Hello World! 1 + 1 = ${n}`))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
