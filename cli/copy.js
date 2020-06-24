import fs from 'fs'
import path from 'path'

export async function copyByExtension(
    directoryPath,
    destinationPath,
    extension
) {
    for (const file of await fs.promises.readdir(directoryPath)) {
        if (path.extname(file) === extension) {
            await fs.promises.copyFile(
                path.join(directoryPath, file),
                path.join(destinationPath, file)
            )
        }
    }
}
