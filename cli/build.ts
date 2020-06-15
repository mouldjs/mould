import fs from 'fs'
import path from 'path'

import { MOULD_DIRECTORY } from './constants'

import { transform } from '../compile/transform'

const originalDirectory: string = process.cwd()

const mouldPath = path.join(originalDirectory, MOULD_DIRECTORY)
const schemaPath = path.join(mouldPath, '.mould')

if (fs.existsSync(schemaPath)) {
    fs.readFile(schemaPath, 'utf8', (err, schema) => {
        console.log(transform(JSON.parse(schema)))
    })
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
