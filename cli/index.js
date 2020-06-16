'use strict'

const arg = require('arg')
const spawn = require('cross-spawn')
const path = require('path')

const packageJson = require('../package.json')

const commands = ['build', 'dev', 'init']

const args = arg(
    {
        // Types
        '--version': Boolean,
        '--help': Boolean,

        // Aliases
        '-v': '--version',
        '-h': '--help',
    },
    {
        permissive: true,
    }
)

if (args['--version']) {
    console.log(packageJson.version)
    process.exit(0)
}

if (args['--help'] || !args._.length) {
    console.log(`
    Usage:
      $ mould <command>

    Available commands:
      ${commands.join(', ')}

    Options:
      --version, -v   output the version number
      --help, -h      output usage information
    `)
    process.exit(0)
}

const [command] = args._

if (commands.includes(command)) {
    const result = spawn.sync(
        'node',
        [
            '-r',
            'esm',
            '-r',
            'ts-node/register',
            require.resolve(`./${command}.ts`),
        ],
        {
            stdio: 'inherit',
            env: {
                ...process.env,
                TS_NODE_PROJECT: path.join(__dirname, 'tsconfig.json'),
            },
        }
    )

    if (result.signal) {
        if (result.signal === 'SIGKILL') {
            console.log(
                'The script failed because ' +
                    'the process received a request for its immediate termination.'
            )
        } else if (result.signal === 'SIGTERM') {
            console.log(
                'The script failed because ' +
                    'the process received a request for its termination.'
            )
        }
        process.exit(1)
    }
    process.exit(result.status)
} else {
    console.error(`Unknown command "${command}".`)
}
