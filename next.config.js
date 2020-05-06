const withCSS = require('@zeit/next-css')
const withSass = require('@zeit/next-sass')
const { resolve } = require('path')

module.exports = withSass(
    withCSS({
        /* config options here */
        webpack(config, options) {
            config.resolve.alias['@'] = resolve(__dirname)
            return config
        },
    })
)
