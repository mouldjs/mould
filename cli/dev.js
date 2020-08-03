import chalk from 'chalk'
import spawn from 'cross-spawn'
import fs from 'fs'
import fse from 'fs-extra'
import { debounce } from 'lodash'
import path from 'path'
import {
    copyByExtension,
    copyByExtensionWithExtensionReplacement,
} from './copy'
import * as paths from './paths'
import { existsSyncWithExtension } from './utils'

if (!fs.existsSync(paths.editor.byVersionDirectory)) {
    console.warn(
        `You don't have Mould installed.\n\n` +
            'To install Mould just type:\n\n' +
            `  ${chalk.cyan('npx mould install')}\n`
    )
    process.exit(1)
}
if (!fs.existsSync(paths.app.mouldDirectory)) {
    console.warn(
        `You don't have ${chalk.green(
            path.basename(paths.app.mouldDirectory)
        )} initialized at ${chalk.green(paths.app.directory)}\n\n` +
            'You could start by typing:\n\n' +
            `  ${chalk.cyan('npx mould init')}\n`
    )
    process.exit(1)
}

;(async function dev() {
    try {
        copyMould()
        symlinkMould()
        await build()
        runEditor()
        watchTs()
        watchMould()
    } catch (error) {
        console.error('Failed to run Mould in development\n' + error)
    }
})()

function build() {
    return Promise.all([
        fs.existsSync(paths.app.schema) &&
            require('./compile').compileSchema(
                paths.app.schema,
                paths.mould.components
            ),
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
    ]).then(require('./compile').compileTs)
}

function copyMould() {
    fse.copySync(paths.app.mouldDirectory, paths.editor.symlinkDirectory)
}

function symlinkMould() {
    if (fs.existsSync(paths.mould.symlinkDirectory)) {
        fs.unlinkSync(paths.mould.symlinkDirectory)
    }
    fs.symlinkSync(
        paths.app.mouldDirectory,
        paths.mould.symlinkDirectory,
        'dir'
    )
}

function runEditor() {
    const cdToAppDir = `cd ${paths.editor.byVersionDirectory}`
    const setWorkdirEnvVar = `WORKDIR=${paths.app.mouldDirectory}`
    const runNextDev = `${paths.bin.next} dev -p 5005`

    if (
        process.platform === 'win32' ||
        process.env.OSTYPE === 'msys' ||
        process.env.OSTYPE === 'cygwin'
    ) {
        spawn(
            'cmd.exe',
            ['/c', `${cdToAppDir} && set ${setWorkdirEnvVar} && ${runNextDev}`],
            { stdio: 'inherit' }
        )
    } else {
        spawn(
            'bash',
            ['-c', `${cdToAppDir} && ${setWorkdirEnvVar} ${runNextDev}`],
            { stdio: 'inherit' }
        )
    }
}

function watchTs() {
    spawn(
        paths.bin.tsc,
        ['-p', path.join(__dirname, 'tsconfig.components.json'), '--watch'],
        { stdio: 'inherit' }
    )
}

function watchMould() {
    fs.watch(
        paths.app.mouldDirectory,
        debounce((event, filename) => {
            if (!filename) {
                return
            }

            copyMould()

            if (filename.startsWith(path.basename(paths.app.schema))) {
                const compileSchemaTime = process.hrtime()

                require('./compile')
                    .compileSchema(paths.app.schema, paths.mould.components)
                    .then(() => {
                        const [s, ns] = process.hrtime(compileSchemaTime)

                        console.log(
                            'Compiled Mould Schema successfully ' +
                                `in ${s}s ${ns / 1e6}ms`
                        )
                    })
                    .catch((error) => {
                        console.error(
                            'Failed to compile Mould Schema\n' + error
                        )
                    })
            } else if (path.extname(filename).startsWith('.ts')) {
                const copyTsTime = process.hrtime()

                copyByExtension(
                    paths.app.mouldDirectory,
                    paths.mould.componentsDirectory,
                    '.ts'
                )
                    .then(() => {
                        const [s, ns] = process.hrtime(copyTsTime)

                        console.log(
                            'Copied TypeScript successfully ' +
                                `in ${s}s ${ns / 1e6}ms`
                        )
                    })
                    .catch((error) => {
                        console.error('Failed to copy TypeScript\n' + error)
                    })
            } else if (path.extname(filename).startsWith('.js')) {
                const copyJsTime = process.hrtime()

                copyByExtensionWithExtensionReplacement(
                    paths.app.mouldDirectory,
                    paths.mould.componentsDirectory,
                    '.js',
                    '.ts'
                )
                    .then(() => {
                        const [s, ns] = process.hrtime(copyJsTime)

                        console.log(
                            'Copied JavaScript successfully ' +
                                `in ${s}s ${ns / 1e6}ms`
                        )
                    })
                    .catch((error) => {
                        console.error('Failed to copy JavaScript\n' + error)
                    })
            }
        }, 500)
    )
}
