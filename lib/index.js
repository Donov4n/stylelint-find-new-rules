'use strict';

const { resolveConfig } = require('stylelint');
const { getAllRules, getUsedRules } = require('./utils/rules');

module.exports = async (configFile = null) => {
    const config = await resolveConfig(process.cwd(), { configFile });

    const all = getAllRules(config);
    const used = getUsedRules(config, all);
    const deprecated = used.filter(({ isDeprecated }) => isDeprecated);

    const unused = all.filter(
        ({ name, isDeprecated }) => (
            !isDeprecated && !used.find((_rule) => _rule.name === name)
        ),
    );

    const invalid = used.filter(
        ({ name }) => !all.find((_rule) => _rule.name === name),
    );

    return { all, used, unused, invalid, deprecated };
};
