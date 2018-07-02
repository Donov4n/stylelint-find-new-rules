'use strict';

const _               = require('lodash');
const cosmiconfig     = require('cosmiconfig');
const stylelint       = require('stylelint');
const chalk           = require('chalk');
const requireRelative = require('require-relative');
const isDeprecated    = require('./utils/is-deprecated');
const print           = require('./utils/print');

module.exports = (options) => {
    const rules = {
        stylelintAll          : Object.keys(stylelint.rules),
        stylelintDeprecated   : [],
        stylelintNoDeprecated : [],
        userRulesNames        : []
    };

    /**
     * Get user rules
     * Gather rules from `extends` as well
     */
    const getUserRules = (userConfig) => {
        const _retrieveRules = (config) => {
            const rulesNames = Object.keys(config.rules);

            // Handle extends
            if (config.extends) {
                const _extends = Array.isArray(config.extends) ? config.extends : [config.extends];

                _extends.forEach((extendName) => {
                    const extendedConfig = requireRelative(extendName);
                    rulesNames.push(..._retrieveRules(extendedConfig));
                });
            }

            return _.sortedUniq(rulesNames);
        };

        rules.userRulesNames = _retrieveRules(userConfig);
    };

    /**
     * Find all deprecated rules from the list of stylelint rules
     *
     * @returns {Promise}
     */
    const findDeprecatedStylelintRules = () => {
        if (!options.deprecated && !options.unused) {
            return Promise.resolve();
        }

        const isDeprecatedPromises = rules.stylelintAll.map(isDeprecated);
        return Promise.all(isDeprecatedPromises).then((rulesIsDeprecated) => {
            rules.stylelintDeprecated = rules.stylelintAll.filter(
                (rule, index) => rulesIsDeprecated[index]
            );

            if (options.unused) {
                rules.stylelintNoDeprecated = _.difference(
                    rules.stylelintAll,
                    rules.stylelintDeprecated
                );
            }

            return rules.stylelintDeprecated;
        });
    };

    /**
     * Print currently configured rules
     */
    const printUserCurrent = () => {
        if (!options.current) {
            return;
        }

        const heading = chalk.blue.underline('CURRENT: Currently configured user rules:');
        const rulesToPrint = rules.userRulesNames.map(rule => ({
            rule,
            url: chalk.cyan(`https://stylelint.io/user-guide/rules/${rule}/`)
        }));

        print(heading, rulesToPrint);
    };

    /**
     * Print all available stylelint rules
     */
    const printAllAvailable = () => {
        if (!options.available) {
            return;
        }

        const heading = chalk.blue.underline('AVAILABLE: All available stylelint rules:');
        const rulesToPrint = rules.stylelintAll.map(rule => ({
            rule,
            url: chalk.cyan(`https://stylelint.io/user-guide/rules/${rule}/`)
        }));

        print(heading, rulesToPrint);
    };

    /**
     * Print configured rules that are no longer available
     */
    const printConfiguredUnavailable = () => {
        if (!options.invalid) {
            return;
        }

        const configuredUnavailable = _.difference(rules.userRulesNames, rules.stylelintAll);

        if (!configuredUnavailable.length) {
            return;
        }

        const heading = chalk.red.underline(
            'INVALID: Configured rules that are no longer available:'
        );
        const rulesToPrint = configuredUnavailable.map(rule => ({
            rule: chalk.redBright(rule)
        }));

        print(heading, rulesToPrint);
    };

    /**
     * Print user configured rules that are deprecated
     */
    const printUserDeprecated = () => {
        if (!options.deprecated) {
            return;
        }

        const userDeprecated = _.intersection(rules.stylelintDeprecated, rules.userRulesNames);

        if (!userDeprecated.length) {
            return;
        }

        const heading = chalk.red.underline('DEPRECATED: Configured rules that are deprecated:');
        const rulesToPrint = userDeprecated.map(rule => ({
            rule : chalk.redBright(rule),
            url  : chalk.cyan(`https://stylelint.io/user-guide/rules/${rule}/`)
        }));

        print(heading, rulesToPrint);
    };

    /**
     * Print available stylelint rules that the user hasn't configured yet
     */
    const printUserUnused = () => {
        if (!options.unused) {
            return;
        }

        const userUnconfigured = _.difference(rules.stylelintNoDeprecated, rules.userRulesNames);
        let heading;

        if (!userUnconfigured.length) {
            heading = chalk.green('All rules are up-to-date!');
            print(heading);

            return;
        }

        const rulesToPrint = userUnconfigured.map(rule => ({
            rule,
            url: chalk.cyan(`https://stylelint.io/user-guide/rules/${rule}/`)
        }));

        heading = chalk.blue.underline('UNUSED: Available rules that are not configured:');

        print(heading, rulesToPrint);
    };

    return cosmiconfig('stylelint', { configPath: options.config })
        .load(process.cwd())
        .then((_cosmiconfig) => {
            if (!_cosmiconfig) {
                throw new Error('No stylelint configuration found.');
            }
            return _cosmiconfig.config;
        })
        .then(getUserRules)
        .then(findDeprecatedStylelintRules)
        .then(printUserCurrent)
        .then(printAllAvailable)
        .then(printUserUnused)
        .then(printUserDeprecated)
        .then(printConfiguredUnavailable);
};
