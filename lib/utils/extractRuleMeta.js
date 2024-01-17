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

// @see https://regex101.com/r/4d3Jpl/2
const DEPRECATED_REGEX = /result\.warn\(\s*.+,\s*{\s*.*\s*['"]?stylelintType['"]?\s*:\s*['"]deprecation['"],/i;

const extractRuleMeta = (name, rule, isPlugin) => {
    const meta = rule.meta || {};

    const deprecated = meta.deprecated === 'undefined'
        // - Hacky solution to find if the rule is deprecated since
        //   stylelint do not provide metadata for rules.
        // @see https://github.com/stylelint/stylelint/issues/2622
        ? DEPRECATED_REGEX.test(rule().toString())
        : !!meta.deprecated;

    const url = (() => {
        if (typeof meta.url === 'string') {
            return meta.url;
        }

        if (!isPlugin) {
            return PLUGINS_URL_RESOLVER.stylelint(name);
        }

        if (!name.includes('/')) {
            return null;
        }

        // @see https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String/split#description
        // eslint-disable-next-line prefer-named-capture-group -- See above (about capturing groups in split's regex).
        const [plugin, baseName] = name.split(/\/(.+)/);

        return `stylelint-${plugin}` in PLUGINS_URL_RESOLVER
            ? PLUGINS_URL_RESOLVER[`stylelint-${plugin}`](baseName)
            : null;
    })();

    return { name, isDeprecated: deprecated, url };
};

export default extractRuleMeta;
