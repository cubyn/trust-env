# carotte-env-validation

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
