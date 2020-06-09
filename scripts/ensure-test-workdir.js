const fs = require('fs')

const path = './test-mould'
const RESOLVER_PATH = `${path}/resolvers.ts`
const SYMLINK_MOULD_PATH = './.mould'

fs.existsSync(path) || fs.mkdirSync(path)
if (!fs.existsSync(RESOLVER_PATH)) {
    fs.writeFileSync(RESOLVER_PATH, `export default {}`)
}
if (fs.existsSync(SYMLINK_MOULD_PATH)) {
    fs.unlinkSync(SYMLINK_MOULD_PATH)
}
fs.symlinkSync(path, SYMLINK_MOULD_PATH, 'dir')
