import fs from 'fs'
import path from 'path'

const appDirectory = process.cwd()
const mouldDirectory = path.join(__dirname, '..')

const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath)
const resolveMould = (relativePath) =>
    path.resolve(mouldDirectory, relativePath)

const useTs = fs.existsSync(resolveApp('tsconfig.json'))

export const app = {
    directory: appDirectory,
    mouldDirectory: resolveApp('mould'),
    schema: resolveApp('mould/.mould'),
    resolvers: resolveApp(`mould/resolvers.${useTs ? 'ts' : 'js'}`),
}

export const mould = {
    directory: mouldDirectory,
    componentsDirectory: resolveMould('.components'),
    components: resolveMould('.components/index.js'),
    symlinkDirectory: resolveMould('.mould'),
}

export const bin = {
    next: resolveMould('node_modules/.bin/next'),
    tsc: resolveMould('node_modules/.bin/tsc'),
}
