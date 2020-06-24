import spawn from 'cross-spawn'
import fs from 'fs'
import path from 'path'

import * as paths from './paths'

import { transform } from '../compile/transform'

export async function compileSchema(schemaPath, componentsPath) {
    const schema = await fs.promises.readFile(schemaPath, 'utf8')

    await fs.promises.writeFile(componentsPath, transform(JSON.parse(schema)))
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
