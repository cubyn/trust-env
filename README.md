# carotte-env-validation

Detect invalid environment variable (process.env)

## Installation

```bash
$ yarn add @devcubyn/carotte-env-validation
```

## Usage

```js
// src/index.js

require('@devcubyn/env-validation')(require('dotenv').config());
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
