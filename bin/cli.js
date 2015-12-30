'use strict';

var exit = process.exit.bind(process);

var pkg = require('../package.json'),
    runner = require('../lib');

var minimist = require('minimist'),
    path = require('path');

var cwd = process.cwd(),
    argv = minimist(process.argv.slice(2), {
      '--': true,
      boolean: ['version', 'help', 'force', 'standalone'],
      string: ['target', 'prelude', 'steps', 'lang', 'browser']
    });

process.name = 'nahual';

if (argv.help) {
  console.log(function() {/**---
Usage:
  nahual [SRC] [DEST] [OPTIONS] [-- COMMAND]

Options:
  --standalone  Spawn a local selenium-server
  --force       Always download the selenium-server
  --browser     Use a different browser for tests
  --prelude     Prepends a .coffee file before all steps
  --target      Nightwatch's target to execute
  --steps       Path for scanning additional steps
  --lang        Use a different language for all sources

The given command after -- will be spawned before running the tests
---*/}.toString().match(/---([\s\S]+)---/)[1].trim());
  exit();
}

if (argv.version) {
  console.log(pkg.name + ' v' + pkg.version);
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
