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
                compileSchema(
                    paths.app.schema,
                    paths.mould.components,
                    ([s, ns]) =>
                        console.log(
                            'Compiled Mould Components successfully ' +
                                `in ${s}s ${ns / 1e6}ms`
                        )
                )
            } else if (path.extname(filename).startsWith('.ts')) {
                copyByExtension(
                    paths.app.mouldDirectory,
                    paths.mould.componentsDirectory,
                    '.ts',
                    ([cpS, cpNs]) =>
                        compileTs(([cS, cNs]) => {
                            let ms = (cpNs + cNs) / 1e6
                            const s = cpS + cS + Math.floor(ms / 1e3)
                            ms %= 1e3
                            console.log(
                                'Compiled TypeScript successfully ' +
                                    `in ${s}s ${ms}ms`
                            )
                        })
                )
            } else if (path.extname(filename).startsWith('.js')) {
                copyByExtension(
                    paths.app.mouldDirectory,
                    paths.mould.componentsDirectory,
                    '.js',
                    ([s, ns]) =>
                        console.log(
                            'Copied JavaScript successfully ' +
                                `in ${s}s ${ns / 1e6}ms`
                        )
                )
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
