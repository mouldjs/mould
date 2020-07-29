import chalk from 'chalk'
import fs from 'fs'
import path from 'path'

import * as paths from './paths'

if (!fs.existsSync(path.join(paths.app.directory, 'package.json'))) {
    console.error(
        `Please, run ${chalk.cyan('mould init')} within your project directory`
    )
    process.exit(1)
}

if (fs.existsSync(paths.app.mouldDirectory)) {
    console.warn(
        `You already have ${chalk.green(
            path.basename(paths.app.mouldDirectory)
        )} initialized at ${chalk.green(paths.app.directory)}`
    )
} else {
    fs.mkdirSync(paths.app.mouldDirectory)

    console.log(
        `Created ${chalk.green(path.basename(paths.app.mouldDirectory))} ` +
            `directory at ${chalk.green(paths.app.directory)}`
    )
}

if (!fs.existsSync(paths.app.resolvers)) {
    fs.writeFileSync(paths.app.resolvers, 'export default {}')

    console.log(
        `Created ${chalk.green(path.basename(paths.app.resolvers))} ` +
            `at ${chalk.green(paths.app.mouldDirectory)}`
    )
}

if (!fs.existsSync(paths.app.setup)) {
    fs.writeFileSync(paths.app.setup, 'export default () => ({})')

    console.log(
        `Created ${chalk.green(path.basename(paths.app.setup))} ` +
            `at ${chalk.green(paths.app.mouldDirectory)}`
    )
}

console.log(
    '\nYou could begin by typing:\n\n' +
        `  ${chalk.cyan('npx mould dev')}\n\n` +
        `Or you could add ${chalk.cyan('mould dev')} to your ${chalk.green(
            'package.json'
        )} scripts\n`
)
