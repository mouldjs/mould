'use strict'

const fs = require('fs')
const path = require('path')

const {
    MOULD_DIRECTORY,
    RESOLVERS,
    SYMLINK_MOULD_DIRECTORY,
} = require('./constants')

const appPath = path.join(__dirname, '..')
const originalDirectory = process.cwd()

const mouldPath = path.join(originalDirectory, MOULD_DIRECTORY)
const resolversPath = path.join(mouldPath, RESOLVERS)
const symlinkMouldPath = path.join(appPath, SYMLINK_MOULD_DIRECTORY)

if (fs.existsSync(mouldPath)) {
    console.warn(
        `You already have ${MOULD_DIRECTORY} initialized at ${originalDirectory}`
    )
} else {
    fs.mkdirSync(mouldPath)

    console.log(`Created ${MOULD_DIRECTORY} directory at ${originalDirectory}`)
}

if (!fs.existsSync(resolversPath)) {
    fs.writeFileSync(resolversPath, 'export default {}')

    console.log(`Created ${RESOLVERS} at ${mouldPath}`)
}

if (fs.existsSync(symlinkMouldPath)) {
    fs.unlinkSync(symlinkMouldPath)
}
fs.symlinkSync(mouldPath, symlinkMouldPath, 'dir')

console.log('\nYou could begin by typing:\n\n' + '  mould dev\n')
