import spawn from 'cross-spawn'
import fs from 'fs'
import { debounce } from 'lodash'
import path from 'path'

import { compileSchema, compileTs } from './compile'
import { copyByExtension } from './copy'
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

    fs.watch(
        paths.app.mouldDirectory,
        debounce((event, filename) => {
            if (!filename) {
                return
            }

            if (filename === path.basename(paths.app.schema)) {
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
                        const [cpS, cpNs] = process.hrtime(copyTsTime)

                        compileTs(([cS, cNs]) => {
                            let ms = (cpNs + cNs) / 1e6
                            const s = cpS + cS + Math.floor(ms / 1e3)
                            ms %= 1e3
                            console.log(
                                'Compiled TypeScript successfully ' +
                                    `in ${s}s ${ms}ms`
                            )
                        })
                    })
                    .catch((error) => {
                        console.error('Failed to copy TypeScript\n' + error)
                    })
            } else if (path.extname(filename).startsWith('.js')) {
                const copyJsTime = process.hrtime()

                copyByExtension(
                    paths.app.mouldDirectory,
                    paths.mould.componentsDirectory,
                    '.js'
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
            '  mould init\n'
    )
}
