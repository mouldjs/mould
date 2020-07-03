const fs = require('fs')
const path = require('path')

const currentDirectory = process.cwd()
const rootPackage = path.resolve('../package.json')
const releasePackage = path.resolve('./package.json')

if (!fs.existsSync(rootPackage)) {
    const releaseDirectory = path.join(currentDirectory, 'release')
    console.error(
        `Looks like you are trying to publish outside of ${releaseDirectory}.`,
        `Please, run 'npm publish' inside the release directory.`
    )
    process.exit(1)
}

if (!fs.readFileSync(releasePackage).equals(fs.readFileSync(rootPackage))) {
    console.error(
        `Could not find a valid build in ${currentDirectory} directory!`,
        `Try to build Mould with 'yarn build' before publishing.`
    )
    process.exit(1)
}
