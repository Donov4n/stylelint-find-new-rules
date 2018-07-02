'use strict';

const chalk      = require('chalk');
const yargs      = require('yargs');
const print      = require('./utils/print');
const standalone = require('./standalone');

const handleError = (err) => {
    let errMsg = err;
    if (err instanceof Object) {
        errMsg = err.message || err.error || JSON.stringify(err);
    }

    print(chalk.red(`Error: ${errMsg}`));
    process.exit(1);
};

process.on('unhandledRejection', handleError);

const argv = yargs
    .usage('stylelint-find-rules [options]')
    .example('stylelint-find-rules')
    .example('stylelint-find-rules --no-d --no-i')
    .example('stylelint-find-rules --config path/to/custom.config.js')
    .option('u', {
        type     : 'boolean',
        alias    : 'unused',
        describe : (
            `Find available rules that are not configured\n` +
            `To disable, set to ${chalk.blue('false')} or use ${chalk.blue('--no-u')}`
        ),
        default: true
    })
    .option('d', {
        type     : 'boolean',
        alias    : 'deprecated',
        describe : (
            `Find deprecated configured rules\n` +
            `To disable, set to ${chalk.blue('false')} or use ${chalk.blue('--no-d')}`
        ),
        default: true
    })
    .option('i', {
        type     : 'boolean',
        alias    : 'invalid',
        describe : (
            `Find configured rules that are no longer available` +
            `To disable, set to ${chalk.blue('false')} or use ${chalk.blue('--no-i')}`
        ),
        default: true
    })
    .option('c', {
        type     : 'boolean',
        alias    : 'current',
        describe : 'Find all currently configured rules'
    })
    .option('a', {
        type     : 'boolean',
        alias    : 'available',
        describe : 'Find all available stylelint rules'
    })
    .option('config', {
        describe: 'Optional, path to a custom config file (passed as `configPath` to cosmiconfig)'
    })
    .help('h')
    .alias('h', 'help')
    .group(['help', 'config'], 'General:')
    .wrap(100)
    .argv;

if (!argv.unused && !argv.deprecated && !argv.current && !argv.available) {
    print(chalk.red(`Oops, one of the command line Options must be set...`));
    yargs.showHelp();
    process.exit(1);
}

standalone(argv).catch(handleError);
