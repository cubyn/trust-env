# trust-env

Validate process.env variables againt a contract for safer use.

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

// Or whatever the way env variables are injected
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
    default: 3306,
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

Make the following "top of file" validations deprecated:

```js
// src/function.js

assert(process.env.MY_ENV_VAR, Error, 'Missing env var [MY_ENV_VAR]');

async function handler({ data }) {
  // ...
}

// ...
```

## Features

- Caches `process.env` variables to work only with them (if `process.env` is updated after runtime, these changes will have no effect)
- Add an entry in contract:
  - `key`: name of the variable to look for in `process.env`
  - `type`: cast the `process.env` variable
  - `preset`: value if `process.env` variable is not found
  - `required`: whether the value must be found
  - `validator`: function to validate the `process.env` variable
  - `transform`: function to transform the `process.env` variable

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
    default: 1000,
  },
]);
```

### Validator

- Returns a boolean to validate the entry
- Params:
  - `value`: the actual `process.env` value (`type` casting applied, `default` applied if `value` is not found and `transform` applied if exists)
  - `entry`: the current entry to be validated
  - `contract`: the whole contract
  - `isJs` library

```js
env.config([
  {
    key: 'MYSQL_HOST',
    validator: ({ value }) => value.startsWith('__'),
  },
]);
```

### Transform

- Params:
  - `value`: the actual `process.env` value (`type` casting applied, `default` applied if `value` is not found and `transform` applied if exists)
  - `entry`: the current entry to be validated
  - `contract`: the whole contract
  - `isJs` library

## TODO

TODO

- Verify the `process.env` is used once and cached
- Throw and Error best practices in TS
- Test type cast (JSON, date, etc)
- Test "required"
- Give a type make it required? No (e.g: type null or undefined)
- preset as function
- Required is not compatible with several types (e.g: null or undefined)
- Issue: when validator is used instead of type, no cast done

value:

- process.env
- else preset if exists
- then cast composed type or scalar
- then transform if exists

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
