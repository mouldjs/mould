import fs from 'fs'
import path from 'path'

export function existsSyncWithExtension(directoryPath, extension) {
    return fs
        .readdirSync(directoryPath)
        .some((file) => path.extname(file) === extension)
}
