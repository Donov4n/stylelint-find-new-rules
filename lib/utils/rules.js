import { isAbsolute } from 'node:path';
import { pathToFileURL } from 'node:url';
import stylelint from 'stylelint';
import extractRuleMeta from './extractRuleMeta.js';

export const getAllRules = async (config) => {
    const allRules = Object.entries(stylelint.rules).map(
        ([name, rule]) => extractRuleMeta(name, rule, false),
    );

    if (config.plugins) {
        // @see https://github.com/stylelint/stylelint/blob/16.1.0/lib/augmentConfig.mjs#L317
        const plugins = [config.plugins].flat();
        const pluginsRules = await Promise.all(plugins.map(async (plugin) => {
            let rawPluginRules = typeof plugin !== 'string' ? plugin : (
                await import(
                    isAbsolute(plugin)
                        ? pathToFileURL(plugin).toString()
                        : plugin
                )
            );
            rawPluginRules = rawPluginRules.default || rawPluginRules; // - ESM / CommonJS.
            rawPluginRules = [rawPluginRules].flat();

            return rawPluginRules.reduce(
                (pluginRules, { ruleName: name, rule }) => {
                    if (name?.includes('/')) {
                        pluginRules.push(extractRuleMeta(name, rule, true));
                    }
                    return pluginRules;
                },
                [],
            );
        }));
        allRules.push(...pluginsRules.flat());
    }

    return allRules;
};

export const getUsedRules = async (config, allRules = null) => {
    // eslint-disable-next-line require-atomic-updates
    allRules ??= await getAllRules(config);

    const rules = Object.keys(config.rules || {})
        .filter((value, index, self) => self.indexOf(value) === index)
        .map((name) => {
            const rule = allRules.find((_rule) => _rule.name === name);
            return rule || { name, url: null };
        });

    return rules;
};
