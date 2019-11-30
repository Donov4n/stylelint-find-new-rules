## 1.2.0 (2019-11-30)
- Update dev dependencies.
- Add stylelint 12 to supported peer dependency versions.

## 1.1.0 (2019-09-24)
- Update dependencies.
- Add stylelint 11 to supported peer dependency versions.

## 1.0.2 (2019-04-19)
- Update dependencies.
- Bump stylelint peer dependencies.
- Show the "up-to-date" message only if there are no unused, invalids or outdated rules.  
  (before this version, only unused rules was checked before showing this message)
- Fix the exit-code when outdated, invalid or unused rules are reported, it will now be non-zero in this situation.

## 1.0.1 (2018-11-19)
- Update dependencies.
- Allow for empty `rules` in top-level stylelint config. (#1).

## 1.0.0 (2018-07-03)
- First version, a complete rewrite of [stylelint-find-rules](https://github.com/alexilyaev/stylelint-find-rules) 
  with `extends` and `plugins` full support.
