import spawn from 'cross-spawn'
import fs from 'fs'
import path from 'path'

import * as paths from './paths'

import { transform } from '../compile/transform'

export async function compileSchema(schemaPath, componentsPath) {
    const schema = await fs.promises.readFile(schemaPath, 'utf8')

    await fs.promises.writeFile(componentsPath, transform(JSON.parse(schema)))
}

export function compileTs() {
    return new Promise((resolve, reject) => {
        const tsconfig = path.join(__dirname, 'tsconfig.components.json')

        const tscProcess = spawn(paths.bin.tsc, ['-p', tsconfig], { stdio: 'inherit' })

        tscProcess.on('close', code => code === 0
            ? resolve(code)
            : reject(code),
        )
        tscProcess.on('error', reject)
    })
}
