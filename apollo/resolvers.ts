import getConfig from 'next/config'
import fs from 'fs'
import path from 'path'

const { readFile, writeFile } = fs.promises

export const resolvers = {
    Query: {
        schemas: async () => {
            const {
                serverRuntimeConfig: { workdir },
            } = getConfig()
            if (!workdir) {
                throw Error('Workdir must be specified.')
            }
            try {
                return await readFile(path.join(workdir, '.mould'), 'utf8')
            } catch {
                return null
            }
        },
        ping: () => true,
    },
    Mutation: {
        saveSchemas: async (parent, { schemas }) => {
            const {
                serverRuntimeConfig: { workdir },
            } = getConfig()
            await writeFile(path.join(workdir, '.mould'), schemas, 'utf8')

            return true
        },
    },
}
