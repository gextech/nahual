[![Build Status](https://travis-ci.org/gextech/nawal.png?branch=master)](https://travis-ci.org/gextech/nawal) [![NPM version](https://badge.fury.io/js/nawal.png)](http://badge.fury.io/js/nawal) [![Coverage Status](https://coveralls.io/repos/gextech/nawal/badge.png?branch=master)](https://coveralls.io/r/gextech/nawal?branch=master)

**Nawal** will glue [y2nw](https://github.com/gextech/y2nw) and [nwrun](https://github.com/gextech/nwrun) for you.

You can install `nawal` locally as library or globally as CLI:

```bash
$ npm install [-g] nawal
```

## Library usage

`nawal(argv, options, callback)`

The `argv` are for the `nwrun` process.

Remaining `options` are for the `y2nw` setup.

The `callback` will be invoked as `nwrun` result.

## CLI usage

`$ nawal [src] [dest] [OPTIONS]`

If the `src` is not provided then `./test` will be used.

If the `dest` is not provided then `./generated` will be used.
