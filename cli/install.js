import spawn from 'cross-spawn'
import fs from 'fs'

import * as paths from './paths'
import { version } from '../package.json'

if (fs.existsSync(paths.editor.byVersionDirectory)) {
    console.warn(`You already have mould@${version} installed.`)
    process.exit(0)
}

if (!fs.existsSync(paths.editor.directory)) {
    fs.mkdirSync(paths.editor.directory)
}

const zipFile = `v${version}.zip`
const url = `https://github.com/mouldjs/mould/archive/${zipFile}`

const result = spawn.sync(
    'bash',
    [
        '-c',
        [
            `cd ${paths.editor.directory}`,
            `curl -LOkSs ${url}`,
            `unzip -q ${zipFile}`,
            `rm ${zipFile}`,
            `mv mould-${version} ${version}`,
            `cd ${version}`,
            `yarn install`,
        ].join(' && '),
    ],
    { stdio: 'inherit' }
)

if (result.status === 0) {
    console.info(
        `\nInstalled mould@${version} successfully ` +
            `at ${paths.editor.directory}`
    )
}
