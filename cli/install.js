import spawn from 'cross-spawn'
import fs from 'fs'

import * as paths from './paths'
import packageJson from '../package.json'

if (fs.existsSync(paths.editor.byVersionDirectory)) {
    console.warn(`You already have mould@${packageJson.version} installed.`)
    process.exit(0)
}

if (!fs.existsSync(paths.editor.directory)) {
    fs.mkdirSync(paths.editor.directory)
}

const zipFile = `v${packageJson.version}.zip`
const url = `https://github.com/mouldjs/mould/archive/${zipFile}`

const result = spawn.sync(
    'bash',
    [
        '-c',
        [
            `cd ${paths.editor.directory}`,
            `curl -LOkSs ${url}`,
            `unzip ${zipFile} -d ${packageJson.version}`,
            `rm ${zipFile}`,
        ].join(' && '),
    ],
    { stdio: 'inherit' }
)

if (result.status === 0) {
    console.info(`\nInstalled mould@${packageJson.version} successfully.`)
}
