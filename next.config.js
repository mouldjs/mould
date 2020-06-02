const withCSS = require('@zeit/next-css')
const withSass = require('@zeit/next-sass')
const path = require('path')

module.exports = withSass(
    withCSS({
        /* config options here */
        webpack(config, options) {
            config.resolve.alias['@'] = path.join(__dirname)
            return config
        },
        serverRuntimeConfig: {
            workdir: process.env.WORKDIR,
        },
    })
)
