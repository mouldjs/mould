import spawn from 'cross-spawn'
import fs from 'fs'
import path from 'path'

import { transform } from '../compile/transform'

const appPath = path.join(__dirname, '..')
const tsconfigPath = path.join(__dirname, 'tsconfig.mould.json')
const tscPath = path.join(appPath, 'node_modules', '.bin', 'tsc')

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
    const time = process.hrtime()

    const child = spawn(tscPath, ['-p', tsconfigPath], { stdio: 'inherit' })

    child.on('close', (code) => {
        if (code === 0) {
            callback(process.hrtime(time))
        } else {
            console.error('Failed to compile TypeScript files')
        }
    })
}
