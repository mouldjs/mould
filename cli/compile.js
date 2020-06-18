import fs from 'fs'

import { transform } from '../compile/transform'

export function compileSchema(schemaPath, componentsPath) {
    const time = process.hrtime()

    fs.readFile(schemaPath, 'utf8', (err, schema) => {
        if (err) {
            console.error('Failed to read Mould Schema\n' + err)
            process.exit(1)
        }

        fs.writeFile(
            componentsPath,
            transform(JSON.parse(schema)),
            'utf8',
            (err) => {
                if (err) {
                    console.error('Failed to write Mould Components\n' + err)
                    process.exit(1)
                }

                const [s, ns] = process.hrtime(time)
                console.log(
                    `Compiled Mould Components successfully in ${s}s ${
                        ns / 1e6
                    }ms`
                )
            }
        )
    })
}
