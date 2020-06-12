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
const nextPath = path.join(appPath, 'node_modules', '.bin', 'next')

if (fs.existsSync(mouldPath)) {
    if (fs.existsSync(symlinkMouldPath)) {
        fs.unlinkSync(symlinkMouldPath)
    }
    fs.symlinkSync(mouldPath, symlinkMouldPath, 'dir')

    const cdToAppDir = `cd ${appPath}`
    const setWorkdirEnvVar = `WORKDIR=${mouldPath}`
    const runNextDev = `${nextPath} dev`

    if (
        process.platform === 'win32' ||
        process.env.OSTYPE === 'msys' ||
        process.env.OSTYPE === 'cygwin'
    ) {
        spawn(
            'cmd.exe',
            ['/c', `${cdToAppDir} && set ${setWorkdirEnvVar} && ${runNextDev}`],
            { stdio: 'inherit' }
        )
    } else {
        spawn(
            'bash',
            ['-c', `${cdToAppDir} && ${setWorkdirEnvVar} ${runNextDev}`],
            { stdio: 'inherit' }
        )
    }

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
