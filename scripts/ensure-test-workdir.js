const fs = require('fs')

const path = './test-mould'
fs.existsSync(path) || fs.mkdirSync(path)
