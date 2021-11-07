'use strict';

const chalk = require('chalk');
const yargs = require('yargs');
const standalone = require('./index');
const { print, printRules } = require('./utils/print');

const pkg = require('../package.json');

const DEFAULT_OPTIONS = {
    unused: true,
    deprecated: true,
    invalid: true,
    current: false,
    available: false,
};

const handleError = (err) => {
    let errMsg = err;
    if (err instanceof Object) {
        errMsg = err.message || err.error || JSON.stringify(err);
    }

    print(chalk.red(`Error: ${errMsg}`));
    process.exit(1);
};

process.on('unhandledRejection', handleError);

const { argv } = yargs
    .usage('stylelint-find-new-rules [options] <file>')
    .example('stylelint-find-new-rules')
    .example('stylelint-find-new-rules --no-d --no-i')
    .example('stylelint-find-new-rules path/to/custom.config.js')
    .option('u', {
        type: 'boolean',
        alias: 'unused',
        describe: (
            `Find available rules that are not configured.\n` +
            `To disable, set to ${chalk.blue('false')} or use ${chalk.blue('--no-u')}`
        ),
        default: DEFAULT_OPTIONS.unused,
    })
    .option('d', {
        type: 'boolean',
        alias: 'deprecated',
        describe: (
            `Find deprecated configured rules.\n` +
            `To disable, set to ${chalk.blue('false')} or use ${chalk.blue('--no-d')}`
        ),
        default: DEFAULT_OPTIONS.deprecated,
    })
    .option('i', {
        type: 'boolean',
        alias: 'invalid',
        describe: (
            `Find configured rules that are no longer available.\n` +
            `To disable, set to ${chalk.blue('false')} or use ${chalk.blue('--no-i')}`
        ),
        default: DEFAULT_OPTIONS.invalid,
    })
    .option('c', {
        type: 'boolean',
        alias: 'current',
        describe: 'Find all currently configured rules.',
        default: DEFAULT_OPTIONS.current,
    })
    .option('a', {
        type: 'boolean',
        alias: 'available',
        describe: 'Find all available stylelint rules.',
        default: DEFAULT_OPTIONS.available,
    })
    .help('h')
    .alias('h', 'help')
    .group(['help', 'version'], 'General:')
    .wrap(100);

const options = Object.entries(DEFAULT_OPTIONS).reduce(
    (acc, [name, defaultValue]) => {
        const value = name in argv ? argv[name] : defaultValue;
        return { ...acc, [name]: value };
    },
    {},
);

if (!options.unused && !options.deprecated && !options.current && !options.available) {
    print(chalk.red(`Oops, one of the command line Options must be set...`));
    yargs.showHelp();
    process.exit(1);
}

const printResults = (rules) => {
    print(`stylelint-find-new-rules v${pkg.version}`);

    if (options.current) {
        printRules(`[CURRENT] Currently configured user rules:`, rules.used);
    }

    if (options.available) {
        printRules(`[AVAILABLE] All available stylelint rules:`, rules.all);
    }

    let hasOutdatedRules = false;
    if (options.unused && rules.unused.length) {
        hasOutdatedRules = true;
        printRules(`[UNUSED] Available rules that are not configured:`, rules.unused);
    }

    if (options.deprecated && rules.deprecated.length) {
        hasOutdatedRules = true;
        printRules(`[DEPRECATED] Configured rules that are deprecated:`, rules.deprecated, {
            color: 'red',
        });
    }

    if (options.invalid && rules.invalid.length) {
        hasOutdatedRules = true;
        printRules(`[INVALID] Configured rules that are no longer available:`, rules.invalid, {
            color: 'red',
            showLink: false,
        });
    }

    if (!hasOutdatedRules) {
        print(chalk.green(`All rules are up-to-date!`));
    }
    process.exit(hasOutdatedRules ? 1 : 0);
};
standalone(argv._[0]).then(printResults).catch(handleError);
