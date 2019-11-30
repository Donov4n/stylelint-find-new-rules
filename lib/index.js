'use strict';

const { cosmiconfig } = require('cosmiconfig');
const { getAllRules, getUsedRules } = require('./utils/rules');

const getConfig = async function (configFile = null) {
    const explorer = cosmiconfig('stylelint');

    let _cosmiConfig;
    if (configFile) {
        _cosmiConfig = await explorer.load(configFile);
    } else {
        _cosmiConfig = await explorer.search();
    }

    if (!_cosmiConfig) {
        throw new Error(`No stylelint configuration found.`);
    }

    return _cosmiConfig.config;
};

module.exports = async function (file = null) {
    const userConfig = await getConfig(file);

    const all        = getAllRules(userConfig);
    const used       = getUsedRules(userConfig, all);
    const deprecated = used.filter(({ isDeprecated }) => isDeprecated);

    const unused = all.filter(
        ({ name, isDeprecated }) => (
            !isDeprecated && !used.find(_rule => _rule.name === name)
        )
    );

    const invalid = used.filter(
        ({ name }) => !all.find(_rule => _rule.name === name)
    );

    // eslint-disable-next-line object-curly-newline
    return { all, used, unused, invalid, deprecated };
};
