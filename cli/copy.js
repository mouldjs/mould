import fs from 'fs'
import path from 'path'

import { replaceExtension } from './utils'

export async function copyFiles(
    srcPath,
    destPath,
    { getDestFilename = (file) => file, filterByFilename = () => true } = {}
) {
    for (const file of await fs.promises.readdir(srcPath)) {
        if (filterByFilename(file)) {
            await fs.promises.copyFile(
                path.join(srcPath, file),
                path.join(destPath, getDestFilename(file))
            )
        }
    }
}

export async function copyByExtension(srcPath, destPath, ext) {
    await copyFiles(srcPath, destPath, {
        filterByFilename: (file) => path.extname(file) === ext,
    })
}

export async function copyByExtensionWithExtensionReplacement(
    srcPath,
    destPath,
    ext,
    extReplacement
) {
    await copyFiles(srcPath, destPath, {
        getDestFilename: (file) => replaceExtension(file, extReplacement),
        filterByFilename: (file) => path.extname(file) === ext,
    })
}
