import config from '@pulsanova/eslint-config-node';

export default [
    ...config,
    {
        files: ['index.d.ts'],
        languageOptions: {
            parserOptions: {
                projectService: {
                    allowDefaultProject: ['index.d.ts'],
                },
            },
        },
    },
];
