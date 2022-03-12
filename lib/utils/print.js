'use strict';

const columnify = require('columnify');
const colors = require('picocolors');
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
                    outRule.rule = colors.bold(colors[color](outRule.rule));
                }

                if (showLink) {
                    outRule.url = url ? colors.cyan(url) : null;
                }

                return outRule;
            },
        );

    print(colors.underline(colors[color || 'blue'](heading)));
    print(columnify(rulesToPrint, {}));
};

module.exports = { print, printRules };
