import fs from 'fs'
import path from 'path'

import { MOULD_DIRECTORY, RESOLVERS } from './constants'

const originalDirectory = process.cwd()

const mouldPath = path.join(originalDirectory, MOULD_DIRECTORY)
const resolversPath = path.join(mouldPath, RESOLVERS)

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

    console.log(`Created ${RESOLVERS} at ${mouldPath}`)
}

console.log('\nYou could begin by typing:\n\n' + '  mould dev\n')
