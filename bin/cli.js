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
  .option('t', {
    alias: 'target',
    type: 'string',
    describe: 'Set default target for test'
  })
  .option('b', {
    alias: 'browser',
    type: 'string',
    describe: 'Run tests on the specified browser(s)'
  })
  .option('S', {
    alias: 'server',
    type: 'boolean',
    describe: 'Starts a static-server from `process.cwd()`'
  })
  .option('s', {
    alias: 'standalone',
    type: 'boolean',
    describe: 'Starts a selenium-server-standalone instance'
  })
  .option('f', {
    alias: 'force',
    type: 'boolean',
    describe: 'Force the *.jar download (use with --standalone)'
  })
  .argv;

if (argv.help) {
  yargs.showHelp();
  exit();
}

function run(next) {
  try {
    runner(argv, {
      src: path.resolve(cwd, argv._[0] || 'test'),
      dest: path.resolve(cwd, argv._[1] || 'generated')
    }, next);
  } catch (e) {
    process.stderr.write('Error: ' + (e.message || e.toString()) + '\n');
    exit(1);
  }
}

if (argv.server) {
  var express = require('express'),
      newport = require('newport');

  newport(function(err, port){
    if (err) {
      process.stderr.write((err.message || err.toString()) + '\n');
      exit(2);
    }

    var app = express();

    app.use(express.static(cwd));

    var server = app.listen(port, function () {
      process.env.PORT = port;

      run(function(status) {
        server.close();
        exit(status);
      });
    });
  });
} else {
  run(exit);
}
