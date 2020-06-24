import fs from 'fs'

import { compileSchema, compileTs } from './compile'
import { copyByExtension } from './copy'
import * as paths from './paths'
import { existsSyncWithExtension } from './utils'

if (fs.existsSync(paths.app.schema)) {
    const compileSchemaTime = process.hrtime()

    compileSchema(paths.app.schema, paths.mould.components)
        .then(() => {
            const [s, ns] = process.hrtime(compileSchemaTime)

            console.log(
                `Compiled Mould Schema successfully in ${s}s ${ns / 1e6}ms`
            )
        })
        .catch((error) => {
            console.error('Failed to compile Mould Schema\n' + error)
        })

    if (existsSyncWithExtension(paths.app.mouldDirectory, '.ts')) {
        const compileTsTime = process.hrtime()

        copyByExtension(
            paths.app.mouldDirectory,
            paths.mould.componentsDirectory,
            '.ts'
        )
            .then(compileTs)
            .then(() => {
                const [s, ns] = process.hrtime(compileTsTime)

                console.log(
                    `Compiled TypeScript successfully in ${s}s ${ns / 1e6}ms`
                )
            })
            .catch((error) => {
                console.error('Failed to compile TypeScript\n' + error)
            })
    }
    if (existsSyncWithExtension(paths.app.mouldDirectory, '.js')) {
        const copyJsTime = process.hrtime()

        copyByExtension(
            paths.app.mouldDirectory,
            paths.mould.componentsDirectory,
            '.js'
        )
            .then(() => {
                const [s, ns] = process.hrtime(copyJsTime)

                console.log(
                    `Copied JavaScript successfully in ${s}s ${ns / 1e6}ms`
                )
            })
            .catch((error) => {
                console.error('Failed to copy JavaScript\n' + error)
            })
    }
} else if (fs.existsSync(paths.app.mouldDirectory)) {
    console.warn(
        `You don't have Mould Schema ` +
            `at ${paths.app.mouldDirectory}\n\n` +
            'You could begin by typing:\n\n' +
            '  mould dev\n'
    )
} else {
    console.warn(
        `You don't have ${path.basename(paths.app.mouldDirectory)} ` +
            `initialized at ${paths.app.directory}\n\n` +
            'You could start by typing:\n\n' +
            '  mould init\n'
    )
}
