# trust-env

Makes the usage of process.env variables more secure by validating them againt a contract.

Fails at runtime if contract requirements are not met.

## Installation

```bash
$ yarn add trust-env
```

## Usage

```js
// src/drivers/env.js

const env = require('trust-env');

// Contract for declaring and validating used variables
module.exports = env.config([
  {
    key: 'DB_HOST',
    type: 'string',
  },
  {
    key: 'DB_PORT',
    type: 'number',
    default: 3306,
  },
  {
    key: 'DEFAULT_USER',
    type: 'json',
    validator: ({ value, isJs }) => isJs.propertyDefined(value, 'name'),
  },
]);
```

```js
// src/index.js

// Or whatever the way env variables are injected
require('dotenv').config();
require('src/drivers/env');

// ...
```

```js
// src/anywhere.js

const { DB_HOST, DB_PORT, DEFAULT_USER } = require('../drivers/env');

// ...
```

Make the following "top of file" validations deprecated:

```js
// src/function.js

assert(process.env.MY_ENV_VAR, Error, 'Missing env var [MY_ENV_VAR]');

async function handler({ data }) {
  // ...
}

// ...
```

## Documentation

### Features

* Cache process.env variables and only works with these ones (avoid process.env update after runtime)
* Declare an entry in contract with the following:
  * `key`: the name of the variable to search in process.env
  * `type`: to cast process.env variable
  * `default`: value if process.env variable is not found
  * `required`: whether a value must be found
  * `validator`: function to validate the process.env variable
  * `transform`: function to validate the process.env variable

### Type checks

The `type` can be:

* `stringsArray`
* `integersArray`
* `numbersArray`
* `string`
* `integer`
* `number`
* `boolean`
* `date`
* `json`

### Default value

Even with the default value, the variable must still exist in process.env.
This avoids a "fake configuration", which is based only on the contract.

```js
env.config([
  {
    // process.env.THROTTLE_MS is not defined
    key: 'THROTTLE_MS',
    type: 'integer',
    default: 1000,
  },
]);
```

### Transform

* Params
  * `value`: the actual process.env value (`type` applied, `default` applied if `value` is not found and `transform` applied if exists)
  * `entry`: the current entry to be validated
  * `contract`: the whole contract declaration
  * `isJs`

### Validator

* Must returns a truthy to validate entry
* Params
  * `value`: the actual process.env value (`type` applied, `default` applied if `value` is not found and `transform` applied if exists)
  * `entry`: the current entry to be validated
  * `contract`: the whole contract declaration
  * `isJs`

```js
env.config([
  {
    key: 'DB_HOST',
    validator: ({ value }) => value.startsWith('__'),
  },
]);
```
