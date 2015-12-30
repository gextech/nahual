# Nahual

[![Build Status](https://travis-ci.org/pateketrueke/nahual.png?branch=master)](https://travis-ci.org/pateketrueke/nahual) [![NPM version](https://badge.fury.io/js/nahual.png)](http://badge.fury.io/js/nahual) [![Coverage Status](https://coveralls.io/repos/pateketrueke/nahual/badge.png?branch=master)](https://coveralls.io/r/pateketrueke/nahual?branch=master)

![nagual](https://dl.dropboxusercontent.com/u/2726997/img/nagual.jpg)

```
$ npm install -g nahual
```

**Nahual** will glue [y2nw](https://github.com/gextech/y2nw) and [nwrun](https://github.com/gextech/nwrun) for you.

You can install `nahual` locally as library or globally as CLI:

```bash
$ npm install [-g] nahual
```

## Library usage

`nahual(argv, options, callback)`

The `argv` are for the `nwrun` process.

Remaining `options` are for the `y2nw` setup.

The `callback` will be invoked as `nwrun` result.

## CLI usage

`$ nahual [src] [dest] [OPTIONS]`

If the `src` is not provided then `./test` will be used.

If the `dest` is not provided then `./generated` will be used.
