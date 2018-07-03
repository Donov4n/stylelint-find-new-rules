'use strict';

const cosmiconfig = require('cosmiconfig');
const chalk       = require('chalk');
const { print, printRules }         = require('./utils/print');
const { getAllRules, getUsedRules } = require('./utils/rules');

const getConfig = async function (configPath) {
    const explorer = cosmiconfig('stylelint', { configPath });

    const _cosmiConfig = await explorer.load(process.cwd());
    if (!_cosmiConfig) {
        throw new Error(`No stylelint configuration found.`);
    }

    return _cosmiConfig.config;
};

module.exports = async function (options) {
    const userConfig = await getConfig(options.config);
    const allRules   = getAllRules(userConfig);
    const usedRules  = getUsedRules(userConfig, allRules);

    if (options.current) {
        const heading = chalk.blue.underline(`Currently configured user rules:`);
        printRules(heading, usedRules);
    }

    if (options.available) {
        const heading = chalk.blue.underline(`All available stylelint rules:`);
        printRules(heading, allRules);
    }

    if (options.unused) {
        const unusedRules = allRules.filter(
            ({ name, isDeprecated }) => {
                if (isDeprecated) {
                    return false;
                }
                return !usedRules.find(_rule => _rule.name === name);
            }
        );

        if (!unusedRules.length) {
            print(chalk.green('All rules are up-to-date!'));
            return;
        }

        const heading = chalk.blue.underline(`Available rules that are not configured:`);
        printRules(heading, unusedRules);
    }

    if (options.deprecated) {
        const usedDeprecatedRules = allRules.filter(
            ({ name, isDeprecated }) => {
                if (!isDeprecated) {
                    return false;
                }
                return usedRules.find(_rule => _rule.name === name);
            }
        );

        if (!usedDeprecatedRules.length) {
            return;
        }

        const heading = chalk.red.underline(`Configured rules that are deprecated:`);
        printRules(heading, usedDeprecatedRules, { color: 'redBright' });
    }

    if (options.invalid) {
        const usedUnavailableRules = usedRules.filter(
            ({ name }) => !allRules.find(_rule => _rule.name === name)
        );

        if (!usedUnavailableRules.length) {
            return;
        }

        const heading = chalk.red.underline(`Configured rules that are no longer available:`);
        printRules(heading, usedUnavailableRules, { color: 'redBright', showLink: false });
    }
};
