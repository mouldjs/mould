'use strict'

const fs = require('fs')
const path = require('path')

const { MOULD_DIRECTORY } = require('./constants')

const originalDirectory = process.cwd()
const mouldPath = path.join(originalDirectory, MOULD_DIRECTORY)

if (fs.existsSync(mouldPath)) {
    console.warn(
        `You already have ${MOULD_DIRECTORY} initialized at ${originalDirectory}\n`
    )
} else {
    fs.mkdirSync(mouldPath)

    console.log(
        `Created ${MOULD_DIRECTORY} directory at ${originalDirectory}\n`
    )
}

console.log('You could begin by typing:\n\n' + '  mould dev\n')
