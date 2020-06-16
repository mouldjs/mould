import fs from 'fs'
import path from 'path'

import { COMPONENTS_DIRECTORY, MOULD_DIRECTORY } from './constants'

import { transform } from '../compile/transform'

const originalDirectory: string = process.cwd()

const appPath = path.join(__dirname, '..')
const componentsPath = path.join(appPath, COMPONENTS_DIRECTORY, 'index.js')
const mouldPath = path.join(originalDirectory, MOULD_DIRECTORY)
const schemaPath = path.join(mouldPath, '.mould')

if (fs.existsSync(schemaPath)) {
    const time = process.hrtime()

    fs.readFile(schemaPath, 'utf8', (err, schema) => {
        if (err) {
            console.error('Failed to read Mould Schema\n' + err)
            process.exit(1)
        }

        fs.writeFile(
            componentsPath,
            transform(JSON.parse(schema)),
            'utf8',
            (err) => {
                if (err) {
                    console.error('Failed to write Mould Components\n' + err)
                    process.exit(1)
                }

                const [s, ns] = process.hrtime(time)
                console.log(
                    `Compiled Mould Components successfully in ${s}s ${
                        ns / 1e6
                    }ms`
                )
            }
        )
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
