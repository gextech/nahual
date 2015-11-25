#!/usr/bin/env node

'use strict';

var exit = process.exit.bind(process);

var pkg = require('../package.json'),
    runner = require('../lib');

var yargs = require('yargs'),
    path = require('path'),
    fs = require('fs');

var cwd = process.cwd();

var argv = yargs
  .version(pkg.version)
  .option('help', {
    type: 'boolean',
    describe: 'Show this help'
  })
  .option('target', {
    type: 'string',
    describe: 'Set default target for test'
  })
  .option('header', {
    type: 'string',
    describe: 'Header file for prepend (.coffee)'
  })
  .option('steps', {
    type: 'string',
    describe: 'Additional steps-directory to parse'
  })
  .option('lang', {
    type: 'string',
    describe: 'Specify the language used all sources'
  })
  .option('browser', {
    type: 'string',
    describe: 'Run tests on the specified browser(s)'
  })
  .option('server', {
    type: 'boolean',
    describe: 'Starts a static-server from `process.cwd()`'
  })
  .option('standalone', {
    type: 'boolean',
    describe: 'Starts a selenium-server-standalone instance'
  })
  .option('force', {
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
    var options = {
      src: path.resolve(cwd, argv._[0] || 'test'),
      dest: path.resolve(cwd, argv._[1] || 'generated')
    };

    delete argv._;
    delete argv.$0;

    if (argv.steps) {
      options.steps = path.resolve(cwd, argv.steps);
    }

    if (argv.header) {
      options.header = fs.readFileSync(path.resolve(cwd, argv.header)).toString();
    }

    options.header = [
      'ARGV = ' + JSON.stringify(argv),
      'ENV = ' + JSON.stringify(process.env),
      options.header || ''
    ].join('\n');

    if (argv.lang) {
      options.language = argv.lang;
    }

    runner(argv, options, next);
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
      process.env.NEWPORT = port;

      run(function(status) {
        server.close();
        exit(status);
      });
    });
  });
} else {
  run(exit);
}
