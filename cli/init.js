import fs from 'fs'
import path from 'path'

import * as paths from './paths'

if (fs.existsSync(paths.app.mouldDirectory)) {
    console.warn(
        `You already have ${path.basename(paths.app.mouldDirectory)} ` +
            `initialized at ${paths.app.directory}`
    )
} else {
    fs.mkdirSync(paths.app.mouldDirectory)

    console.log(
        `Created ${path.basename(paths.app.mouldDirectory)} ` +
            `directory at ${paths.app.directory}`
    )
}

if (!fs.existsSync(paths.app.resolvers)) {
    fs.writeFileSync(paths.app.resolvers, 'export default {}')

    console.log(
        `Created ${path.basename(paths.app.resolvers)} ` +
            `at ${paths.app.mouldDirectory}`
    )
}

console.log('\nYou could begin by typing:\n\n' + '  mould dev\n')
