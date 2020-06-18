import fs from 'fs'
import path from 'path'

import compile from './compile'
import {
    COMPONENTS,
    COMPONENTS_DIRECTORY,
    MOULD_DIRECTORY,
    SCHEMA,
} from './constants'

const originalDirectory = process.cwd()

const appPath = path.join(__dirname, '..')
const componentsPath = path.join(appPath, COMPONENTS_DIRECTORY, COMPONENTS)
const mouldPath = path.join(originalDirectory, MOULD_DIRECTORY)
const schemaPath = path.join(mouldPath, SCHEMA)

if (fs.existsSync(schemaPath)) {
    compile(schemaPath, componentsPath)
} else if (fs.existsSync(mouldPath)) {
    console.warn(
        `You don't have Mould Schema at ${mouldPath}\n\n` +
            'You could begin by typing:\n\n' +
            '  mould dev\n'
    )
} else {
    console.warn(
        `You don't have ${MOULD_DIRECTORY} initialized at ${originalDirectory}\n\n` +
            'You could start by typing:\n\n' +
            '  mould init\n'
    )
}
