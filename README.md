# trust-env

Validate `process.env` variables against a contract for safer use.

Fails at runtime if contract requirements are not met.

## Installation

```bash
$ yarn add trust-env
```

## Usage

```ts
// src/env.ts

import dotenv from 'dotenv';
import TrustEnv from 'trust-env';

// Or whatever the way env variables are injected in Node process
dotenv.config();

// Contract for declaring and validating variables to be used
exports default TrustEnv([
  {
    key: 'MYSQL_HOST',
    type: 'string',
  },
  {
    key: 'MYSQL_PORT',
    type: 'number',
    preset: 3306,
  },
  {
    key: 'DEFAULT_USER',
    type: 'json',
    validator: ({ value, isJs }) => isJs.propertyDefined(value, 'name'),
  },
]);
```

```ts
// src/index.ts

import './env';

// ...
```

```ts
// src/anywhere.ts

import { MYSQL_HOST, MYSQL_PORT, DEFAULT_USER } from './env';

// ...
```

```ts
// src/anywhere-2.ts

import env from './env';

const MYSQL_VARIABLES = env.getPrefix('MYSQL');
const DEFAULT_USER = env.get('DEFAULT_USER');

// ...
```

Make the following "top of file" validations deprecated:

```ts
// src/function.ts

assert(process.env.MYSQL_HOST, Error, 'Missing env var [MYSQL_HOST]');

// ...
```

## Features

- Caches `process.env` variables to work only with them (if `process.env` is updated, these changes will have no effect)
- An entry in contract:
  - `key`: name of the variable to look for in `process.env`
  - `type`: cast the `process.env` variable
  - `preset`: (optional) value if `process.env` variable is not found
  - `validator`: (optional) function to validate the casted variable
  - `transform`: (optional) function to transform the casted variable
- Global options:
  - `strict`: (default: `true`) if the `process.env` variable is not found
    - `true`: throws an error
    - `false`: use `preset` (throws an error if there is no `preset`)

### Type checks

Supported `type`:

- `boolean`
- `date`
- `integer`
- `integersArray`
- `json`
- `number`
- `numbersArray`
- `string`
- `stringsArray`

### preset value

Even with the preset value, the variable must still exist in `process.env`.
This avoids a "shadow configuration", which is only based on the contract.

```ts
env.config([
  {
    // process.env.THROTTLE_MS is not defined
    key: 'THROTTLE_MS',
    type: 'integer',
    preset: 1000,
  },
]);
```

### Validator

- Returns a boolean to validate the entry
- Params:
  - `value`: the actual `process.env` value
    - `type` casting applied,
    - `preset` applied if `value` is not found
    - `transform` applied if exists
  - `entry`: the current entry to be validated
  - `contract`: the whole contract
  - `isJs` library

```js
env.config([
  {
    key: 'MYSQL_HOST',
    type: 'string',
    validator: ({ value }) => value.startsWith('__'),
  },
]);
```

### Transform

- Params:
  - `value`: the actual `process.env` value
    - `type` casting applied,
    - `preset` applied if `value` is not found
    - `transform` applied if exists
  - `entry`: the current entry to be validated
  - `contract`: the whole contract
  - `isJs` library

## TODO

- `sanitizeEntry` still required with TS?
- Lint errors are not shown
- preset as function
- Issue: when validator is used instead of type, no cast done

when the `type` is validated? NEVER

- then validate if exists

- `type` must be scalar
- value is casted with type
- value is validated by `type`
- value is validated by validator for more complex type is required (e.g: IP)

{
key: 'DB_USER',
type: 'integer',
}
would give { DB_USER: 0 }, validated as integer so no error thrown

SO: CANNOT USE type TO VALIDATE value SINCE IT'S NOT POSSIBLE TO GUESS THE RAW
PROCESS.ENV TYPE
SO: TYPE IS ONLY USED FOR CAST
