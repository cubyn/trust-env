# trust-env

Makes the usage of process.env variables more secure by validating them againt a contract.

Fails fast at runtime if contract requirements are not met.

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

const { DB_HOST, DB_PORT } = require('../drivers/env');

// ...
```

Make "top of file" process.env validations deprecated:

```js
// DEPRECATED
// src/my-λ:v1/index.js

// ...

assert(process.env.MY_ENV_VAR, Error, 'Missing env var [MY_ENV_VAR]');

async function handler({ data }) {
  // ...
}
```

## Documentation

### Features

* Handles the case where process.env variables are updated in the code (bad practice, but can happen)

### Type checks

The `type` can be:

* [those given by is.js](https://github.com/arasatasaygin/is.js#type-checks)
* `stringsArray`
* `integersArray`
* `numbersArray`

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

### Validator

* Override `type` property validation
* Must returns a truthy to validate entry
* `type` and `validator` cannot be used in the same entry

```js
env.config([
  {
    key: 'DB_HOST',
    validator: entry => entry.startsWith('mysql'),
  },
]);
```
