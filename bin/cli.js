#!/usr/bin/env node

'use strict';

var runner = require('../lib');

var yargs = require('yargs');

runner(yargs.argv, process.exit.bind(process));
