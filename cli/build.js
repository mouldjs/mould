import fs from 'fs'
import path from 'path'

import { compileSchema, compileTs } from './compile'
import {
    COMPONENTS,
    COMPONENTS_DIRECTORY,
    MOULD_DIRECTORY,
    SCHEMA,
} from './constants'
import { copyJs } from './copy'
import { existsSyncWithExtension } from './utils'

const originalDirectory = process.cwd()

const appPath = path.join(__dirname, '..')
const componentsPath = path.join(appPath, COMPONENTS_DIRECTORY)
const componentsIndexPath = path.join(componentsPath, COMPONENTS)
const mouldPath = path.join(originalDirectory, MOULD_DIRECTORY)
const schemaPath = path.join(mouldPath, SCHEMA)

if (fs.existsSync(schemaPath)) {
    compileSchema(schemaPath, componentsIndexPath, ([s, ns]) =>
        console.log(
            `Compiled Mould Components successfully in ${s}s ${ns / 1e6}ms`
        )
    )

    if (existsSyncWithExtension(mouldPath, '.ts')) {
        compileTs(([s, ns]) =>
            console.log(
                `Compiled TypeScript successfully in ${s}s ${ns / 1e6}ms`
            )
        )
    }
    if (existsSyncWithExtension(mouldPath, '.js')) {
        copyJs(mouldPath, componentsPath, ([s, ns]) =>
            console.log(`Copied JavaScript successfully in ${s}s ${ns / 1e6}ms`)
        )
    }
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
