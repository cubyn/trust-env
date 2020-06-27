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
export default TrustEnv([
  {
    key: 'MYSQL_HOST',
    type: 'string',
  },
  {
    key: 'MYSQL_PORT',
    // Cast process.env.MYSQL_PORT into number
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

import env from './env';

// Access to variables
const { MYSQL_PORT } = env;
const DEFAULT_USER = env.get('DEFAULT_USER');
const MYSQL_VARIABLES = env.getPrefix('MYSQL');

// ...
```

Make the following "top of file" validations deprecated:

```ts
// src/function.ts

assert(process.env.MYSQL_HOST, Error, 'Missing env var [MYSQL_HOST]');

// ...
```

## Features

Caches `process.env` variables to work only with it (if `process.env` is updated, changes will have no effect)

An entry in the contract:

- `key`: name of the variable to look for in `process.env`
- `type`:
  - cast the actual `process.env` variable
  - supported:
    - `boolean`
    - `date`
    - `integer`
    - `integersArray`
    - `json`
    - `number`
    - `numbersArray`
    - `string`
    - `stringsArray`
- `preset`: (_optional_)
  - value if `process.env` variable is undefined
  - doesn't have to be the same type as `type`
- `transform`: (_optional_) function to transform the cast variable
- `validator`: (_optional_) function to validate the cast and transformed variable

Global options:

- `strict`: (_default: `true`_) if the `process.env` variable is not found
  - `true`: throws an error
  - `false`: use `preset` (throws an error if there is no `preset`)

### Transform

- Params:
  - `value`: the cast `process.env` value
  - `entry`: the current entry to be validated
  - `contract`: the whole contract
  - `isJs` library

### Validator

- Returns a boolean to validate the `process.env` value
- Params:
  - `value`: the cast and transformed `process.env` value
  - `entry`: the current entry to be validated
  - `contract`: the whole contract
  - `isJs` library

```js
TrustEnv([
  {
    key: 'MYSQL_HOST',
    type: 'string',
    validator: ({ value }) => value.startsWith('__'),
  },
]);
```
