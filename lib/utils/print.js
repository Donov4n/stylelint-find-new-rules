'use strict';

const columnify = require('columnify');
const chalk     = require('chalk');
const os        = require('os');

const print = (output) => {
    process.stdout.write(output);
    process.stdout.write(os.EOL + os.EOL);
};

const printRules = (heading, rules, options = {}) => {
    const defaults = { color: null, showLink: true };
    options = Object.assign({}, defaults, options);

    const rulesToPrint = [...rules]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(
            ({ name, url }) => {
                const outRule = { rule: name };

                if (options.color) {
                    outRule.rule = chalk[options.color](outRule.rule);
                }

                if (options.showLink) {
                    outRule.url = url ? chalk.cyan(url) : null;
                }

                return outRule;
            }
        );

    print(heading);
    print(columnify(rulesToPrint, {}));
};

module.exports = { print, printRules };
