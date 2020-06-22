import fs from 'fs'
import path from 'path'

import { MOULD_DIRECTORY, RESOLVERS_JS, RESOLVERS_TS } from './constants'

const originalDirectory = process.cwd()

const tsconfigPath = path.join(originalDirectory, 'tsconfig.json')
const mouldPath = path.join(originalDirectory, MOULD_DIRECTORY)

const useTs = fs.existsSync(tsconfigPath)

const resolversPath = path.join(mouldPath, useTs ? RESOLVERS_TS : RESOLVERS_JS)

if (fs.existsSync(mouldPath)) {
    console.warn(
        `You already have ${MOULD_DIRECTORY} initialized at ${originalDirectory}`
    )
} else {
    fs.mkdirSync(mouldPath)

    console.log(`Created ${MOULD_DIRECTORY} directory at ${originalDirectory}`)
}

if (!fs.existsSync(resolversPath)) {
    fs.writeFileSync(resolversPath, 'export default {}')

    console.log(
        `Created ${useTs ? RESOLVERS_TS : RESOLVERS_JS} at ${mouldPath}`
    )
}

console.log('\nYou could begin by typing:\n\n' + '  mould dev\n')
