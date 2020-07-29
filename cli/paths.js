import fs from 'fs'
import os from 'os'
import path from 'path'

import packageJson from '../package.json'

const appDirectory = process.cwd()
const mouldDirectory = path.join(__dirname, '..')
const editorDirectory = path.join(os.homedir(), '.mould')

const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath)
const resolveMould = (relativePath) =>
    path.resolve(mouldDirectory, relativePath)
const resolveEditor = (relativePath) =>
    path.resolve(editorDirectory, packageJson.version, relativePath)

const useTs = fs.existsSync(resolveApp('tsconfig.json'))

export const app = {
    directory: appDirectory,
    mouldDirectory: resolveApp('mould'),
    schema: resolveApp('mould/.mould'),
    resolvers: resolveApp(`mould/resolvers.${useTs ? 'ts' : 'js'}`),
    setup: resolveApp(`mould/setup.${useTs ? 'ts' : 'js'}`),
}

export const mould = {
    directory: mouldDirectory,
    componentsDirectory: resolveMould('.components'),
    components: resolveMould('.components/index.tsx'),
    symlinkDirectory: resolveMould('.mould'),
}

export const editor = {
    directory: editorDirectory,
    byVersionDirectory: resolveEditor('.'),
    symlinkDirectory: resolveEditor('.mould'),
}

export const bin = {
    next: resolveEditor('node_modules/.bin/next'),
    tsc: resolveMould('node_modules/.bin/tsc'),
}
