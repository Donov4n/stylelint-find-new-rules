'use strict';

const _               = require('lodash');
const requireRelative = require('require-relative');
const ruleBuilder     = require('./ruleBuilder');

const getStylelintRules = () => {
    const stylelint  = requireRelative('stylelint');
    const _buildRule = ruleBuilder('stylelint');

    return Object.entries(stylelint.rules).map(
        ([name, rule]) => _buildRule(name, rule)
    );
};

const getAllRules = (config) => {
    const _gatherPluginsRules = (_config) => {
        const _rules = [];

        if (_config.plugins) {
            const _plugins = Array.isArray(_config.plugins) ? _config.plugins : [_config.plugins];
            _plugins.forEach((plugin) => {
                const _buildRule = ruleBuilder(plugin);

                let pluginRules;
                pluginRules = requireRelative(plugin);
                pluginRules = pluginRules.default || pluginRules; // - ES6 or CommonJS modules
                pluginRules = Array.isArray(pluginRules) ? pluginRules : [pluginRules];

                pluginRules.forEach(({ ruleName: name, rule }) => {
                    if (!name || !name.includes('/')) {
                        return;
                    }
                    _rules.push(_buildRule(name, rule));
                });
            });
        }

        if (_config.extends) {
            const _extends = Array.isArray(_config.extends) ? _config.extends : [_config.extends];
            _extends.forEach((extendName) => {
                const extendedConfig = requireRelative(extendName);
                _rules.push(..._gatherPluginsRules(extendedConfig));
            });
        }

        return _rules;
    };

    const pluginsRules = _gatherPluginsRules(config);
    return getStylelintRules().concat(pluginsRules);
};

const getUsedRules = (config, allRules = null) => {
    if (allRules === null) {
        allRules = getAllRules(config);
    }

    const _gatherRules = (_config) => {
        const rulesNames = Object.keys(_config.rules);

        // - Extends
        if (_config.extends) {
            const _extends = Array.isArray(_config.extends) ? _config.extends : [_config.extends];

            _extends.forEach((extendName) => {
                const extendedConfig = requireRelative(extendName);
                rulesNames.push(..._gatherRules(extendedConfig));
            });
        }

        return rulesNames;
    };

    const rules = _gatherRules(config);
    return _.sortedUniq(rules).map((name) => {
        const rule = allRules.find(_rule => _rule.name === name);
        return rule || { name, url: null };
    });
};

module.exports = { getUsedRules, getAllRules, getStylelintRules };
