'use strict'

const fs = require('fs')

const currentDir = process.cwd()
const mouldDir = 'mould'
const mouldPath = `./${mouldDir}`

if (fs.existsSync(mouldPath)) {
    console.warn(`You already have ${mouldDir} initialized at ${currentDir}\n`)
} else {
    fs.mkdirSync(mouldPath)

    console.log(`Created ${mouldDir} directory at ${currentDir}\n`)
}

console.log('You could begin by typing:\n\n' + '  mould dev\n')
