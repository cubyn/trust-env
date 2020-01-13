# carotte-env-validation

Makes the usage of process.env variables more secure by validating them againt a contract.
Fails fast at process runtime if contract requirements are not met.

## Installation

```bash
$ yarn add @devcubyn/carotte-env-validation
```

## Usage

```js
// src/index.js

const env = require('@devcubyn/env-validation');
const envContract = [
  {
    key: 'DB_HOST',
    type: 'string',
  },
  {
    key: 'DB_PORT',
    type: 'number',
    default: 3306,
  },
];
env.config(envContract);

// ...
```

```js
// src/anywhere.js

const env = require('@devcubyn/env-validation');

const { DB_HOST, DB_PORT } = env.get(['DB_HOST', 'DB_PORT']);

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

### Type checks

The `type` can be:

* [those given by is.js](https://github.com/arasatasaygin/is.js#type-checks)
* `integersArray`
