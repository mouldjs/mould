import getConfig from 'next/config'
import fs from 'fs'
import path from 'path'

const {
    serverRuntimeConfig: { workdir },
} = getConfig()

const { readFile, writeFile } = fs.promises

export const resolvers = {
    Query: {
        schemas: async () => {
            if (!workdir) {
                throw Error('Workdir must be specified.')
            }
            try {
                return await readFile(path.join(workdir, '.mould'), 'utf8')
            } catch {
                return null
            }
        },
    },
    Mutation: {
        saveSchemas: async (parent, { schemas }) => {
            await writeFile(path.join(workdir, '.mould'), schemas, 'utf8')

            return true
        },
    },
}
