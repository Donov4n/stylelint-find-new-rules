'use strict';

const path            = require('path');
const requireRelative = require('require-relative');
const ruleBuilder     = require('./ruleBuilder');

const requireResolveRelative = (moduleName, relativePath = null) => (
    path.dirname(requireRelative.resolve(moduleName, relativePath))
);

const getStylelintRules = () => {
    const stylelint  = requireRelative('stylelint');
    const _buildRule = ruleBuilder('stylelint');

    // @see https://regex101.com/r/4d3Jpl/2
    const DEPRECATED_REGEX = /result\.warn\(\s*.+,\s*{\s*.*\s*['"]?stylelintType['"]?\s*:\s*['"]deprecation['"],/i;

    return Object.entries(stylelint.rules).map(([name, rule]) => {
        let { meta } = rule;

        // - Hacky solution to find if the rule is deprecated since
        //   stylelint do not provide metadata for rules.
        // @see https://github.com/stylelint/stylelint/issues/2622
        if (!meta) {
            const isDeprecated = DEPRECATED_REGEX.test(rule().toString());
            meta = { isDeprecated };
        }

        return _buildRule(name, { meta });
    });
};

const getAllRules = (config) => {
    const _gatherPluginsRules = (_config, relativePath = null) => {
        const _rules = [];

        if (_config.plugins) {
            const _plugins = Array.isArray(_config.plugins) ? _config.plugins : [_config.plugins];
            _plugins.forEach((plugin) => {
                const isPathPlugin = path.isAbsolute(plugin) || plugin.startsWith('.');
                const _buildRule = ruleBuilder(isPathPlugin ? '[UNKNOWN]' : plugin);

                let pluginRules;
                pluginRules = requireRelative(plugin, relativePath);
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
                const extendedConfigPath = requireResolveRelative(extendName, relativePath);
                const extendedConfig = requireRelative(extendName, relativePath);
                _rules.push(..._gatherPluginsRules(extendedConfig, extendedConfigPath));
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

    const _gatherRules = (_config, relativePath = null) => {
        const rulesNames = Object.keys(_config.rules || {});

        // - Extends
        if (_config.extends) {
            const _extends = Array.isArray(_config.extends) ? _config.extends : [_config.extends];

            _extends.forEach((extendName) => {
                const extendedConfigPath = requireResolveRelative(extendName, relativePath);
                const extendedConfig = requireRelative(extendName, relativePath);
                rulesNames.push(..._gatherRules(extendedConfig, extendedConfigPath));
            });
        }

        return rulesNames;
    };

    const rules = _gatherRules(config)
        .filter((value, index, self) => self.indexOf(value) === index)
        .map((name) => {
            const rule = allRules.find(_rule => _rule.name === name);
            return rule || { name, url: null };
        });

    return rules;
};

module.exports = { getUsedRules, getAllRules, getStylelintRules };
