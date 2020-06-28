import spawn from 'cross-spawn'
import fs from 'fs'
import { debounce } from 'lodash'
import path from 'path'

import { compileSchema } from './compile'
import {
    copyByExtension,
    copyByExtensionWithExtensionReplacement,
} from './copy'
import * as paths from './paths'

if (fs.existsSync(paths.app.mouldDirectory)) {
    if (fs.existsSync(paths.mould.symlinkDirectory)) {
        fs.unlinkSync(paths.mould.symlinkDirectory)
    }
    fs.symlinkSync(
        paths.app.mouldDirectory,
        paths.mould.symlinkDirectory,
        'dir'
    )

    const cdToAppDir = `cd ${paths.mould.directory}`
    const setWorkdirEnvVar = `WORKDIR=${paths.app.mouldDirectory}`
    const runNextDev = `${paths.bin.next} dev`

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

    spawn(
        paths.bin.tsc,
        ['-p', path.join(__dirname, 'tsconfig.components.json'), '--watch'],
        { stdio: 'inherit' }
    )

    fs.watch(
        paths.app.mouldDirectory,
        debounce((event, filename) => {
            if (!filename) {
                return
            }

            if (filename.startsWith(path.basename(paths.app.schema))) {
                const compileSchemaTime = process.hrtime()

                compileSchema(paths.app.schema, paths.mould.components)
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
} else {
    console.warn(
        `You don't have ${path.basename(paths.app.mouldDirectory)} ` +
            `initialized at ${paths.app.directory}\n\n` +
            'You could start by typing:\n\n' +
            '  npx mould init\n'
    )
}
