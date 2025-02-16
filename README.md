# eslint-plugin-path-checker

fsd related paths checkers

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-path-checker`:

```sh
npm install eslint-plugin-path-checker --save-dev
```

## Usage

In your [configuration file](https://eslint.org/docs/latest/use/configure/configuration-files#configuration-file), import the plugin `eslint-plugin-path-checker` and add `path-checker` to the `plugins` key:

```js
import path-checker from "eslint-plugin-path-checker";

export default [
    {
        plugins: {
            path-checker
        }
    }
];
```


Then configure the rules you want to use under the `rules` key.

```js
import path-checker from "eslint-plugin-path-checker";

export default [
    {
        plugins: {
            path-checker
        },
        rules: {
            "path-checker/rule-name": "warn"
        }
    }
];
```



## Configurations

<!-- begin auto-generated configs list -->
TODO: Run eslint-doc-generator to generate the configs list (or delete this section if no configs are offered).
<!-- end auto-generated configs list -->



## Rules

<!-- begin auto-generated rules list -->
TODO: Run eslint-doc-generator to generate the rules list.
<!-- end auto-generated rules list -->


