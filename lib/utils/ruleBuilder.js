'use strict';

const PLUGINS_URL_RESOLVER = {
    'stylelint': rule => (
        `https://stylelint.io/user-guide/rules/${rule}/`
    ),
    'stylelint-scss': rule => (
        `https://github.com/kristerkari/stylelint-scss/blob/master/src/rules/${rule}/README.md`
    ),
    'stylelint-order': rule => (
        `https://github.com/hudochenkov/stylelint-order/blob/master/rules/${rule}/README.md`
    ),
    'stylelint-declaration-block-no-ignored-properties': () => (
        'https://github.com/kristerkari/stylelint-declaration-block-no-ignored-properties'
    )
};

const ruleBuilder = (resolverName) => {
    const resolver = PLUGINS_URL_RESOLVER[resolverName];

    return (name, rule) => {
        const meta         = rule.meta || {};
        const isDeprecated = meta.isDeprecated || false;

        let rawName = name;
        if (resolverName !== 'stylelint') {
            const namespacePos = name.indexOf('/');
            if (namespacePos !== -1) {
                rawName = name.substr(namespacePos + 1);
            }
        }

        const url = resolver ? resolver(rawName) : null;
        return { name, isDeprecated, url, rawName };
    };
};

module.exports = ruleBuilder;
