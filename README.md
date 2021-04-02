# trust-env

Validate `process.env` variables against a contract for safer use.

Fails at runtime if contract requirements are not met.

## Installation

```bash
yarn add trust-env
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
  },
  {
    key: 'MYSQL_SSL',
    type: 'string',
    // Allow process.env.MYSQL_SSL to be not found in process.env
    // env.MYSQL_SSL returns undefined
    required: false,
  },
  {
    key: 'MYSQL_PASSWORD',
    type: 'string',
    // Allow process.env.MYSQL_PASSWORD to be not found in process.env
    required: false,
    // env.MYSQL_PASSWORD returns 'root'
    preset: 'root',
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

## Typing

```ts
// src/env.ts

import dotenv from 'dotenv';
import TrustEnv from 'trust-env';

dotenv.config();

type Env = {
  BASE_API_URL: string;
  APPLICATION_KEY: string;
};

/* pass your type as a generic */
export default TrustEnv<Env>([
  { key: 'BASE_API_URL', type: 'string' },
  { key: 'APPLICATION_KEY', type: 'string' },
]);
```

```ts
// src/anywhere.ts

import env from '@env';

interface Environment {
  BASE_API_URL: string;
}

export const myMethod = (environment: Environment = env) => {
  console.log(environment.BASE_API_URL);
};
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
- `required`: (_optional_, default: `true`) `process.env` variable is not found
- `preset`: (_optional_) used when `process.env` variable is not found and is not required. Is cast.
- `transform`: (_optional_) function to transform the cast variable
- `validator`: (_optional_) function to validate the cast and transformed variable

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
