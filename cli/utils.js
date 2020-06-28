import fs from 'fs'
import path from 'path'

export function existsSyncWithExtension(directoryPath, extension) {
    return fs
        .readdirSync(directoryPath)
        .some((file) => path.extname(file) === extension)
}

export function replaceExtension(filePath, ext) {
    if (typeof filePath !== 'string' || filePath.length === 0) {
        return filePath
    }

    const newFileName = path.basename(filePath, path.extname(filePath)) + ext
    const newFilePath = path.join(path.dirname(filePath), newFileName)

    // The path.join function removes the head './' from the given path
    if (startsWithSingleDot(filePath)) {
        return `.${path.sep}${newFilePath}`
    }

    return newFilePath
}

function startsWithSingleDot(filePath) {
    const first2chars = filePath.slice(0, 2)
    return first2chars === `.${path.sep}`
}
