'use strict'

const spawn = require('cross-spawn')
const fs = require('fs')
const { debounce } = require('lodash')
const path = require('path')

const { MOULD_DIRECTORY, SYMLINK_MOULD_DIRECTORY } = require('./constants')

const originalDirectory = process.cwd()

const appPath = path.join(__dirname, '..')
const mouldPath = path.join(originalDirectory, MOULD_DIRECTORY)
const symlinkMouldPath = path.join(appPath, SYMLINK_MOULD_DIRECTORY)

if (fs.existsSync(mouldPath)) {
    if (fs.existsSync(symlinkMouldPath)) {
        fs.unlinkSync(symlinkMouldPath)
    }
    fs.symlinkSync(mouldPath, symlinkMouldPath, 'dir')

    spawn('bash', ['-c', `cd ${appPath} && WORKDIR=${mouldPath} next dev`], {
        stdio: 'inherit',
    })

    fs.watch(
        mouldPath,
        debounce((event, filename) => {
            if (filename) {
                console.log(`${filename} file was changed`)
            }
        }, 500)
    )
} else {
    console.warn(
        `You don't have ${MOULD_DIRECTORY} initialized at ${originalDirectory}\n\n` +
            'You could start by typing:\n\n' +
            '  mould init\n'
    )
}
