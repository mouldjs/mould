'use strict'

const spawn = require('cross-spawn')
const fs = require('fs')
const path = require('path')

const { MOULD_DIRECTORY } = require('./constants')

const originalDirectory = process.cwd()
const appPath = path.join(__dirname, '..')
const mouldPath = path.join(originalDirectory, MOULD_DIRECTORY)

if (fs.existsSync(mouldPath)) {
    spawn('bash', ['-c', `cd ${appPath} && WORKDIR=${mouldPath} next dev`], {
        stdio: 'inherit',
    })
} else {
    console.warn(
        `You don't have ${MOULD_DIRECTORY} initialized at ${originalDirectory}\n\n` +
            'You could start by typing:\n\n' +
            '  mould init\n'
    )
}
