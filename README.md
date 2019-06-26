# carotte-env-validation

> Make invalid env variables to fail launch service at runtime

Make "top of file" env variables validation deprecated:

```js
// DEPRECATED
// src/my-λ:v1/index.js

// ...

assert(process.env.MY_ENV_VAR, Error, 'Missing env var [MY_ENV_VAR]');

async function handler({ data }) {
  // ...
}
```

## Installation

```bash
$ yarn add @devcubyn/carotte-env-validation
```

## Usage

In main service file `src/index.js`:

```js
require('@devcubyn/env-validation')(require('dotenv').config());
require('carotte-loader')(require('./drivers/carotte'), require('@devcubyn/core.logger'));
require('./drivers/healthcheck');
require('./drivers/knex');
```
