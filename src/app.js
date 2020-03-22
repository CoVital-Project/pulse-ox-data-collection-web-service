const express = require('express')
const app = express()
const port = 3000

// proof that we can import a locally defined module
const sum = require('./sum')

let n = sum(1,1)

// proof that our imported module executes
app.get('/', (req, res) => res.send(`Hello World! 1 + 1 = ${n}`))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
