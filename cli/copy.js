import fs from 'fs'
import path from 'path'

export function copyByExtension(
    directoryPath,
    destinationPath,
    extension,
    callback
) {
    const time = process.hrtime()

    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            console.error('Failed to read files\n' + err)
            return
        }

        files
            .filter((file) => path.extname(file) === extension)
            .forEach((file) =>
                fs.copyFileSync(
                    path.join(directoryPath, file),
                    path.join(destinationPath, file)
                )
            )

        callback(process.hrtime(time))
    })
}
