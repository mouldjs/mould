import spawn from 'cross-spawn'
import fs from 'fs'
import path from 'path'

import * as paths from './paths'

import { transform } from '../compile/transform'

export function compileSchema(schemaPath, componentsPath, callback) {
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

                callback(process.hrtime(time))
            }
        )
    })
}

export function compileTs(callback) {
    const tsconfig = path.join(__dirname, 'tsconfig.components.json')
    const time = process.hrtime()

    const child = spawn(paths.bin.tsc, ['-p', tsconfig], { stdio: 'inherit' })

    child.on('close', (code) => {
        if (code === 0) {
            callback(process.hrtime(time))
        } else {
            console.error('Failed to compile TypeScript files')
        }
    })
}
