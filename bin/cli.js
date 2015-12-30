'use strict';

var exit = process.exit.bind(process);

var pkg = require('../package.json'),
    runner = require('../lib');

var yargs = require('yargs'),
    path = require('path');

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
    type: 'string',
    describe: 'Run shell command as a testing support server'
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

try {
  runner(argv, {
    src: path.resolve(cwd, argv._[0] || 'test'),
    dest: path.resolve(cwd, argv._[1] || 'generated')
  }, exit);
} catch (e) {
  process.stderr.write('Error: ' + (e.message || e.toString()) + '\n');
  exit(1);
}
