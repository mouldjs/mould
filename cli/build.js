import chalk from 'chalk'
import fs from 'fs'
import path from 'path'

import { compileSchema, compileTs } from './compile'
import {
    copyByExtension,
    copyByExtensionWithExtensionReplacement,
} from './copy'
import * as paths from './paths'
import { existsSyncWithExtension } from './utils'

if (fs.existsSync(paths.app.schema)) {
    const time = process.hrtime()

    Promise.all([
        compileSchema(paths.app.schema, paths.mould.components),
        existsSyncWithExtension(paths.app.mouldDirectory, '.ts') &&
            copyByExtension(
                paths.app.mouldDirectory,
                paths.mould.componentsDirectory,
                '.ts'
            ),
        existsSyncWithExtension(paths.app.mouldDirectory, '.js') &&
            copyByExtensionWithExtensionReplacement(
                paths.app.mouldDirectory,
                paths.mould.componentsDirectory,
                '.js',
                '.ts'
            ),
    ])
        .then(compileTs)
        .then(() => {
            const [s, ns] = process.hrtime(time)

            console.log(
                `Built Mould Components successfully in ${s}s ${ns / 1e6}ms`
            )
        })
        .catch((error) => {
            console.error('Failed to build Mould Components\n' + error)
        })
} else if (fs.existsSync(paths.app.mouldDirectory)) {
    console.warn(
        `You don't have Mould Schema ` +
            `at ${chalk.green(paths.app.mouldDirectory)}\n\n` +
            'You could begin by typing:\n\n' +
            `  ${chalk.cyan('npx mould dev')}\n\n` +
            `Or you could add ${chalk.cyan('mould dev')} to your ${chalk.green(
                'package.json'
            )} scripts\n`
    )
} else {
    console.warn(
        `You don't have ${chalk.green(
            path.basename(paths.app.mouldDirectory)
        )} initialized at ${chalk.green(paths.app.directory)}\n\n` +
            'You could start by typing:\n\n' +
            `  ${chalk.cyan('npx mould init')}\n`
    )
}
