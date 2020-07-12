import spawn from 'cross-spawn'
import fs from 'fs'

import * as paths from './paths'

if (!fs.existsSync(paths.editor.directory)) {
    console.warn(`You don't have mould installed.`)
    process.exit(0)
}

const result = spawn.sync('bash', ['-c', `rm -rf ${paths.editor.directory}`], {
    stdio: 'inherit',
})

if (result.status === 0) {
    console.info('Uninstalled mould successfully.')
}
