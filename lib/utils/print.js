'use strict';

const columnify = require('columnify');
const chalk = require('chalk');
const os = require('os');

const print = (output) => {
    process.stdout.write(output);
    process.stdout.write(os.EOL + os.EOL);
};

const printRules = (heading, rules, options = {}) => {
    const defaults = { color: null, showLink: true };
    const { color, showLink } = { ...defaults, ...options };

    const rulesToPrint = [...rules]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(
            ({ name, url }) => {
                const outRule = { rule: name };

                if (color) {
                    outRule.rule = chalk[`${color}Bright`](outRule.rule);
                }

                if (showLink) {
                    outRule.url = url ? chalk.cyan(url) : null;
                }

                return outRule;
            },
        );

    print(chalk[color || 'blue'].underline(heading));
    print(columnify(rulesToPrint, {}));
};

module.exports = { print, printRules };
