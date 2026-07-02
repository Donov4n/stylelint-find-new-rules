import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import stylelintFindNewRules from '../lib/index.js';

const countRules = (rules, name) => rules.filter((rule) => rule.name === name).length;

test('Deduplicates plugin rules when the same plugin is configured more than once', async () => {
    const configFile = fileURLToPath(new URL('./fixtures/duplicate-plugin.config.mjs', import.meta.url));
    const { all, unused } = await stylelintFindNewRules(configFile);

    assert.equal(countRules(all, 'fixture/no-css'), 1);
    assert.equal(countRules(all, 'fixture/no-scss'), 1);
    assert.equal(countRules(unused, 'fixture/no-css'), 0);
    assert.equal(countRules(unused, 'fixture/no-scss'), 1);
});
