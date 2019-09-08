# tslint-rule-sorted-lines

Ensure that a range of lines is in alphabetical order. If they aren't, run
`tslint --fix` to fix them. Nice!

Example:

```ts
// BEGIN SORTED BLOCK
const a = "a";
const b = "b";
const c = "c";
// END SORTED BLOCK
```

Example tsconfig:

```json
{
  "extends": ["tslint-rule-sorted-lines"],
  "rules": {
    "sortedLines": true
  }
}
```
