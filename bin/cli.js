#!/usr/bin/env node

'use strict';

var exit = process.exit.bind(process);

var pkg = require('../package.json'),
    runner = require('../lib');

var yargs = require('yargs'),
    path = require('path');

var cwd = process.cwd();

var argv = yargs
  .version(pkg.version)
  .alias('v', 'version')
  .option('h', {
    alias: 'help',
    type: 'boolean',
    describe: 'Show this help'
  })
  .argv;

if (argv.help) {
  yargs.showHelp();
  exit();
}

try {
  runner(argv, {
    src: path.resolve(cwd, argv._[0] || 'test'),
    dest: path.resolve(cwd, argv._[1] || 'generated')
  }, exit);
} catch (e) {
  process.stderr.write('Error: ' + (e.message || e.toString()) + '\n');
  exit(1);
}
