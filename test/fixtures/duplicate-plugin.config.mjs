const plugin = [
    {
        ruleName: 'fixture/no-css',
        rule: () => {},
    },
    {
        ruleName: 'fixture/no-scss',
        rule: () => {},
    },
];

export default {
    // The same plugin is listed twice to emulate separate CSS and SCSS configs.
    plugins: [plugin, plugin],
    rules: {
        'fixture/no-css': true,
        // `fixture/no-scss` is intentionally absent from `rules`,
        // so it should be reported as unused once.
    },
};
