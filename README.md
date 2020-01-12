# carotte-env-validation

Make process.env usage more safe

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
    variable: 'DB_HOST',
    type: 'string',
  },
  {
    variable: 'DB_PORT',
    type: 'number',
  },
];
env.validate(envContract);

// ...
```

```js
// src/anywhere.js

const { getEnv } = require('@devcubyn/env-validation');

const { DB_HOST, DB_PORT } = getEnv(['DB_HOST', 'DB_PORT']);

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
