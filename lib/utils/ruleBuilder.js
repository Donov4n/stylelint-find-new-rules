'use strict';

const PLUGINS_URL_RESOLVER = {
    'stylelint': (rule) => (
        `https://stylelint.io/user-guide/rules/list/${rule}`
    ),
    'stylelint-scss': (rule) => (
        `https://github.com/kristerkari/stylelint-scss/blob/master/src/rules/${rule}/README.md`
    ),
    'stylelint-order': (rule) => (
        `https://github.com/hudochenkov/stylelint-order/blob/master/rules/${rule}/README.md`
    ),
    'stylelint-declaration-block-no-ignored-properties': () => (
        'https://github.com/kristerkari/stylelint-declaration-block-no-ignored-properties'
    ),
    'stylelint-prettier': () => 'https://github.com/prettier/stylelint-prettier',
};

const ruleBuilder = (resolverName) => {
    const resolver = PLUGINS_URL_RESOLVER[resolverName];

    return (name, rule) => {
        const meta = rule.meta || {};
        const isDeprecated = meta.deprecated || false;

        let baseName = name;
        if (resolverName !== 'stylelint') {
            const namespacePos = name.indexOf('/');
            if (namespacePos !== -1) {
                baseName = name.substr(namespacePos + 1);
            }
        }

        const url = resolver ? resolver(baseName) : null;
        return { name, isDeprecated, url };
    };
};

module.exports = ruleBuilder;
