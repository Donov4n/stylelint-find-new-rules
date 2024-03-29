# stylelint-find-new-rules

> Find [stylelint](https://github.com/stylelint/stylelint) rules that are not configured in your stylelint config.  

> Use this for your own [Stylelint](https://github.com/stylelint/stylelint) 
> shareable configuration to list current configured rules,  
> all-available rules unused rules, and invalid / deprecated rules.

## Acknowledgment

This module is an extended version of [stylelint-find-rules](https://github.com/alexilyaev/stylelint-find-rules), created by Alex Ilyaev.

## Installation

Install as a dev dependency of your project:

```bash
# - Yarn
yarn add stylelint-find-new-rules --dev

# - NPM
npm install --save-dev stylelint-find-new-rules
```

## Usage

> It is expected to be used as local utility, as it needs `stylelint` and the `stylelint-plugins` being referred 
> by the `stylelint-config` file, to be installed. Using it as a global utility, will error out, if `stylelint` 
> and the `stylelint-plugins` being referred by the `stylelint-config` file, are not installed globally.

The intended usage is as an npm script:

```js
{
  ...
  "scripts": {
    "stylelint-find-rules": "stylelint-find-new-rules [options] <file>"
  }
  ...
}
```

__Note:__ If the `<file>` argument is not passed, this module will use the same resolution mechanism 
as Stylelint ([cosmiconfig](https://github.com/davidtheclark/cosmiconfig)) to find your config data.

Then run it with:

```bash
# - Yarn
yarn stylelint-find-rules

# - NPM
npm run --silent stylelint-find-rules
```

## Options

```
-u, --unused      Find available rules that are not configured.         [default: true]
                  To disable, set to false or use --no-u
                  
-d, --deprecated  Find deprecated configured rules.                     [default: true]
                  To disable, set to false or use --no-d
                  
-i, --invalid     Find configured rules that are no longer available.   [default: true]
                  To disable, set to false or use --no-i
                  
-c, --current     Find all currently configured rules.
-a, --available   Find all available stylelint rules.
```

## API Usage

```js
import stylelintRules from 'stylelint-find-new-rules';

const rules = await stylelintRules('./my-config-file.js');

// `rules` format:
// {
//     used       : [[RULE], [RULE], ...],
//     all        : [[RULE], [RULE], ...],
//     unused     : [[RULE], [RULE], ...],
//     deprecated : [[RULE], [RULE], ...],
//     invalid    : [[RULE], [RULE], ...]
// }
// 
// `[RULE]` format:
// {
//     name         : '[Rule name]',
//     url          : '[URL of the rule's documentation if available or `null`]',
//     isDeprecated : [boolean]
// }
```
